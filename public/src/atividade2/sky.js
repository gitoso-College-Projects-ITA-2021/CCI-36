function sky_vertex_shader() {
    return `
        uniform vec3 sun_position;
        uniform float rayleigh;
        uniform float turbidity;
        uniform float mie_coeff;
        uniform vec3 up;

        varying vec3 v_worldpos;
        varying vec3 v_sundir;
        varying float v_sunfade;
        varying vec3 v_betar;
        varying vec3 v_betam;
        varying float v_sune;

        const float e = 2.71828182845904523536028747135266249775724709369995957;
        const float pi = 3.141592653589793238462643383279502884197169;

        // comprimento de onda usado para as cores primárias
        const vec3 lambda = vec3(680-9, 550-9, 450-9);
        const vec3 total_rayleigh = vec3(5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5);

        const float v = 4.0;
        const vec3 K = vec3(0.686, 0.678, 0.666);
        const vec3 mie_const = vec3(1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14);

        const float cutoff_angle = 1.6110731556870734;
        const float steepness = 1.5;
        const float EE = 1000.0;

        float sun_intensity(float zenith_anglecos) {
            zenith_anglecos = clamp(zenith_anglecos, -1.0, 1.0);
            return EE * max(0.0, 1.0 - pow(e, -((cutoff_angle - acos(zenith_anglecos)) / steepness)));
        }

        vec3 total_mie(float T) {
            float c = (0.2 * T) * 10E-18;
            return 0.434 * c * mie_const;
        }

        void main() {
            vec4 world_pos = modelMatrix * vec4(position, 1.0);
            v_worldpos = world_pos.xyz;

            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            gl_Position.z = gl_Position.w;

            v_sundir = normalize(sun_position);
            v_sune = sun_intensity(dot(v_sundir, up));
            v_sunfade = 1.0 - clamp(1.0 - exp((sun_position.y/450000.0)), 0.0, 1.0);

            float rayleigh_coeff = rayleigh - (1.0 * (1.0 - v_sunfade));

            v_betar = total_rayleigh * rayleigh_coeff;
            v_betam = total_mie(turbidity) * mie_coeff;
        }

    `
}

function sky_fragment_shader() {
    return `
        varying vec3 v_worldpos;
        varying vec3 v_sundir;
        varying float v_sunfade;
        varying vec3 v_betar;
        varying vec3 v_betam;
        varying float v_sune;

        uniform float luminance;
        uniform float mie_directionalg;
        uniform vec3 up;


        const vec3 camera_pos = vec3(0.0, 0.0, 0.0);

        const float pi = 3.141592653589793238462643383279502884197169;

        const float n = 1.0003;
        const float N = 2.545E25;

        const float raylegh_zenith_length = 8.4E3;
        const float mie_zenith_length = 1.25E3;
        const float sun_angular_diameter_cos = 0.999956676946448443553574619906976478926848692873900859324;

		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
        const float ONE_OVER_FOURPI = 0.07957747154594767;

        float raylegh_phase(float cos_theta) {
            return THREE_OVER_SIXTEENPI * (1.0 + cos_theta * cos_theta);
        }

        float hg_pahse(float cos_theta, float g) {
            float g2 = g * g;
            float inverse = 1.0 / pow(1.0 - 2.0 * g * cos_theta + g2, 1.5);
            return ONE_OVER_FOURPI * ((1.0 - g2) * inverse);
        }

        const float A = 0.15;
		const float B = 0.50;
		const float C = 0.10;
		const float D = 0.20;
		const float E = 0.02;
		const float F = 0.30;

        const float whiteScale = 1.0748724675633854;

        vec3 uncharted2tonemap(vec3 x) {
            return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F; 
        }

        void main() {
            vec3 direction = normalize(v_worldpos - camera_pos);

            float zenith_angle = acos(max(0.0, dot(up, direction)));
            float inverse = 1.0 / (cos(zenith_angle) + 0.15 * pow(93.885 - ((zenith_angle * 180.0) / pi), -1.253));
            float sR = raylegh_zenith_length * inverse;
            float sM = mie_zenith_length * inverse;

            vec3 Fex = exp(-(v_betar * sR + v_betam * sM));

            float cos_theta = dot(direction, v_sundir);
            float r_phase = raylegh_phase(cos_theta * 0.5 + 0.5);
            vec3 betar_theta = v_betar * r_phase;

            float m_phase = hg_pahse(cos_theta, mie_directionalg);
            vec3 betam_theta = v_betam * m_phase;

            vec3 Lin = pow(v_sune * ((betar_theta + betam_theta) / (v_betar + v_betam)) * (1.0 - Fex), vec3(1.5));
            Lin *= mix(vec3(1.0), pow(v_sune * ((betar_theta + betam_theta) / (v_betar + v_betam)) * Fex, vec3(1.0 /2.0)), clamp(pow(1.0 - dot(up, v_sundir), 5.0), 0.0, 1.0));

            float theta = acos(direction.y);
            float phi = atan(direction.z, direction.x);
            vec2 uv = vec2(phi, theta) / vec2(2.0 * pi, pi) + vec2(0.5, 0.0);
            vec3 L0 = vec3(0.1) * Fex;

            float sundisk = smoothstep(sun_angular_diameter_cos, sun_angular_diameter_cos + 0.00002, cos_theta);
            L0 += (v_sune * 19000.0 * Fex) * sundisk;

            vec3 tex_color = (Lin + L0) * 0.04 + vec3(0.0, 0.0003, 0.00075);

            vec3 curr = uncharted2tonemap((log2(2.0 / pow(luminance, 4.0))) * tex_color);
            vec3 color = curr * whiteScale;

            vec3 ret_color = pow(color, vec3(1.0 / (1.2 + (1.2 * v_sunfade))));
            gl_FragColor = vec4(ret_color, 1.0);
        }
    `
}

function generate_sky() {
    var uniforms = {
        up : {type: 'vec3', value: new THREE.Vector3(0, 1, 0)},
        sun_position : {type: 'vec3', value: new THREE.Vector3(0, 1, 0)},
        rayleigh : {type: 'float', value: 1},
        turbidity : {type: 'float', value: 2},
        luminance : {type: 'float', value: 1},
        mie_coeff : {type: 'float', value: 0.00005},
        mie_directionalg : {type: 'float', value: 0.8},
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: sky_fragment_shader(),
        vertexShader: sky_vertex_shader(),
        side: THREE.BackSide,
		depthWrite: false,
        fog: true,
    });
    var sky = new THREE.Mesh( new THREE.BoxBufferGeometry(1, 1, 1), material );

    return sky;
}

function update_sun(sky, sun_light, inclination, azimuth, distance) {
    var theta = Math.PI * (inclination - 0.5);
    var phi = 2 * Math.PI * (azimuth - 0.5);

    sun_light.position.x = distance * Math.cos(phi);
    sun_light.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sun_light.position.z = distance * Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sun_position'].value.copy(sun_light.position).normalize();
}
