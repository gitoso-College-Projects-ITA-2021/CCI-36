function vertex_shader() {
    return `
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
            v_uv = 16.0 * uv;
            vec3 offset = vec3(-1.0, 0.0, 1.0);
            vec3 newpos = position + vec3(xoffset, 0.0, yoffset);
            float y = rigged_multifractal(newpos.xz/7500.0); 
            y *= scale;
            height = y;
            vec4 p = vec4(position.x, y, position.z, 1.0);
            vec4 poff = vec4(newpos.x, y, newpos.z, 1.0);
            vec3 pos = newpos + offset.zyy;
            y = rigged_multifractal(pos.xz/7500.0); 
            y *= scale;
            vec4 p1 = vec4(pos.x, y, pos.z, 1.0);
            pos = newpos + offset.yyx;
            y = rigged_multifractal(pos.xz/7500.0); 
            y *= scale;
            vec4 p2 = vec4(pos.x, y, pos.z, 1.0);
            norm = normalize(cross((p1 - poff).xyz, (p2 - poff).xyz));
            frag_pos = (modelMatrix * p).xyz;
            world_pos = p.xyz;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * p;
        } 
    `
}
function fragment_shader() {
    return `
        #extension GL_OES_standard_derivatives : enable
        uniform float H;
        uniform float lacuarity;
        uniform float octaves;
        uniform float offset;
        uniform float gain;
        uniform float scale;

        uniform sampler2D rock_texture;
        uniform sampler2D grassrock_texture;
        uniform sampler2D forest_texture;
        uniform sampler2D sand_texture;

        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;

        varying vec3 frag_pos;
        varying vec3 world_pos;
        varying vec3 norm;
        varying vec2 v_uv;
        varying float height;


        void main() {
            vec4 rock_tex = texture2D(rock_texture, v_uv);
            vec4 grassrock_tex = texture2D(grassrock_texture, v_uv);
            vec4 forest_tex = texture2D(forest_texture, v_uv);
            vec4 sand_tex = texture2D(sand_texture, v_uv);

            vec4 light_color = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 ambient = vec4(0.1, 0.1, 0.1, 1.0);


            vec4 water_color = vec4(0.0, 0.0, 1.0, 1.0);
            vec4 colors[5];
            colors[0] = water_color;
            colors[1] = sand_tex;
            colors[2] = forest_tex;
            colors[3] = grassrock_tex;
            colors[4] = rock_tex;

            vec3 col = vec3(0);
            float w = height/(gain * scale);
            vec2 layers[5];
            layers[0] = vec2(-10.0, 200.0);
            layers[1] = vec2(150.0, 300.0);
            layers[2] = vec2(200.0, 500.0);
            layers[3] = vec2(400.0, 800.0);
            layers[4] = vec2(700.0, 2000.0);


            for (int i = 0; i < 5; i++)
            {
                float range = layers[i].y - layers[i].x;
                float weight = (range - abs(height - layers[i].y)) / range;
                weight = max(0.0, weight);
                col += weight * colors[i].rgb;
            }

            vec3 nor = norm;
            vec3 light_dir = normalize(vec3(0.0, 1.0, 0.0));
            float diff = max(dot(norm, light_dir), 0.0);
            vec4 diffuse = diff * light_color;
            const vec4 fog_color = vec4(0.47, 0.5, 0.67, 0.0);


            //col = rock_tex.xyz;
            gl_FragColor = (ambient + diffuse) * vec4(col , 1.0);
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
            //gl_FragColor = vec4(nor, 1.0);
        }
    `
}
function generate_terrain() {
    var terrain_geom = new THREE.PlaneBufferGeometry(7500, 7500, 5*255, 5*255);
    terrain_geom.rotateX( - Math.PI / 2 );
    var uniforms = {
        H : {type: 'float', value: 0.75}, 
        lacuarity: {type: 'float', value: 3.6},
        octaves: {type: 'float', value: 5.0},
        offset: {type: 'float', value: 1},
        gain: {type: 'float', value: 1.6},
        scale: {type: 'float', value: 200},
        xoffset: {type: 'float', value: 0.0},
        yoffset: {type: 'float', value: 0.0},
        rock_texture: {type: 'sampler2D', value: null},
        grassrock_texture: {type: 'sampler2D', value: null},
        forest_texture: {type: 'sampler2D', value: null},
        sand_texture: {type: 'sampler2D', value: null},
        fogColor:    { type: "c", value: new THREE.Vector3(0.45, 0.5, 0.67) },
        fogNear:     { type: "f", value: 500 },
        fogFar:      { type: "f", value: 10000 }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragment_shader(),
        vertexShader: vertex_shader(),
    });

    var terrain = new THREE.Mesh( terrain_geom, material );

    return terrain;
}
