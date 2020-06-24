function tree_vertex_shader() {
    return `
        precision highp float;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform vec3 cameraPosition;
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

        uniform float speed;
        uniform float min_strength;
        uniform float max_strength;
        uniform float interval;
        uniform float detail;
        uniform float distortion;
        uniform vec2 direction;
        uniform float height_offset;

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

        vec3 get_wind(mat3 modelmat, vec3 vertex, float timer){
            vec3 pos = modelmat * mix(vec3(1.0), vertex, distortion);
            float tm = timer * speed + pos.x + pos.z;
            float diff = pow(max_strength - min_strength, 2.0);
            float strength = clamp(min_strength + diff + sin(tm / interval) * diff, min_strength, max_strength);
            float wind = (sin(tm) + cos(tm * detail)) * strength * max(0.0, vertex.y - height_offset);
            vec2 dir = normalize(direction);
            
            return vec3(wind * dir.x, 0.0, wind * dir.y);
        }

        void main() {
            vec3 newpos = translate;
            newpos.x += 200.0 * noise(newpos.xz);
            newpos.z += 100.0 * noise(newpos.zx);
            newpos +=  vec3(xoffset, 0.0, yoffset);
            float y = rigged_multifractal(newpos.xz/10000.0); 
            y *= scale;
            height = y;
            newpos -=  vec3(xoffset, 0.0, yoffset);


            //vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );
            float sc =  40.0 * noise(newpos.xz);
            //sc = 10.0;
            sc = sc * 10.0 + 10.0;
            newpos.y = height + sc * 0.5;
            //mvPosition.xyz += position * sc;
            v_scale = 1.0;
            v_uv = uv;

            mat3 modelmat;
            vec3 vup = vec3(0.0, 1.0, 0.0);
            vec3 v1 = normalize(cameraPosition - translate);
            v1.y = 0.0;
            vec3 v3 = normalize(cross(vup, v1));

            modelmat[0][0] = v1.x;
            modelmat[0][1] = v1.y;
            modelmat[0][2] = v1.z;

            //// Second colunm.
            modelmat[1][0] = vup.x;
            modelmat[1][1] = vup.y;
            modelmat[1][2] = vup.z;

            //// Thrid colunm.
            modelmat[2][0] = v3.x;
            modelmat[2][1] = v3.y;
            modelmat[2][2] = v3.z;
            vec3 pos = position.xyz;

            pos = modelmat * pos;

            //pos += get_wind(modelmat, pos, time);
            newpos.xyz += pos * sc;
            //newpos += get_wind(modelmat, pos, time);
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newpos, 1.0);

            world_pos = newpos.xyz;
        } 
    `
}
function tree_fragment_shader() {
    return `
        precision highp float;
        uniform float H;
        uniform float lacuarity;
        uniform float octaves;
        uniform float offset;
        uniform float gain;
        uniform float scale;
        uniform vec3 sun_position;


        uniform sampler2D tree_texture;
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


            vec4 tree_tex = texture2D(tree_texture, v_uv);
            if (tree_tex.w < 0.5 || height < 250.0 || height > 700.0) discard;

            vec4 light_color = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 ambient = vec4(0.1 * vec3(1.0, 1.0, 1.0), 1.0);

            vec3 nor = norm;
            vec3 light_dir = normalize(sun_position);
            float diff = max(dot(norm, light_dir), 0.0);
            vec4 diffuse = diff * light_color;
            vec3 env_color = vec3(textureCube(env_map, world_pos));

            vec3 col = tree_tex.xyz;
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );

            gl_FragColor = mix((ambient + diffuse) * vec4(col , 1.0), vec4(env_color, 1.0), 0.1 );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, env_color, fogFactor );
            gl_FragColor.a = tree_tex.a;
        }
    `
}

function generate_tree() {
    var uniforms = {
        H : {type: 'float', value: 0.75}, 
        lacuarity: {type: 'float', value: 3.6},
        octaves: {type: 'float', value: 5.0},
        offset: {type: 'float', value: 1},
        gain: {type: 'float', value: 1.6},
        scale: {type: 'float', value: 200},
        xoffset: {type: 'float', value: 0.0},
        yoffset: {type: 'float', value: 0.0},
        tree_texture: {type: 'sampler2D', value: null},
        env_map: {type: 'samplerCube', value: null},
        fogColor:    { type: "c", value: new THREE.Vector3(0.45, 0.5, 0.67) },
        fogNear:     { type: "f", value: 5000 },
        fogFar:      { type: "f", value: 20000 },
        sun_position : {type: 'vec3', value: new THREE.Vector3(0, 1, 0)},
        speed: {type: 'float', value: 10.0},
        min_strength: {type: 'float', value: 0.0},
        max_strength: {type: 'float', value: 20.0},
        interval: {type: 'float', value: 1.5},
        detail: {type: 'float', value: 94.0},
        distortion: {type: 'float', value: 0.3},
        direction: {type: 'float', value: new THREE.Vector2(0.0, 1.0).normalize()},
        height_offset: {type: 'float', value: 0.0},
        time: {type: 'float', value: 0.0},
    };

    var material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        fragmentShader: tree_fragment_shader(),
        vertexShader: tree_vertex_shader(),
        //depthTest: true,
        //side: THREE.DoubleSide,
        //depthWrite: true

    });

    var circleGeometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);
    circleGeometry.rotateY( - Math.PI / 2 );

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = circleGeometry.index;
    geometry.attributes = circleGeometry.attributes;

    var dim = 64;
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

    var tree = new THREE.Mesh( geometry, material );
    tree.frustumCulled = false;
    tree.scale.set( 1, 1, 1 );


    return tree;
}
