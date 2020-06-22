// Three.js setup
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000)
var renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("main-canvas"),
  alpha:false,
  antialias:true
})
var gl = renderer.domElement.getContext('webgl') ||
                renderer.domElement.getContext('experimental-webgl');
gl.getExtension('OES_standard_derivatives');
renderer.setSize(window.innerWidth, window.innerHeight)
var loader = new THREE.TextureLoader()

// Enviroment
var loader_cube = new THREE.CubeTextureLoader();

var textureCube = loader_cube.load( [
        'assets/skybox_space/nx.png', 'assets/skybox_space/px.png',
        'assets/skybox_space/py.png', 'assets/skybox_space/ny.png',
        'assets/skybox_space/pz.png', 'assets/skybox_space/nz.png',
] );

scene.background = textureCube;
scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

var terrain = generate_terrain();
scene.add(terrain);

var rock_texture = loader.load('assets/terrain_textures/rock_ground_diff_1k.jpg');
rock_texture.wrapS = THREE.RepeatWrapping;
rock_texture.wrapT = THREE.RepeatWrapping;
rock_texture.repeat.set( 4, 4 );

var grassrock_texture = loader.load('assets/terrain_textures/aerial_grass_rock_diff_2k.jpg');
grassrock_texture.wrapS = THREE.RepeatWrapping;
grassrock_texture.wrapT = THREE.RepeatWrapping;
grassrock_texture.repeat.set( 4, 4 );

var forest_texture = loader.load('assets/terrain_textures/forrest_ground_01_diff_2k.jpg');
forest_texture.wrapS = THREE.RepeatWrapping;
forest_texture.wrapT = THREE.RepeatWrapping;
forest_texture.repeat.set( 4, 4 );

var sand_texture = loader.load('assets/terrain_textures/sand_01_diff_2k.jpg');
sand_texture.wrapS = THREE.RepeatWrapping;
sand_texture.wrapT = THREE.RepeatWrapping;
sand_texture.repeat.set( 4, 4 );

terrain.material.uniforms.rock_texture.value = rock_texture;

terrain.material.uniforms.grassrock_texture.value = grassrock_texture;

terrain.material.uniforms.forest_texture.value = forest_texture;

terrain.material.uniforms.sand_texture.value = sand_texture;

camera.position.set(0.0,  2000.0, 4000.0);
camera.lookAt(0.0, 0.0, 0.0);
var controls = new THREE.OrbitControls(camera, renderer.domElement)

var terrain_uniforms = terrain.material.uniforms;

var gui = new dat.GUI();

var folder = gui.addFolder('Terrain');
folder.add(terrain_uniforms.H, 'value', 0, 1, 0.001).name('H');
folder.add(terrain_uniforms.lacuarity, 'value', 0, 20, 0.001).name('lacuarity');
folder.add(terrain_uniforms.octaves, 'value', 1, 20, 1).name('octaves');
folder.add(terrain_uniforms.offset, 'value', 0, 2, 0.001).name('offset');
folder.add(terrain_uniforms.gain, 'value', 0, 4, 0.001).name('gain');
folder.add(terrain_uniforms.scale, 'value', 1, 1000, 1).name('scale');
folder.add(terrain_uniforms.xoffset, 'value', 0, 10000, 0.001).name('xoffset');
folder.add(terrain_uniforms.yoffset, 'value', 0, 10000, 0.001).name('yoffset');

var last_time = 0.0;
var dt = 0;
var count = 0;
function animate() {  
    requestAnimationFrame(animate)

    controls.update()
    renderer.render(scene, camera)


    dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
    dt = (Date.now() - last_time)/1000;
    last_time = Date.now();

    count += 1;
    //console.log(dt);
}

animate()
