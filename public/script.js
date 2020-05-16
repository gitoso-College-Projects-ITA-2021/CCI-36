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
        'assets/cubemap/px.png', 'assets/cubemap/nx.png',
        'assets/cubemap/py.png', 'assets/cubemap/ny.png',
        'assets/cubemap/pz.png', 'assets/cubemap/nz.png'
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
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var base = new THREE.Mesh( box_geometry, material );
var topp = new THREE.Mesh( box_geometry, material );
spring_support.add(base);
spring_support.add(topp);
base.translateY(-(h + 1.5));
// Parafuso
var geom_par_top = new THREE.CylinderGeometry( width*0.25, width*0.25, depth * 2.5, 5 );
var mat_par = new THREE.MeshBasicMaterial( {color: 0xffff00} );
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
var mat_cylinder = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
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
camera.position.set(0.5,  mesaHeight + h + 3, 4)
camera.lookAt(0,  mesaHeight + h + 2, 0)
var controls = new THREE.OrbitControls(camera, renderer.domElement)

var c = 2 * Math.PI * r
var deltac = 0
var ry = spring.rotation.y;
function animate() {  
    requestAnimationFrame(animate)


    //update_spring(spring, r, circle_steps, h + deltac, height_steps);
    //update_spring_line(spring2, r, circle_steps, h + deltac, height_steps);
    update_spring_tube(spring, r + 0.15*r*Math.sin(t), circle_steps, h + 0.20*h*Math.sin(t)+ deltac, height_steps);
    spring.rotation.y = ry + Math.PI/6 * Math.cos(t);

    controls.update()
    renderer.render(scene, camera)
    t += 0.1

    deltac = c - 2 * Math.PI * (r + 0.15 * r * Math.sin(t));

  //mesa.rotation.y += 0.01
}

animate()
