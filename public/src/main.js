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

var woodTexture = loader.load('assets/hardwood.jpg')
var woodTextureNormal = loader.load('assets/hardwood_normal.jpg')

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
var spring_support = new THREE.Mesh();
spring_support.translateY(mesaHeight + h + 2);
var box_geometry = new THREE.BoxGeometry(width, depth, heigth);
var albedo = new THREE.TextureLoader().load("assets/Metal012_2K_Color.jpg");
var roughness = new THREE.TextureLoader().load("assets/Metal012_2K_Roughness.jpg");
var metalness = new THREE.TextureLoader().load("assets/Metal012_2K_Metalness.jpg");
var normal = new THREE.TextureLoader().load("assets/Metal012_2K_Normal.jpg");
var material = new THREE.MeshStandardMaterial({
    map: albedo,
    roughness: 0.0,
    metalness: 0.5,
    normalMap: normal,
});
var base = new THREE.Mesh( box_geometry, material );
var topp = new THREE.Mesh( box_geometry, material );
spring_support.add(base);
spring_support.add(topp);
base.translateY(-(h + 1.5));
// Parafuso
var geom_par_top = new THREE.CylinderGeometry( width*0.25, width*0.25, depth * 2.5, 5 );
var albedo = new THREE.TextureLoader().load("assets/Metal029_2K_Color.jpg");
var normal = new THREE.TextureLoader().load("assets/Metal029_2K_Normal.jpg");
var mat_par = new THREE.MeshPhongMaterial({
    map: albedo,
    normalMap: normal,
});
var parafuso1 = new THREE.Mesh(geom_par_top, mat_par);
var geom_par = new THREE.CylinderGeometry( width*0.05, width*0.05, (h + 2) * 0.1, 5 );
var parafuso2 = new THREE.Mesh(geom_par, mat_par);
var parafuso3 = new THREE.Mesh(geom_par, mat_par);
var parafuso4 = new THREE.Mesh(geom_par, mat_par);
var parafuso5 = new THREE.Mesh(geom_par, mat_par);
var parafuso2b = new THREE.Mesh(geom_par, mat_par);
var parafuso3b = new THREE.Mesh(geom_par, mat_par);
var parafuso4b = new THREE.Mesh(geom_par, mat_par);
var parafuso5b = new THREE.Mesh(geom_par, mat_par);
topp.add(parafuso1);
//parafuso1.translateY(width*0.05);

var geometry = new THREE.CylinderGeometry( width*0.02, width*0.02, h + 2, 32 );
var albedo = new THREE.TextureLoader().load("assets/Metal003_2K_Color.jpg");
var normal = new THREE.TextureLoader().load("assets/Metal003_2K_Normal.jpg");
var mat_cylinder = new THREE.MeshPhongMaterial({
    map: albedo,
    normalMap: normal,
});
var cylinder1 = new THREE.Mesh( geometry, mat_cylinder );
base.add(cylinder1);
cylinder1.translateY((h + 2)/2);
cylinder1.translateX(width/2 - width*0.05);
cylinder1.translateZ(heigth/2 - width*0.05);
topp.add(parafuso2);
parafuso2.translateY(width*0.05);
parafuso2.translateX(width/2 - width*0.05);
parafuso2.translateZ(heigth/2 - width*0.05);
base.add(parafuso2b);
parafuso2b.translateY(width*0.05);
parafuso2b.translateX(width/2 - width*0.05);
parafuso2b.translateZ(heigth/2 - width*0.05);

var cylinder2 = new THREE.Mesh( geometry, mat_cylinder );
base.add(cylinder2);
cylinder2.translateY((h + 2)/2);
cylinder2.translateX(-width/2 + width*0.05);
cylinder2.translateZ(heigth/2 - width*0.05);
topp.add(parafuso3);
parafuso3.translateY(width*0.05);
parafuso3.translateX(-width/2 + width*0.05);
parafuso3.translateZ(heigth/2 - width*0.05);
base.add(parafuso3b);
parafuso3b.translateY(width*0.05);
parafuso3b.translateX(-width/2 + width*0.05);
parafuso3b.translateZ(heigth/2 - width*0.05);

var cylinder3 = new THREE.Mesh( geometry, mat_cylinder );
base.add(cylinder3);
cylinder3.translateY((h + 2)/2);
cylinder3.translateX(-width/2 + width*0.05);
cylinder3.translateZ(-heigth/2 + width*0.05);
topp.add(parafuso4);
parafuso4.translateY(width*0.05);
parafuso4.translateX(-width/2 + width*0.05);
parafuso4.translateZ(-heigth/2 + width*0.05);
base.add(parafuso4b);
parafuso4b.translateY(width*0.05);
parafuso4b.translateX(-width/2 + width*0.05);
parafuso4b.translateZ(-heigth/2 + width*0.05);

var cylinder4 = new THREE.Mesh( geometry, mat_cylinder );
base.add(cylinder4);
cylinder4.translateY((h + 2)/2);
cylinder4.translateX(width/2 - width*0.05);
cylinder4.translateZ(-heigth/2 + width*0.05);
topp.add(parafuso5);
parafuso5.translateY(width*0.05);
parafuso5.translateX(width/2 - width*0.05);
parafuso5.translateZ(-heigth/2 + width*0.05);
base.add(parafuso5b);
parafuso5b.translateY(width*0.05);
parafuso5b.translateX(width/2 - width*0.05);
parafuso5b.translateZ(-heigth/2 + width*0.05);

scene.add(spring_support);

var circle_steps = 40;
var height_steps = 10;

var spring = gen_spring_tube(r, circle_steps, h, height_steps);
spring_support.add(spring);
spring.rotateX(Math.PI/2);
//spring.position.set(0, mesaHeight + h + 2, 0);

function gen_vase_tree(pos, tree_depth, mul) {
    var tree = generate_tree(mul, tree_depth);

    var vase = generate_vase(0.5, 0.4, 1);
    vase.position.x = pos.x;
    vase.position.y = pos.y;
    vase.position.z = pos.z;
    vase.add(tree);
    tree.translateY(0.5);
    scene.add(vase);
}
gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, -4), 5, 8);
gen_vase_tree(new THREE.Vector3(0, mesaHeight + 0.5, -4), 5, 7);
gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, -4), 4, 12);
gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, 0), 5, 8);
gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, 0), 3, 10);
gen_vase_tree(new THREE.Vector3(-6, mesaHeight + 0.5, 4), 3, 10);
gen_vase_tree(new THREE.Vector3(6, mesaHeight + 0.5, 4), 5, 8);


// Camera
camera.position.set(0.0,  mesaHeight + h + 2 , 10)
camera.lookAt(0,  mesaHeight + h + 5, 0)
var controls = new THREE.OrbitControls(camera, renderer.domElement)

var ry = spring.rotation.y;

var params = new Object();
params.m = 30;
params.k = 1000;
params.l0 = h;
params.g = 10;
var y = [h*0.02, 0, Math.PI/30, 0];
var dydt = [0, 0, 0, 0];
var yout = [0, 0, 0, 0];
var last_time = Date.now();
var dt = 0;
var count = 0;
var reset = 0;
var ball_points = [];
var trail_geom = new THREE.BufferGeometry().setFromPoints(ball_points);
trail_geom.verticesNeedUpdate = true;
trail_geom.elementsNeedUpdate = true;
trail_geom.normalsNeedUpdate = true;
var trail_mat = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var trail = new THREE.Line(trail_geom, trail_mat );
scene.add(trail);
function animate() {  
    requestAnimationFrame(animate)
    derivs(0, y, dydt, params);
    rk4(y, dydt, 0, dt, yout, derivs, params);

    update_spring_tube(spring, r - yout[0]*0.15, circle_steps, h + yout[0], height_steps);
    spring.rotation.y = ry + yout[2];
    y = yout.slice();

    controls.update()
    renderer.render(scene, camera)
    count += 1;
    reset += 1;

    var ball = spring.children[spring.children.length - 1].children[0];
    var pos = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
    ball_points.push(ball.localToWorld(pos));
    var trail_geom = new THREE.BufferGeometry().setFromPoints(ball_points);
    trail.geometry.copy(trail_geom);
    if (ball_points.length > 100)
        ball_points.length = 0;
    if (reset > 200) {
        reset = 0;
        y = [h*0.02, 0, Math.PI/30, 0];
        dydt = [0, 0, 0, 0];
        yout = [0, 0, 0, 0];
    }
    dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
    //dt = (Date.now() - last_time)/1000;
    //dt = Math.min(Math.max(dt, 0.01), 0.10);
    //dt = 0.04;
    last_time = Date.now();
    console.log(dt);

}

animate()
