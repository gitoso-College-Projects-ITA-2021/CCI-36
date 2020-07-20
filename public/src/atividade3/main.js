// Three.js setup
var renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById("main-canvas"),
    alpha:true,
    antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );


var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1.1, 15000);

var loader = new THREE.TextureLoader()

var light = new THREE.PointLight( 0xffffff, 1, 0 );
light.position.set( 200, 200, 200);
scene.add( light );
//scene.fog = new THREE.Fog( 0xcce0ff, 500, 1000 );

var size = 100;
var divisions = 10;
var gridHelper = new THREE.GridHelper(size, divisions);
//scene.add(gridHelper);

var gx = 10;
var gy = 15;
var gz = 10;
var grid_size = gx * gy * gz;


function grid_idx(x, y, z) {
    return x + y * gx + z * gx * gy;
}



var grid_cubes = new Array(grid_size);
var group = new THREE.Group();
for (var x = 0; x < gx * 10; x += 10) {
    for (var y = 0; y < gy * 10; y += 10) {
        for (var z = 0; z < gz * 10; z += 10) {
            var idx = grid_idx(x, y , z);
            var geom = new THREE.BoxGeometry(9.8, 9.8, 9.8);
            var mat = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

            grid_cubes[idx] = new THREE.Mesh(geom, mat);
            grid_cubes[idx].position.x = x;
            grid_cubes[idx].position.y = y;
            grid_cubes[idx].position.z = -z;

            group.add(grid_cubes[idx]);
            grid_cubes[idx].visible = false;
        }
    }
}
scene.add(group);
var geom = new THREE.BoxGeometry((gx - 1) * 10, (gy - 1) * 10, (gz - 1) * 10);
var mat = new THREE.MeshPhongMaterial( {color: 0x000fff, opacity: 0.1, transparent: true} );

grid_cube = new THREE.Mesh(geom, mat);
grid_cube.position.x = (gx - 1)*10/2;
grid_cube.position.y = (gy - 1)*10/2;
grid_cube.position.z = -(gz - 1)*10/2;
scene.add(grid_cube);


// https://discourse.threejs.org/t/3d-grid-of-lines/3850
let xSize = gx;
let ySize = gy;
let zSize = gz;
let n = xSize * ySize * zSize;

let geometry = new THREE.BufferGeometry();

function mapTo3D(i) {
    let z = Math.floor(i / (xSize * ySize));
    i -= z * xSize * ySize;
    let y = Math.floor(i / xSize);
    let x = i % xSize;
    return { x: x, y: y, z: z };
}

function mapFrom3D(x, y, z) {
    return x + y * xSize + z * xSize * ySize;
}

let positions = [];
//for (let i = 0; i < n; i++) {
//let p = mapTo3D(i);
//positions.push(p.x);
//positions.push(p.y);
//positions.push(p.z);
//}
for (var x = 0; x < gx * 10; x += 10) {
    for (var y = 0; y < gy * 10; y += 10) {
        for (var z = 0; z < gz * 10; z += 10) {
            positions.push(x);
            positions.push(y);
            positions.push(-z);
        }
    }
}
let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
geometry.addAttribute("position", positionAttribute);

let indexPairs = [];
for (let i = 0; i < n; i++) {
    let p = mapTo3D(i);
    if (p.x + 1 < xSize) {
        indexPairs.push(i);
        indexPairs.push(mapFrom3D(p.x + 1, p.y, p.z));
    }
    if (p.y + 1 < ySize) {
        indexPairs.push(i);
        indexPairs.push(mapFrom3D(p.x, p.y + 1, p.z));
    }
    if (p.z + 1 < zSize) {
        indexPairs.push(i);
        indexPairs.push(mapFrom3D(p.x, p.y, p.z + 1));
    }
}
geometry.setIndex(indexPairs);
let lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial( {opacity : 0.1, transparent: true} ));
scene.add(lines);
// ----

var px = 4;
var py = 4;
var pz = 4;
var p_size = px * py * pz;

var p_cubes = objects(3, p_size);

function p_idx(x, y, z) {
    return Math.floor(x + y * px + z * px * py);
}

var p_pos = new THREE.Vector3(5, 15, 5);
for (var x = 0; x < px; x++) {
    for (var y = 0; y < py; y++) {
        for (var z = 0; z < pz; z++) {
            var idx = grid_idx(x, y, z);
            if (p_cubes[p_idx(x, y, z)] == true) {
                g_idx = grid_idx((p_pos.x + x) * 10, (p_pos.y + y) * 10, (p_pos.z + z) * 10);
                grid_cubes[g_idx].visible = true;
            }
        }
    }
}


camera.position.set(300.0,  300.0, 300.0);
camera.lookAt(0.0, 0.0, 0.0);
var controls = new THREE.FlyControls(camera, renderer.domElement)
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;


var last_time = 0.0;
var total = 0.0;
var dt = 0;
var count = 0;
var count_rot = 0;
var vel = 0.000000000001;
var px_old = 0;
var py_old = 0;
var pz_old = 0;
px_old = p_pos.x;
py_old = p_pos.y;
pz_old = p_pos.z;

var rot = 0;
var rot_old = 0;

function sinpi2(rot) {
    var angle = rot % 360;
    if (angle < 0) angle += 360;

    if (angle == 0) return 0;
    if (angle == 90) return 1;
    if (angle == 180) return 0;
    if (angle == 270) return -1;
}
function cospi2(rot) {
    var angle = rot % 360;
    if (angle < 0) angle += 360;
    if (angle == 0) return 1;
    if (angle == 90) return 0;
    if (angle == 180) return -1;
    if (angle == 270) return 0;
}

function int_rotationY(posx, posy, posz, rot) {
    var px = cospi2(rot) * posx + sinpi2(rot) * posz;
    var py = posy;
    var pz = -sinpi2(rot) * posx + cospi2(rot) * posz;
    return { x: px, y: py, z: pz };
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {  
    requestAnimationFrame(animate)
    raycaster.setFromCamera( mouse, camera );
    render()
    //for (var x = 0; x < gx * 10; x += 10) {
    //for (var y = 0; y < gy * 10; y += 10) {
    //for (var z = 0; z < gz * 10; z += 10) {
    //var idx = grid_idx(x, y , z);
    //grid_cubes[idx].visible = false;
    //}
    //}
    //}
    var intersect_cubes = [];
    for (var x = 0; x < px; x++) {
        for (var y = 0; y < py; y++) {
            for (var z = 0; z < pz; z++) {
                if (p_cubes[p_idx(x, y, z)] == true) {
                    //var pold = new THREE.Vector3(x, y, z);
                    //pold.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot_old);
                    //pold.x = Math.round(pold.x);
                    //pold.y = Math.round(pold.y);
                    //pold.z = Math.round(pold.z);
                    let pold = int_rotationY(x, y, z, rot_old);
                    g_idx = grid_idx((px_old + pold.x) * 10, (py_old + pold.y) * 10, (pz_old + pold.z) * 10);
                    grid_cubes[g_idx].visible = false;
                    //var p= new THREE.Vector3(x, y, z);
                    //p.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
                    //p.x = Math.round(p.x);
                    //p.y = Math.round(p.y);
                    //p.z = Math.round(p.z);
                    let p = int_rotationY(x, y, z, rot);
                    g_idx = grid_idx((p_pos.x + p.x) * 10, (p_pos.y + p.y) * 10, (p_pos.z + p.z) * 10);
                    grid_cubes[g_idx].visible = true;
                    intersect_cubes.push(grid_cubes[g_idx]);
                }
            }
        }
    }
    var intersects = raycaster.intersectObjects( group.children );
    var move_object = false;
	for ( var i = 0; i < intersects.length; i++ ) {
        for (var l = 0; l < intersect_cubes.length; l++) {
            if (intersects[ i ].object == intersect_cubes[l]) { 
                intersects[ i ].object.material.color.set( 0xff0000 );
                move_object = true;
            }
    }

	}
    console.log(move_object);

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    controls.update( dt );

    //dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
    dt = (Date.now() - last_time)/1000;
    last_time = Date.now();
    total = dt/2.0;

    if (count > 200) {
        px_old = p_pos.x;
        py_old = p_pos.y;
        pz_old = p_pos.z;
        p_pos.y -= 1;
        count = 1;
        rot_old = rot;
        rot -= 90;
        count_rot = 1;
    }
    if (p_pos.y <= 0) p_pos.y =0;

    //tree_uniforms.time.value = total;

    count += 1;
    count_rot += 1;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

var vel = 0.001;

function render() {
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'mousemove', onMouseMove, false );
animate()