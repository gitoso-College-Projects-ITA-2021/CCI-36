// Three.js setup
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("main-canvas"),
  alpha:false,
  antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
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

// Ground
const gound_size = {x: 100, y: 0.1, z: 100}
var geometry = new THREE.BoxGeometry(gound_size.x, gound_size.y, gound_size.z)
var floorTexture = loader.load('assets/floor.jpg')
floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.repeat.set( 100 , 100 )
var material_ground = new THREE.MeshLambertMaterial({map: floorTexture})
var ground = new THREE.Mesh(geometry, material_ground)
scene.add(ground)

// Wall
const wall_dimentions = {width: 2,hight: 5,depth: gound_size.z}
var wall_geometry = new THREE.BoxGeometry(wall_dimentions.width, wall_dimentions.hight, wall_dimentions.depth - wall_dimentions.width)

var wallTextureTop = new THREE.TextureLoader().load('assets/wall_top.jpg')
wallTextureTop.wrapT = THREE.RepeatWrapping
wallTextureTop.wrapS = THREE.RepeatWrapping
wallTextureTop.repeat.set( 1 , 20 )

var wallTextureSide1 = new THREE.TextureLoader().load('assets/bricks.jpg')
wallTextureSide1.wrapT = THREE.RepeatWrapping
wallTextureSide1.wrapS = THREE.RepeatWrapping
wallTextureSide1.repeat.set( 10 , 1 )

var wallTextureSide2 = new THREE.TextureLoader().load('assets/bricks.jpg')
wallTextureSide2.wrapT = THREE.RepeatWrapping
wallTextureSide2.wrapS = THREE.RepeatWrapping
wallTextureSide2.repeat.set( 1, 1 )

var wallmaterials = 
[
  new THREE.MeshPhongMaterial({map: wallTextureSide1}), // right
  new THREE.MeshPhongMaterial({map: wallTextureSide1}), // left
  new THREE.MeshPhongMaterial({map: wallTextureTop}), // top
  new THREE.MeshPhongMaterial({map: wallTextureTop}),  // bottom
  new THREE.MeshPhongMaterial({map: wallTextureSide2}),   // front
  new THREE.MeshPhongMaterial({map: wallTextureSide2})   // back
]

var wall_material = new THREE.MeshFaceMaterial(wallmaterials)

const deltax = gound_size.x/2 - wall_dimentions.width/2
const deltaz = wall_dimentions.width/2
var wall1 = new THREE.Mesh(wall_geometry, wall_material)
wall1.position.set(deltax, wall_dimentions.hight/2, deltaz)
var wall2 = new THREE.Mesh(wall_geometry, wall_material)
wall2.rotateY(THREE.Math.degToRad(90))
wall2.position.set(deltaz, wall_dimentions.hight/2, -deltax)
var wall3 = new THREE.Mesh(wall_geometry, wall_material)
wall3.rotateY(THREE.Math.degToRad(180))
wall3.position.set(-deltax, wall_dimentions.hight/2, -deltaz)
var wall4 = new THREE.Mesh(wall_geometry, wall_material)
wall4.rotateY(THREE.Math.degToRad(270))
wall4.position.set(-deltaz, wall_dimentions.hight/2, deltax)
ground.add(wall1) 
ground.add(wall2) 
ground.add(wall3) 
ground.add(wall4) 

// Street Lamp
const base1_geometry = new THREE.BoxGeometry(2, 0.5, 2)
var base1_texture = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('assets/wall_top.jpg')})
var base1 = new THREE.Mesh(base1_geometry, base1_texture)
base1.position.set(-15, 0.5/2, -5)
ground.add(base1)

const base2_geometry = new THREE.BoxGeometry(1, 5.5, 1)
var base2_texture = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('assets/wall_top.jpg')})
var base2 = new THREE.Mesh(base2_geometry, base1_texture)
base2.position.set(0, 0.5/2 + 5.5/2, 0)
base1.add(base2)

var cylinder1_geometry = new THREE.CylinderGeometry( 0.20, 0.25, 15, 32 )
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} )
var cylinder1 = new THREE.Mesh( cylinder1_geometry, base1_texture )
cylinder1.position.set(0,5.5/2 + 15/2,0)
base2.add(cylinder1);

var cylinder2_geometry = new THREE.CylinderGeometry( 0.7, 0.25, 0.6, 32, 10, true )
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} )
var cylinder2 = new THREE.Mesh( cylinder2_geometry, base1_texture )
cylinder2.position.set(0,15/2,0)
cylinder1.add(cylinder2);

var lamp_geometry = new THREE.SphereGeometry( 1, 32, 32 )
var lamp_material = new THREE.MeshStandardMaterial(  {emissive: 0xffff00, color: 0xffffff} )
var lamp = new THREE.Mesh( lamp_geometry, lamp_material )
lamp.castShadow = true
lamp.position.set(0,1,0)
cylinder2.add(lamp);

// Lamp light 
var lamp_light = new THREE.PointLight( 0xffffff, 1, 100 )
lamp_light.castShadow = true 
lamp_light.receiveShadow = false
lamp_light.position.set( lamp.position )
scene.add(lamp_light)

//Set up shadow properties for the light
lamp_light.shadow.mapSize.width = 512;  
lamp_light.shadow.mapSize.height = 512; 
lamp_light.shadow.camera.near = 0.5;      
lamp_light.shadow.camera.far = 500      

// Light
var light = new THREE.DirectionalLight(0xffffff, 1.0, 100)
light.position.set(20, 20, 20)
light.target.x = 0
light.target.y = 0
light.target.z = 0
scene.add(light)


// Mesa (tampo)
var mesaSize = {x: 15, y: 0.5, z: 9}
var mesaHeight = 3.5

mesa = generateTable(mesaSize, mesaHeight)
scene.add(mesa)

//spring
var r = 0.2;
var h = 2;
var t = 0;
//spring support
var width = 2.5;
var heigth = 2.5;
var depth = 0.25;
spring_support = gen_spring_suport(width, heigth, depth);
scene.add(spring_support);

var spring = gen_spring_tube(r, h);
spring_support.add(spring);
spring.rotateX(Math.PI/2);
//spring.position.set(0, mesaHeight + h + 2, 0);

// Decoration trees
gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, -4), 5, 8);
gen_vase_tree(new THREE.Vector3(0, mesaHeight + 0.5, -4), 5, 7);
gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, -4), 4, 12);
gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, 0), 5, 8);
gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, 0), 3, 10);
//gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, 4), 3, 10);
//gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, 4), 5, 8);


// Camera
camera.position.set(0.0,  mesaHeight + h + 5 , 10)
camera.lookAt(0,  mesaHeight + h + 5, 0)
var controls = new THREE.OrbitControls(camera, renderer.domElement)

var ry = spring.rotation.y;


// Ball trail
var ball_points = [];
var trail_geom = new THREE.BufferGeometry().setFromPoints(ball_points);
trail_geom.verticesNeedUpdate = true;
trail_geom.elementsNeedUpdate = true;
trail_geom.normalsNeedUpdate = true;
var trail_mat = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var trail = new THREE.Line(trail_geom, trail_mat );
scene.add(trail);

// Simulation parameters
var params = new Object();
params.m = 40;
params.k = 1000;
params.l0 = h;
params.g = 10;
x0 = h * 0.15;
theta0 = Math.PI/24;
var y = [x0, 0, theta0, 0];
var dydt = [0, 0, 0, 0];
var yout = [0, 0, 0, 0];
var last_time = Date.now();
var dt = 0;
var count = 0;
var reset = 0;
function animate() {  
    requestAnimationFrame(animate)
    // Physics update
    derivs(0, y, dydt, params);
    rk4(y, dydt, 0, dt, yout, derivs, params);
    y = yout.slice();

    // Spring update
    update_spring_tube(spring, r - yout[0]*0.15, h + yout[0]);
    spring.rotation.y = ry + yout[2];

    controls.update()
    renderer.render(scene, camera)

    
    // update trail
    var ball = spring.children[spring.children.length - 1].children[0];
    var pos = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
    ball_points.push(ball.localToWorld(pos));
    var trail_geom = new THREE.BufferGeometry().setFromPoints(ball_points);
    trail.geometry.copy(trail_geom);
    if (ball_points.length > 100)
        ball_points.length = 0;

    // Reset simulation to avoid numeric issues
    if (reset > 300 || dt > 0.1) {
        reset = 0;
        y = [x0, 0, theta0, 0];
        dydt = [0, 0, 0, 0];
        yout = [0, 0, 0, 0];
        ball_points.length = 0;
        count = 0;
    }

    dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
    //dt = (Date.now() - last_time)/1000;
    last_time = Date.now();

    count += 1;
    reset += 1;
    //console.log(dt);
}

animate()
