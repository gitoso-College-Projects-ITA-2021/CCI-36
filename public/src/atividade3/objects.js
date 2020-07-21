function objects(n, p_size){

    var p_cubes = new Array(p_size);
    start = 40
    
    // One cube
    if (n < start){
        p_cubes[p_idx(0, 0, 0)] = true;
    } 
    else if (n < start + 10) { // Two cubes in line
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
    }  
    else if (n < start + 20) { // Tree cubes in line
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    } 
    else if (n < start + 30) { // Cube 2x2
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    } 
    else if (n < start + 40) { // Bomerang 2x2
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
        p_cubes[p_idx(1, 2, 1)] = true;
    }
    else if (n < start + 50) { // Mini T
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
     
    }  
    else if (n < start + 60) { // Bomerang 3x2
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
    }  
    else if (n < start + 70) { // Bomerang 3x2x2
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 2)] = true;
        p_cubes[p_idx(2, 0, 0)] = true;
    }  
    else if (n < start + 80) { // Wall 1x3x3
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
    else if (n < start + 90) { // Z
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    }  
    else if (n < start + 100) { // Wall 1x2x3
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(0, 1, 2)] = true;
        p_cubes[p_idx(1, 1, 2)] = true;
    }  
    else if (n < start + 110) { // Wall 1x2x2
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    }  
    else if (n < start + 120) { // Quase um Cube 2x2
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(0, 1, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(0, 1, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
    }  
    else if (n < start + 130) { // Z gordo
        p_cubes[p_idx(0, 0, 0)] = true;
        p_cubes[p_idx(1, 0, 0)] = true;
        p_cubes[p_idx(1, 1, 0)] = true;
        p_cubes[p_idx(2, 1, 0)] = true;
        p_cubes[p_idx(0, 0, 1)] = true;
        p_cubes[p_idx(1, 0, 1)] = true;
        p_cubes[p_idx(1, 1, 1)] = true;
        p_cubes[p_idx(2, 1, 1)] = true;
    }  
    else if (n < start + 140){ // Cubo com pontinha
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
