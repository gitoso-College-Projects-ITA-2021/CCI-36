function grass_vertex_shader() {
    return `
		precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		uniform mat4 modelMatrix;
		uniform float time;

		attribute vec3 position;
		attribute vec2 uv;
		attribute vec3 translate;

        uniform float H;
        uniform float lacuarity;
        uniform float octaves;
        uniform float offset;
        uniform float gain;
        uniform float scale;
        uniform float xoffset;
        uniform float yoffset;

        varying vec3 frag_pos;
        varying vec3 norm;
        varying vec2 v_uv;
        varying float height;
        varying vec3 world_pos;
        varying vec3 reflectdir;
        varying float v_scale;



        float random (in vec2 p) {
            return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        // https://www.shadertoy.com/view/4dS3Wd
        float noise (in vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }

        #define NUM_OCTAVES 6
        #define MAX_OCTAVES 20

        float fbm ( in vec2 st) {
            float value = 1.0;
            float H = 0.204;
            float offset = 0.80;
            for (int i = 0; i < NUM_OCTAVES; i++) {
                value *= (noise(st) + offset) * pow (2.0, -H * float(i));
                st *= 2.0;
            }
                
            return value;
        }

        float rigged_multifractal(in vec2 point) {
            float frequency = 1.0;
            float signal = abs(noise(point));
            signal = offset - signal;
            signal *= signal;
            float result = signal;
            float weight = 1.0;
            int n = int(octaves);
            for (int i = 0; i < MAX_OCTAVES; i++) {
                point *= lacuarity;
                weight = signal * gain;
                clamp(weight, 0.0, 1.0);
                signal = abs(noise(point));
                signal = offset - signal;
                signal *= signal;
                signal *= weight;
                result += float(i < n) * signal * pow(frequency, -H);
                frequency *= lacuarity;
            }

            return result;
        }
        
        void main() {
            vec3 newpos = translate + vec3(xoffset, 0.0, yoffset);
            float y = rigged_multifractal(newpos.xz/10000.0); 
            y *= scale;
            height = y;
            newpos.y = height + 10.0;


			//vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );
			float sc =  1.0;
			sc = sc * 10.0 + 10.0;
			//mvPosition.xyz += position * sc;
            newpos.xyz += position * sc;
			v_scale = 1.0;
			v_uv = uv;

			gl_Position = projectionMatrix *  modelViewMatrix * vec4(newpos, 1.0);

            world_pos = newpos.xyz;
        } 
    `
}
function grass_fragment_shader() {
    return `
		precision highp float;
        #extension GL_OES_standard_derivatives : enable
        uniform float H;
        uniform float lacuarity;
        uniform float octaves;
        uniform float offset;
        uniform float gain;
        uniform float scale;
        uniform vec3 sun_position;

        uniform sampler2D grass_texture;
        uniform samplerCube env_map;

        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;

        varying vec3 frag_pos;
        varying vec3 world_pos;
        varying vec3 norm;
        varying vec2 v_uv;
        varying float height;
        varying vec3 reflectdir;
        varying float v_scale;


        void main() {


            vec4 grass_tex = texture2D(grass_texture, v_uv);
            if (grass_tex.w < 0.5) discard;

            vec4 light_color = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 ambient = vec4(0.1 * vec3(1.0, 1.0, 1.0), 1.0);

            vec3 nor = norm;
            vec3 light_dir = normalize(sun_position);
            float diff = max(dot(norm, light_dir), 0.0);
            vec4 diffuse = diff * light_color;
            vec3 env_color = vec3(textureCube(env_map, world_pos));

            vec3 col = grass_tex.xyz;
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );

            gl_FragColor = mix((ambient + diffuse) * vec4(col , 1.0), vec4(env_color, 1.0), 0.1 );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, env_color, fogFactor );
            gl_FragColor.a = grass_tex.a;
        }
    `
}

function generate_grass() {
    var uniforms = {
        H : {type: 'float', value: 0.75}, 
        lacuarity: {type: 'float', value: 3.6},
        octaves: {type: 'float', value: 5.0},
        offset: {type: 'float', value: 1},
        gain: {type: 'float', value: 1.6},
        scale: {type: 'float', value: 200},
        xoffset: {type: 'float', value: 0.0},
        yoffset: {type: 'float', value: 0.0},
        grass_texture: {type: 'sampler2D', value: null},
        env_map: {type: 'samplerCube', value: null},
        fogColor:    { type: "c", value: new THREE.Vector3(0.45, 0.5, 0.67) },
        fogNear:     { type: "f", value: 5000 },
        fogFar:      { type: "f", value: 20000 },
        sun_position : {type: 'vec3', value: new THREE.Vector3(0, 1, 0)},
    };
    var material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        fragmentShader: grass_fragment_shader(),
        vertexShader: grass_vertex_shader(),
        depthTest: true,
        side: THREE.DoubleSide,
        depthWrite: true

    });

	var circleGeometry = new THREE.CircleBufferGeometry( 1, 6 );

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = circleGeometry.index;
    geometry.attributes = circleGeometry.attributes;

    var dim = 512;
    var particleCount = dim * dim;

    var translateArray = new Float32Array( particleCount * 3 );


    var i3 = 0;
    for (var x = -10000.0; x < 10000; x += 20000.0/(dim) ) {
        for (var z = -10000.0; z < 10000; z += 20000.0/(dim) ) {
            translateArray[ i3 + 0 ] = x;
            translateArray[ i3 + 1 ] = 0.0;
            translateArray[ i3 + 2 ] = z;
            i3 += 3;
        }
    }

    geometry.setAttribute( 'translate', new THREE.InstancedBufferAttribute( translateArray, 3 ) );

    var grass = new THREE.Mesh( geometry, material );
    grass.scale.set( 1, 1, 1 );


    return grass;
}
