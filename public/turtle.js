//import * as THREE from './js/three.js'
//import * as PARSER from './lsystem_parser.js'
//

var turtle_stack = [];

function turtle_interpreter(turtle, scene, symbol, theta) {
    switch(symbol) {
        // Turn left by angle theta
        case '+':
            turtle.rotateY(theta);
            break;
    
        // Turn right by angle theta
        case '-':
            turtle.rotateY(-theta);
            break;
    
        // Pitch down by angle theta
        case '&':
            turtle.rotateX(theta);
            break;
            
        // Pitch up by angle theta
        case '^':
            turtle.rotateX(-theta);
            break;
            
        // Roll left by angle theta
        case '\\':
            turtle.rotateZ(theta);
            break;
            
        // Roll right by angle theta
        case '/':
            turtle.rotateZ(-theta);
            break;
            
        // Turn around 180 degrees
        case '|':
            turtle.rotateZ(Math.PI);
            break;

        case 'F':
            var t = turtle;
            t.translateZ(turtle.step_dis/2.0);
            pos = t.position;
            var geometry = new THREE.CylinderBufferGeometry( turtle.begin_radius, turtle.end_radius, turtle.step_dis, 5 );
            var material = new THREE.MeshBasicMaterial( {color: 0x11ff11} );
            var cylinder = new THREE.Mesh( geometry, material );
            cylinder.position.copy(pos);
            cylinder.rotation.set(t.rotation.x, t.rotation.y, t.rotation.z);
            // Correct cylinder rotation
            cylinder.rotateX(Math.PI/2);

            scene.add( cylinder );
            turtle.translateZ(turtle.step_dis/2);
            break;
            
        case '[':
            var t = new THREE.Object3D();
            t.position.copy(turtle.position);
            t.rotation.copy(turtle.rotation);
            turtle_stack.push(t);
            break;
        case ']':
            var t = turtle_stack.pop();
            turtle.position.copy(t.position);
            turtle.rotation.copy(t.rotation);
            break;
    }
}

function generate_tree() {
    var tu = new THREE.Mesh();
    var turtle = new THREE.Object3D();
    let mul = 6.0;
    turtle.step_dis = 0.1/4*mul;
    turtle.position = new THREE.Vector3();
    turtle.rotateX(-Math.PI/2);
    turtle.end_radius = 0.2/8.0/8*mul;
    turtle.begin_radius = 0.1/8.0/8*mul;
    var string = generate_string(5);
    //var string = 'F[/+F]+-F';
    console.log(string)
    console.log(string.length)
    for (let i = 0, n = string.length; i < n; ++i) {
        turtle_interpreter(turtle, tu, string[i], Math.PI*22.5/180.0);
    }
    return tu;
}


