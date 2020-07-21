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

// Grid setup
var gx = 5;
var gy = 15;
var gz = 5;
var step = 20;
var grid_size = gx * gy * gz;


function grid_idx(x, y, z) {
    let xx = Math.floor(x);
    let yy = Math.floor(y);
    let zz = Math.floor(z);
    let idx =  (xx + yy * gx + zz * gx * gy);
    return idx;
}

// Group 3D board
var grid_cubes = new Array(grid_size);
var grid_stopped = new Array(grid_size);
var group = new THREE.Group();
for (var x = 0; x < gx  ; x += 1) {
    for (var y = 0; y < gy  ; y += 1) {
        for (var z = 0; z < gz  ; z += 1) {
            var idx = grid_idx(x, y , z);
            //console.log(idx);
            var geom = new THREE.BoxGeometry(step - 0.0, step - 0.0, step - 0.0);
            var mat = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

            grid_cubes[idx] = new THREE.Mesh(geom, mat);
            grid_cubes[idx].position.x = x * step;
            grid_cubes[idx].position.y = y * step;
            grid_cubes[idx].position.z = -z * step;
            grid_stopped[idx] = false;

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
let xSize = gx+1;
let ySize = gy+1;
let zSize = gz+1;
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
for (var x = 0; x < gx+1; x++) {
    for (var y = 0; y < gy+1; y++) {
        for (var z = 0; z < gz+1; z++) {
            positions.push(x*step - step / 2);
            positions.push(y*step - step / 2);
            positions.push(- z*step + step / 2);
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

var p_pos = new THREE.Vector3(Math.floor(gx/2), 11, Math.floor(gz/2));
for (var x = 0; x < px; x++) {
    for (var y = 0; y < py; y++) {
        for (var z = 0; z < pz; z++) {
            var idx = grid_idx(x, y, z);
            if (p_cubes[p_idx(x, y, z)] == true) {
                g_idx = grid_idx((p_pos.x + x) * 1, (p_pos.y + y) * 1, (p_pos.z + z) * 1);
                grid_cubes[g_idx].visible = true;
            }
        }
    }
}


camera.position.set(step * gy * 2, step * gy * 2 + 400, step * gy * 2);
camera.lookAt(0.0, gy/2, 0.0);
//var controls = new THREE.FlyControls(camera, renderer.domElement)
var controls = new THREE.OrbitControls(camera, renderer.domElement)
//controls.domElement = renderer.domElement;
//controls.rollSpeed = Math.PI / 24;
//controls.autoForward = false;
//controls.dragToLook = true;


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

var rotY = 0;
var rot_oldY = 0;

var rotX = 0;
var rot_oldX = 0;

var rotZ = 0;
var rot_oldZ = 0;

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

function int_rotationX(posx, posy, posz, rot) {
    var new_px = posx;
    var new_py = cospi2(rot) * (posy - 1) - sinpi2(rot) * (posz - 1);
    var new_pz = sinpi2(rot) * (posy - 1) - cospi2(rot) * (posz - 1);
    return { x: new_px, y: new_py + 1, z: new_pz + 1 };
}

function int_rotationZ(posx, posy, posz, rot) {
    var new_px = cospi2(rot) * (posx - 1) - sinpi2(rot) * (posy - 1);
    var new_py = sinpi2(rot) * (posx - 1) + cospi2(rot) * (posy - 1);
    var new_pz = posz;
    return { x: new_px + 1, y: new_py + 1, z: new_pz };
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

    //mouse_old.x = mouse.x;
    //mouse_old.y = mouse.y;
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
    let bx = false;
    let by = false;
    let bz = false;
    //let g_idx = grid_idx(x, y, z);
    if (x > gx) {
        return true;
    }
    if (x < 0) {
        return true;
    }
    if (y > gy) {
        return true;
    }
    if (y < 0) {
        return true;
    }
    if (z > gz) {
        return true;
    }
    if (z < 0) {
        return true;
    }

    //return !(0 <= g_idx && g_idx < grid_size);

}

// Input handling
let key_pressed = false;
let key_code = 0;

window.addEventListener('keypress', (e) => {
    key_pressed = true;
    key_code = e.code;
});

var geom_plane = new THREE.PlaneGeometry( 100* gx * step, 100*  gz * step, 32 );
geom_plane.rotateX(-Math.PI/2.0);
//geom_plane.translate(new THREE.Vector3((gx - 1)*step/2,  0.0, -(gz - 1)*step/2))
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geom_plane, material );
scene.add( plane );
plane.visible = false;

function animate() {  
    requestAnimationFrame(animate)
    raycaster.setFromCamera( mouse, camera );
    render()

    for (var x = 0; x < gx * 1; x += 1) {
        for (var y = 0; y < gy * 1; y += 1) {
            for (var z = 0; z < gz * 1; z += 1) {
                var idx = grid_idx(x, y, z);
                if (grid_stopped[idx] == false) {
                    grid_cubes[idx].visible = false;
                } else {
                    grid_cubes[idx].visible = true;
                }
            }
        }
    }

    var move_object = true;
    if (is_dragging == false)
        move_object = false;

    var intersect_cubes = [];
    for (var x = 0; x < px; x++) {
        for (var y = 0; y < py; y++) {
            for (var z = 0; z < pz; z++) {
                if (p_cubes[p_idx(x, y, z)] == true) {
                    let p = int_rotationY(x, y, z, rotY);
                    p = int_rotationZ(p.x, p.y, p.z, rotZ);
                    p = int_rotationX(p.x, p.y, p.z, rotX);
                    let g_idx = grid_idx((p_pos.x + p.x) * 1, (p_pos.y + p.y) * 1, (p_pos.z + p.z) * 1);
                    grid_cubes[g_idx].visible = true;
                    if (move_object == false)
                        grid_cubes[g_idx].material.color.set(0x00ff00);
                    intersect_cubes.push(grid_cubes[g_idx]);
                }
            }
        }
    }
    var intersects = raycaster.intersectObjects( group.children );
    var first = false;
    for ( var i = 0; i < intersects.length; i++ ) {
        for (var l = 0; l < intersect_cubes.length; l++) {
            if (intersects[ i ].object == intersect_cubes[l]) { 
                move_object = true;
                //mouse_old.x = mouse_2.x;
                //mouse_old.y = mouse_2.y;
                //mouse_2.x = intersects[i].point.x;
                //mouse_2.y = -intersects[i].point.z;
                if (mouse_down == true)
                    is_dragging = true;
            }
        }

        if (first == false) {
            //mouse_old.x = mouse_2.x;
            //mouse_old.y = mouse_2.y;
            //mouse_2.x = intersects[intersects.length/2].point.x;
            //mouse_2.y = -intersects[intersects.length/2].point.z;
            first = true;
        }
    }
    if (move_object == true || is_dragging == true) {
        for (var l = 0; l < intersect_cubes.length; l++) {
            intersect_cubes[l].material.color.set(0xff0000);
        }
    }
    //delta.x = mouse_2.x - mouse_old.x;
    //delta.y = mouse_2.y - mouse_old.y;
    //let proj = new THREE.Vector3(delta.x, delta.y, 0.0);
    //let projector_normal = new THREE.Vector3(0, 1, 0);
    //projector_normal.project(camera);
    //projector_normal.applyMatrix4(camera.projectionMatrixInverse);

    //proj.projectOnPlane(projector_normal);
    //proj.applyMatrix4(camera.projectionMatrixInverse);
    //proj.applyMatrix4(camera.matrixWorld);
    //proj.projectOnPlane(new THREE.Vector3(0, 1, 0));

    var inter_plane = raycaster.intersectObject( plane);
    for ( var i = 0; i < inter_plane.length; i++ ) {
            mouse_old.x = mouse_2.x;
            mouse_old.y = mouse_2.y;
            mouse_2.x = inter_plane[i].point.x;
            mouse_2.y = -inter_plane[i].point.z;
    }
    //delta.x = proj.x;
    //delta.y = proj.z;
    delta.x = mouse_2.x - mouse_old.x;
    delta.y = mouse_2.y - mouse_old.y;

    px_old = p_pos.x;
    py_old = p_pos.y;
    pz_old = p_pos.z;

    if (is_dragging == true) {
        var mulx = 0.1;
        var muly = 0.1;
        delta.normalize();
        p_pos.x += delta.x * mulx;
        p_pos.z += delta.y * muly;
    }
    //console.log(move_object);

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    controls.update( dt );

    dt = (Date.now() - last_time)/1000;
    last_time = Date.now();
    total = dt / 2.0;

    let px_maybe = p_pos.x;
    let py_maybe = p_pos.y;
    let pz_maybe = p_pos.z;
    let rot_maybex = rotX;
    let rot_maybey = rotY;
    let rot_maybez = rotZ;

    for (var x = 0; x < px; x++) {
        for (var y = 0; y < py; y++) {
            for (var z = 0; z < pz; z++) {
                if (p_cubes[p_idx(x, y, z)] == true) {
                    let p = int_rotationY(x, y, z, rotY);
                    p = int_rotationZ(p.x, p.y, p.z, rotZ);
                    p = int_rotationX(p.x, p.y, p.z, rotX);
                    let bound = bounded_pos((p_pos.x + p.x) * 1, (p_pos.y + p.y) * 1, (p_pos.z + p.z) * 1);
                    //console.log(bound);
                    if (bound == true) {
                        px_maybe = px_old;
                        //py_maybe = py_old;
                        pz_maybe = pz_old;
                        rot_maybex = rot_oldX;
                        rot_maybey = rot_oldY;
                        rot_maybez = rot_oldZ;
                    }
                }
            }
        }
    }
    p_pos.x = px_maybe;
    p_pos.y = py_maybe;
    p_pos.z = pz_maybe;
    rotX = rot_maybex;
    rotY = rot_maybey;
    rotZ = rot_maybez;
    // Update
    if (count % 5 == 0) {
        px_old = p_pos.x;
        py_old = p_pos.y;
        pz_old = p_pos.z;
        rot_oldY = rotY;
        rot_oldZ = rotZ;
        rot_oldX = rotX;
        if (key_pressed && key_code == "KeyY") {
            rotY += 90;
        }
        if (key_pressed && key_code == "KeyU") {
            rotZ += 90;
        }
        if (key_pressed && key_code == "KeyI") {
            rotX += 90;
        }
        key_pressed = false;
        key_code = 0;
        count_rot = 1;
    }


    if (count > 50) {
        px_old = p_pos.x;
        py_old = p_pos.y;
        pz_old = p_pos.z;
        p_pos.y -= 1;
        count = 1;
    }
    //pos = bounded_pos(p_pos.x, p_pos.y, p_pos.z);
    //p_pos.x = pos.x;
    //p_pos.y = pos.y;
    //p_pos.z = pos.z;
    px_maybe = p_pos.x;
    py_maybe = p_pos.y;
    pz_maybe = p_pos.z;
    rot_maybex = rotX;
    rot_maybey = rotY;
    rot_maybez = rotZ;
    var stop = false;
    for (var x = 0; x < px; x++) {
        for (var y = 0; y < py; y++) {
            for (var z = 0; z < pz; z++) {
                if (p_cubes[p_idx(x, y, z)] == true) {
                    let p = int_rotationY(x, y, z, rotY);
                    p = int_rotationZ(p.x, p.y, p.z, rotZ);
                    p = int_rotationX(p.x, p.y, p.z, rotX);
                    let bound = bounded_pos((p_pos.x + p.x) * 1, (p_pos.y + p.y) * 1, (p_pos.z + p.z) * 1);
                    //console.log(bound);
                    if (bound == true) {
                        px_maybe = px_old;
                        py_maybe = py_old;
                        pz_maybe = pz_old;
                        rot_maybex = rot_oldX;
                        rot_maybey = rot_oldY;
                        rot_maybez = rot_oldZ;
                    } else {
                        let p = int_rotationY(x, y, z, rotY);
                        p = int_rotationZ(p.x, p.y, p.z, rotZ);
                        p = int_rotationX(p.x, p.y, p.z, rotX);
                        let g_idx = grid_idx((p_pos.x + p.x) * 1, (p_pos.y + p.y) * 1, (p_pos.z + p.z) * 1);
                        if (grid_stopped[g_idx] == true) {
                            stop = true;
                            px_maybe = px_old;
                            py_maybe = py_old;
                            pz_maybe = pz_old;
                            rot_maybex = rot_oldX;
                            rot_maybey = rot_oldY;
                            rot_maybez = rot_oldZ;
                        }
                    }
                    if (p_pos.y + p.y <= 0)
                        stop = true;
                }
            }
        }
    }
    p_pos.x = px_maybe;
    p_pos.y = py_maybe;
    p_pos.z = pz_maybe;
    rotX = rot_maybex;
    rotY = rot_maybey;
    rotZ = rot_maybez;

    if (stop == true) {
        for (var x = 0; x < px; x++) {
            for (var y = 0; y < py; y++) {
                for (var z = 0; z < pz; z++) {
                    if (p_cubes[p_idx(x, y, z)] == true) {
                        let p = int_rotationY(x, y, z, rotY);
                        p = int_rotationZ(p.x, p.y, p.z, rotZ);
                        p = int_rotationX(p.x, p.y, p.z, rotX);
                        let g_idx = grid_idx((p_pos.x + p.x) * 1, (p_pos.y + p.y) * 1, (p_pos.z + p.z) * 1);
                        grid_stopped[g_idx] = true;
                        grid_cubes[g_idx].visible = true;
                    }
                }
            }
        }
        p_pos.y = 11;
        p_pos.x = Math.floor(gx/2);
        p_pos.z = Math.floor(gz/2);
        let piece = Math.floor((Math.random()*7));
        p_cubes = objects(piece, p_size);

        for (var y = 0; y < gy * 1; y += 1) {
            let slice_full = true;
            for (var x = 0; x < gx * 1; x += 1) {
                for (var z = 0; z < gz * 1; z += 1) {
                    var idx = grid_idx(x, y, z);
                    if (grid_stopped[idx] == false) {
                        slice_full = false;
                    }
                }
            }
            if (slice_full == true) {
                for (var x = 0; x < gx * 1; x += 1) {
                    for (var z = 0; z < gz * 1; z += 1) {
                        var idx = grid_idx(x, y, z);
                        grid_stopped[idx] = false;
                        grid_cubes[idx].visible = false;
                    }
                }
                for (var yy = y + 1; yy < gy * 1; yy += 1) {
                    for (var x = 0; x < gx * 1; x += 1) {
                        for (var z = 0; z < gz * 1; z += 1) {
                            var idx = grid_idx(x, yy, z);
                            let new_idx = grid_idx(x, yy - 1, z)
                            if (grid_stopped[idx] == true) {
                                grid_stopped[idx] = false;
                                grid_cubes[idx].visible = false;

                                grid_stopped[new_idx] = true;
                                grid_cubes[new_idx].visible = true;
                            }
                        }
                    }
                }
            }
        }
    }

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
