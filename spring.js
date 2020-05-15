function gen_spring(R, circle_steps, height, height_steps) {
    var spring = new THREE.Mesh();
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
    });
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            var angle = p1.angleTo(p2);
            var distance = p1.distanceTo(p2);

            var geometry = new THREE.CylinderGeometry( 0.02, 0.02, distance, 6 );
            geometry.verticesNeedUpdate = true;
            geometry.elementsNeedUpdate = true;
            geometry.normalsNeedUpdate = true;

            //var axis = new THREE.AxesHelper(0.5);
            var cylinder = new THREE.Mesh( geometry, material );
            //cylinder.add(axis);
            spring.add( cylinder );
            cylinder.position.x = p1.x;
            cylinder.position.y = p1.y;
            cylinder.position.z = p1.z;
            cylinder.up.set(1, 0, 0);
            cylinder.lookAt(p2);
            cylinder.rotateX(Math.PI/2);
            cylinder.translateY(distance/2);
            p1.x = p2.x;
            p1.y = p2.y;
            p1.z = p2.z;
        }
    }
    return spring;
}

function gen_spring_lines(R, circle_steps, height, height_steps) {
    var spring = new THREE.Mesh();
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshBasicMaterial({
        map: albedo,
        normalMap: normal,
        linewidth: 5,
    });
    var material = new THREE.LineBasicMaterial( {
        color: 0xffffff,
        linewidth: 5,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer
    } );
    var points = [];
    points.push(new THREE.Vector3(0, R, 0));
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
        }
    }
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var line = new THREE.Line( geometry, material );
    spring.add(line);
    return spring;
}
function update_spring(spring, R, circle_steps, height, height_steps) {
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3(0, 0, 0);
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var idx = 0;
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            var distance = p1.distanceTo(p2);
            var geometry = new THREE.CylinderGeometry( 0.02, 0.02, distance, 4 );
            spring.children[idx].geometry.copy(geometry);
            //spring.children[idx].position.set(p1.x, p1.y, p1.z);
            //spring.children[idx].rotation.x = 0;
            //spring.children[idx].rotation.y = 0;
            //spring.children[idx].rotation.z = 0;
            //spring.children[idx].rotateX(-Math.PI/2);
            spring.children[idx].position.x = p1.x;
            spring.children[idx].position.y = p1.y;
            spring.children[idx].position.z = p1.z;

            //spring.children[idx].up.set(1, 0, 0);
            spring.children[idx].lookAt(p2);
            spring.children[idx].rotateX(Math.PI/2);
            spring.children[idx].translateY(distance/2);
            p1.x = p2.x;
            p1.y = p2.y;
            p1.z = p2.z;
            idx += 1;
        }
    }
}
function update_spring_line(spring, R, circle_steps, height, height_steps) {
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
    });
    var points = [];
    points.push(new THREE.Vector3(0, R, 0));
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
        }
    }
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    spring.children[0].geometry.copy(geometry);
}
