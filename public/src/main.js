// Three.js setup
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("main-canvas"),
  alpha:false,
  antialias:true
})
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

// Ground
var geometry = new THREE.BoxGeometry(100, 0.1, 100)
var floorTexture = loader.load('assets/floor.jpg')
floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.repeat.set( 100 , 100 )
var material_ground = new THREE.MeshLambertMaterial({map: floorTexture})
var ground = new THREE.Mesh(geometry, material_ground)
scene.add(ground)

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
