// Three.js setup
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer({
  canvas:document.getElementById("main-canvas"),
  alpha:false,
  antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)

// Ground
var geometry = new THREE.BoxGeometry(100, 0.1, 100)
var material_ground = new THREE.MeshBasicMaterial( {color: 0x222222, wireframe: false})
var ground = new THREE.Mesh(geometry, material_ground)
scene.add(ground)

// Light
var light = new THREE.DirectionalLight(0xffffff, 1.0, 100)
light.position.set(0, 20, 0)
light.target.x = 0
light.target.y = 0
light.target.z = 0
scene.add(light)

var loader = new THREE.TextureLoader();
var woodTexture = loader.load('assets/hardwood.jpg')
var woodTextureNormal = loader.load('assets/hardwood_normal.jpg')

// Mesa (tampo)
var mesaSize = {x: 15, y: 0.5, z: 9}
var mesaHeight = 3.5

geometry = new THREE.BoxGeometry(mesaSize.x, mesaSize.y, mesaSize.z)
material = new THREE.MeshPhongMaterial({
  //color: 0xaaaaaa,
  //specular: 0x333333,
  //shininess: 15,
  map: woodTexture, 
  normalMap: woodTextureNormal
})
var tampo = new THREE.Mesh(geometry, material)
tampo.position.set(0, mesaHeight, 0)

geometry = new THREE.BoxGeometry(0.5, mesaHeight, 0.5)
var pe1 = new THREE.Mesh(geometry, material)
pe1.position.set(mesaSize.x / 2 - 0.5, mesaHeight / 2, mesaSize.z / 2 - 0.5)
var pe2 = new THREE.Mesh(geometry, material)
pe2.position.set(- mesaSize.x / 2 + 0.5, mesaHeight / 2, - mesaSize.z / 2 + 0.5)
var pe3 = new THREE.Mesh(geometry, material)
pe3.position.set(- mesaSize.x / 2 + 0.5, mesaHeight / 2, mesaSize.z / 2 - 0.5)
var pe4 = new THREE.Mesh(geometry, material)
pe4.position.set(mesaSize.x / 2 - 0.5, mesaHeight / 2, - mesaSize.z / 2 + 0.5)

var mesa = new THREE.Group();
mesa.add(tampo)
mesa.add(pe1)
mesa.add(pe2)
mesa.add(pe3)
mesa.add(pe4)
scene.add(mesa)

//spring
var r = 0.5;
var h = 3;
var t = 0;
var circle_steps = 20;
var height_steps = 10;
var spring = gen_spring(r, circle_steps, h, height_steps);
var spring2 = gen_spring_lines(r, circle_steps, h, height_steps);
scene.add(spring);
//scene.add(spring2);
spring.rotateX(Math.PI/2);
spring.position.set(0, mesaHeight + h + 2, 0);
spring2.rotateX(Math.PI/2);
spring2.position.set(0, mesaHeight + h + 2, 0);


// Camera
camera.position.set(0.5,  mesaHeight + h + 2, 10/8)
camera.lookAt(0,  mesaHeight + h + 2, 0)
var controls = new THREE.OrbitControls(camera, renderer.domElement);

var c = 2 * Math.PI * r;
var deltac = 0;
function animate() {  
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    // Nao queria tah fazendo isso aqui
    spring.position.set(0, 0, 0);
    spring.rotateX(-Math.PI/2);

    update_spring(spring, r, circle_steps, h, height_steps);
    //update_spring_line(spring2, r, circle_steps, h + deltac, height_steps);

    spring.rotateX(Math.PI/2);
    spring.position.set(0, mesaHeight + h + 2, 0);


    controls.update();
    t += 0.01;
    r -= 0.0008*Math.sin(t);
    deltac = c - 2 * Math.PI * r;

  //mesa.rotation.y += 0.01;
}

animate()
