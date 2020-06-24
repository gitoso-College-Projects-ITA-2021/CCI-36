// Three.js setup
var renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("main-canvas"),
  antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );

var gl = renderer.domElement.getContext('webgl') ||
                renderer.domElement.getContext('experimental-webgl');
gl.getExtension('OES_standard_derivatives');

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1.1, 15000);

var loader = new THREE.TextureLoader()

sun_light = new THREE.DirectionalLight( 0xffffff, 0.8 );
scene.add( sun_light );

//scene.fog = new THREE.Fog( 0xcce0ff, 500, 1000 );

var sky = generate_sky();

var cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 
    128, 
    { 
        format: THREE.RGBFormat, 
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter ,
    }
);
var cubeCamera = new THREE.CubeCamera( 0.1, 1, cubeRenderTarget );


// Isso aqui nao tah funcionando e nao entendo pq
scene.background = cubeRenderTarget;

var terrain = generate_terrain();
//sky.scale.setScalar( 450000 );
//scene.add( sky );

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

terrain.material.uniforms.env_map.value = scene.background;

var grass = generate_grass();
scene.add(grass);
scene.add(terrain);

var grass_texture = loader.load('assets/arvore2.png');
grass_texture.wrapS = THREE.RepeatWrapping;
grass_texture.wrapT = THREE.RepeatWrapping;
grass_texture.repeat.set( 4, 4 );

grass.material.uniforms.grass_texture.value = grass_texture;
grass.material.uniforms.env_map.value = scene.background;

camera.position.set(7500.0,  1200.0, 6000.0);
camera.lookAt(3000.0, 200.0, 1000.0);
var controls = new THREE.FlyControls(camera, renderer.domElement)
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
//controls.mouseDragOn = true;
var terrain_uniforms = terrain.material.uniforms;
var sky_uniforms = sky.material.uniforms;
var parameters = {
    distance: 400,
    inclination: 0.3,
    azimuth: 0.205
};

function updateSun() {
    update_sun(sky, sun_light, parameters.inclination, parameters.azimuth, parameters.distance);
    terrain.material.uniforms['sun_position'].value.copy(sun_light.position).normalize();
    cubeCamera.update(renderer, sky);
}

// Initial values (Sky)
parameters.inclination = 0.52
parameters.azimuth = 0.7
sky_uniforms.rayleigh.value = 5.0
sky_uniforms.turbidity.value = 3.44
sky_uniforms.luminance.value = 0.85
sky_uniforms.mie_coeff.value = 0.004
sky_uniforms.mie_directionalg.value = 0.07

// Initial values (Terrain)
terrain_uniforms.H.value = 0.732
terrain_uniforms.lacuarity.value = 5.381
terrain_uniforms.octaves.value = 20
terrain_uniforms.offset.value = 1
terrain_uniforms.gain.value = 1.6
terrain_uniforms.scale.value = 204
terrain_uniforms.xoffset.value = 0
terrain_uniforms.yoffset.value = 926


updateSun();

var gui = new dat.GUI();
var folder = gui.addFolder( 'Sky' );
folder.add( parameters, 'inclination', 0, 0.7, 0.0001 ).onChange( updateSun );
folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun );
folder.add( sky_uniforms.rayleigh, 'value', 0, 10, 0.0001 ).onChange( updateSun ).name('Rayleigh');
folder.add( sky_uniforms.turbidity, 'value', 0, 5, 0.0001 ).onChange( updateSun ).name('Turbidity');
folder.add( sky_uniforms.luminance, 'value', 0, 5, 0.00001 ).onChange( updateSun ).name('Luminance');
folder.add( sky_uniforms.mie_coeff, 'value', 0, 0.01, 0.00001 ).onChange( updateSun ).name('Mie Coeff');
folder.add( sky_uniforms.mie_directionalg, 'value', 0, 1, 0.00001 ).onChange( updateSun ).name('Mie Dir G');
folder.add( terrain_uniforms.fogNear, 'value', 0, 50000, 0.01 ).name('Fog Near');
folder.add( terrain_uniforms.fogFar, 'value', 0, 50000, 0.01 ).name('Fog Far');
folder.open();

var folder = gui.addFolder('Terrain');
folder.add(terrain_uniforms.H, 'value', 0, 1, 0.001).name('H');
folder.add(terrain_uniforms.lacuarity, 'value', 0, 20, 0.001).name('lacuarity');
folder.add(terrain_uniforms.octaves, 'value', 1, 20, 1).name('octaves');
folder.add(terrain_uniforms.offset, 'value', 0, 2, 0.001).name('offset');
folder.add(terrain_uniforms.gain, 'value', 0, 4, 0.001).name('gain');
folder.add(terrain_uniforms.scale, 'value', 1, 1000, 1).name('scale');
folder.add(terrain_uniforms.xoffset, 'value', 0, 10000, 0.001).name('xoffset');
folder.add(terrain_uniforms.yoffset, 'value', 0, 10000, 0.001).name('yoffset');
folder.open();

var grass_uniforms = grass.material.uniforms;
grass_uniforms.H = terrain_uniforms.H;
grass_uniforms.lacuarity = terrain_uniforms.lacuarity;
grass_uniforms.octaves = terrain_uniforms.octaves;
grass_uniforms.offset = terrain_uniforms.offset;
grass_uniforms.gain = terrain_uniforms.gain;
grass_uniforms.scale = terrain_uniforms.scale;
grass_uniforms.xoffset = terrain_uniforms.xoffset;
grass_uniforms.yoffset = terrain_uniforms.yoffset;
grass_uniforms.fogNear = terrain_uniforms.fogNear;
grass_uniforms.fogFar = terrain_uniforms.fogFar;

var folder = gui.addFolder('Grass');
folder.add(grass_uniforms.speed, 'value', 0, 100, 0.001).name('Speed');
folder.add(grass_uniforms.min_strength, 'value', 0, 20, 0.001).name('Min Strength');
folder.add(grass_uniforms.max_strength, 'value', 1, 200, 0.001).name('Max Strength');
folder.add(grass_uniforms.interval, 'value', 0, 10, 0.001).name('Interval');
folder.add(grass_uniforms.detail, 'value', 0, 100, 0.001).name('Detail');
folder.add(grass_uniforms.distortion, 'value', 0, 1, 0.001).name('Distortion');
folder.add(grass_uniforms.height_offset, 'value', 0, 10, 0.001).name('Height offset');
folder.open();

// instantiate boat
var boatMtlLoader = new THREE.MTLLoader();
boatMtlLoader.setPath('assets/boat/');
boatMtlLoader.load('boat.mtl', function(materials){
  materials.preload();

  var boatloader = new THREE.OBJLoader();
  boatloader.setMaterials(materials);
  boatloader.setPath('assets/boat/');
  boatloader.load('boat.obj',function ( object ) {
    object.name = "boat1";
    object.position.y = 200;
    object.position.x = 3000;
    object.position.z = 1000;
    scene.add( object );
  });
});

// instantiate boat
var boat;

var boatMtlLoader = new THREE.MTLLoader();
boatMtlLoader.setPath('assets/boat2/');
boatMtlLoader.load('boat2.mtl', function(materials){
  materials.preload();

  var boatloader = new THREE.OBJLoader();
  boatloader.setMaterials(materials);
  boatloader.setPath('assets/boat2/');
  boatloader.load('boat2.obj', function ( object ) {
    object.name = "boat2";
    object.rotateX(THREE.Math.degToRad(-90));
    object.position.y = 180;
    object.position.x = 1800;
    object.position.z = -2500;
    scene.add( object );
  });
});




var waterGeometry = new THREE.PlaneBufferGeometry( 50000, 50000 );

water = new THREE.Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    } ),
    alpha: 1.0,
    sunDirection: sun_light.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  }
);

water.rotation.x = - Math.PI / 2;
water.position.set(0, 210, 0)
scene.add( water );


var last_time = 0.0;
var total = 0.0;
var dt = 0;
var count = 0;
function animate() {  
    requestAnimationFrame(animate)
    render()

    var boat2 = scene.getObjectByName( "boat2" );
    boat2.position.y = 95 + 10 * Math.sin(count/40);
    boat2.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), Math.sin(count/30) / 80)
    boat2.rotateX(THREE.Math.degToRad(-90));


    var boat1 = scene.getObjectByName( "boat1" );
    boat1.position.y = 185 + 7 * Math.sin(count/30);
    boat1.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), Math.sin(count/25) / 75)

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    controls.update( dt );

    dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
    dt = (Date.now() - last_time)/1000;
    last_time = Date.now();
    total = dt/2.0;
    //grass_uniforms.time.value = total;


    count += 1;
    //console.log(dt);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

  var time = performance.now() * 0.001;
  water.material.uniforms[ 'time' ].value += 1.1 / 60.0;
  updateSun();
  renderer.render( scene, camera );

}

window.addEventListener( 'resize', onWindowResize, false );
animate()
