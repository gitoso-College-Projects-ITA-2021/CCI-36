function objects(n, p_size){

    var p_cubes = new Array(p_size);

    
    // One cube
    if (n < 20){
        p_cubes[p_idx(0, 0, 0)] = true;
    } 
    else if (n < 30) { // Two cubes in line
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
    }  
    else if (n < 40) { // Tree cubes in line
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    } 
    else if (n < 50) { // Cube 2x2
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    } 
    else if (n < 60) { // Bomerang 2x2
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
        p_cubes[p_idx(1, 2, 1)] = true;
    }
    else if (n < 70) { // Mini T
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
     
    }  
    else if (n < 80) { // Bomerang 3x2
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
    }  
    else if (n < 90) { // Bomerang 3x2x2
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 2)] = true;
        p_cubes[p_idx(2, 0, 0)] = true;
    }  
    else if (n < 100) { // Wall 1x3x3
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
        p_cubes[p_idx(0, 1, 2)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(2, 1, 2)] = true;
    }  
    else if (n < 110) { // Z
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    }  
    else if (n < 120) { // Wall 1x2x3
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(0, 1, 2)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
    }  
    else if (n < 130) { // Wall 1x2x2
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    }  
    else if (n < 140) { // Quase um Cube 2x2
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    }  
    else if (n < 150) { // Z gordo
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    }  
    else if (n < 160){ // Cubo com pontinha
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    }
    else { // "estrela" << pior de todos
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 2, 1)] = true;
        p_cubes[p_idx(0, 1, 1)] = true; 
        p_cubes[p_idx(2, 1, 1)] = true;  
    }
    
    return p_cubes;
}

function p_idx(x, y, z) {
    return Math.floor(x + y * px + z * px * py);
}
