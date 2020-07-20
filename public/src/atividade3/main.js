// Three.js setup
var renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById("main-canvas"),
    alpha:true,
    antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );

// Input
const inputManager = new InputManager();


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

// Grid setup
var gx = 10;
var gy = 15;
var gz = 10;
var step = 20;
var grid_size = gx * gy * gz;


function grid_idx(x, y, z) {
    return x + y * gx + z * gx * gy;
}

// Group 3D board
var grid_cubes = new Array(grid_size);
var group = new THREE.Group();
for (var x = 0; x < gx * step; x += step) {
    for (var y = 0; y < gy * step; y += step) {
        for (var z = 0; z < gz * step; z += step) {
            var idx = grid_idx(x, y, z);
            var geom = new THREE.BoxGeometry(step - 0.1, step - 0.1, step - 0.1);
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

var geom = new THREE.BoxGeometry((gx - 1) * step, (gy - 1) * step, (gz - 1) * step);
var mat = new THREE.MeshPhongMaterial( {color: 0x000fff, opacity: 0.1, transparent: true} );

grid_cube = new THREE.Mesh(geom, mat);
grid_cube.position.x = (gx - 1) * step / 2;
grid_cube.position.y = (gy - 1) * step / 2;
grid_cube.position.z =  - (gz - 1) * step / 2;
//scene.add(grid_cube);

// Melhor ser impar pra ter um centro inteiro
var px = 3;
var py = 3;
var pz = 3;

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

// 3D-Board geometry
let positions = [];
//for (let i = 0; i < n; i++) {
//let p = mapTo3D(i);
//positions.push(p.x);
//positions.push(p.y);
//positions.push(p.z);
//}
for (var x = 0; x < gx * step; x += step) {
    for (var y = 0; y < gy * step; y += step) {
        for (var z = 0; z < gz * step; z += step) {
            positions.push(x - step / 2);
            positions.push(y - step / 2);
            positions.push(- z + step / 2);
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

var p_size = px * py * pz;

var p_cubes = objects(3, p_size);

function p_idx(x, y, z) {
    return Math.floor(x + y * px + z * px * py);
}

var p_pos = new THREE.Vector3(0, 11, 0);
for (var x = 0; x < px; x++) {
    for (var y = 0; y < py; y++) {
        for (var z = 0; z < pz; z++) {
            var idx = grid_idx(x, y, z);
            if (p_cubes[p_idx(x, y, z)] == true) {
                g_idx = grid_idx((p_pos.x + x) * step, (p_pos.y + y) * step, (p_pos.z + z) * step);
                grid_cubes[g_idx].visible = true;
            }
        }
    }
}


camera.position.set(step * gy * 2, step * gy * 2 + 100, step * gy * 2);
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

// O 1 tah hard coded mas tem que ser o resultado da divisao inteira de px,py,pz por 2
function int_rotationY(posx, posy, posz, rot) {
    var new_px = cospi2(rot) * (posx - 1) + sinpi2(rot) * (posz - 1);
    var new_py = posy;
    var new_pz = -sinpi2(rot) * (posx - 1) + cospi2(rot) * (posz - 1);
    return { x: new_px + 1, y: new_py, z: new_pz + 1 };
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var mouse_old = new THREE.Vector2();
var mouse_2 = new THREE.Vector2();
var delta = new THREE.Vector2();
var inverse_matrix = new THREE.Matrix4();

var is_moving = false;
var is_dragging = false;
var mouse_down = false;


function onMouseDown(event) {
    is_moving = true;
    mouse_down = true;
}

function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseUp(event) {
    is_moving = false;
    is_dragging = false;
    mouse_down = false;
}

// esse bound check nao tah completo
function bounded_pos(x, y, z) {
    var px = x;
    var py = y;
    var pz = z;
    if (x > gx - 3) {
        px = gx - 3;
    }
    if (x < 0) {
        px = 0;
    }
    if (y > gy - 3) {
        py = gy - 3;
    }
    if (y < 0) {
        py = 0;
    }
    if (z > gz - 3) {
        pz = gz - 3;
    }
    if (z < 0) {
        pz = 0;
    }
    return { x: px, y: py, z: pz };
}

function animate() {  
    requestAnimationFrame(animate)
    raycaster.setFromCamera( mouse, camera );
    inputManager.update()
    render()

    for (var x = 0; x < gx * step; x += step) {
        for (var y = 0; y < gy * step; y += step) {
            for (var z = 0; z < gz * step; z += step) {
                var idx = grid_idx(x, y, z);
                grid_cubes[idx].visible = false;
            }
        }
    }

    var intersect_cubes = [];
    for (var x = 0; x < px; x++) {
        for (var y = 0; y < py; y++) {
            for (var z = 0; z < pz; z++) {
                if (p_cubes[p_idx(x, y, z)] == true) {
                    if (inputManager.keys.y.down) {
                        let p = int_rotationY(x, y, z, rot);
                        g_idx = grid_idx((p_pos.x + p.x) * step, (p_pos.y + p.y) * step, (p_pos.z + p.z) * step);
                    }
                    grid_cubes[g_idx].visible = true;
                    intersect_cubes.push(grid_cubes[g_idx]);
                    grid_cubes[g_idx].material.color.set(0x00ff00);
                }
            }
        }
    }
    var intersects = raycaster.intersectObjects( group.children );
    var move_object = false;
    var first = false;
    for ( var i = 0; i < intersects.length; i++ ) {
        for (var l = 0; l < intersect_cubes.length; l++) {
            if (intersects[ i ].object == intersect_cubes[l]) { 
                move_object = true;
                if (mouse_down == true)
                    is_dragging = true;
            }
        }

        if (first == false) {
            mouse_old.x = mouse_2.x;
            mouse_old.y = mouse_2.y;
            mouse_2.x = intersects[i].object.position.x;
            mouse_2.y = -intersects[i].object.position.z;
            first = true;
        }
    }
    if (move_object == true) {
        for (var l = 0; l < intersect_cubes.length; l++) {
            intersect_cubes[l].material.color.set(0xff0000);
        }
    }
    delta.x = mouse_2.x - mouse_old.x;
    delta.y = mouse_2.y - mouse_old.y;
    console.log(delta);
    if (is_dragging == true) {
        var mul = 1.0;
        delta.normalize();
        p_pos.x += delta.x * mul;
        p_pos.z += delta.y * mul;
    }
    console.log(move_object);

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    controls.update( dt );

    dt = (Date.now() - last_time)/1000;
    last_time = Date.now();
    total = dt / 2.0;


    if (count > 50) {
        px_old = p_pos.x;
        py_old = p_pos.y;
        pz_old = p_pos.z;
        //p_pos.y -= 1;
        count = 1;
        rot_old = rot;
        rot += 90;
        count_rot = 1;
    }
    pos = bounded_pos(p_pos.x, p_pos.y, p_pos.z);
    p_pos.x = pos.x;
    p_pos.y = pos.y;
    p_pos.z = pos.z;
    if (p_pos.y == 0) p_pos.y = 11;

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
window.addEventListener( 'mousedown', onMouseDown, false);
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mouseup', onMouseUp, false);
animate()
