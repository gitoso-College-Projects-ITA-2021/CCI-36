function objects(n, p_size){

    var p_cubes = new Array(p_size);

    switch (n) {
        // One cube
        case 1: 
            p_cubes[p_idx(0, 0, 0)] = true;
            break;

        // Two cubes in line
        case 2:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            break;

        // Tree cubes in line
        case 3:
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            break;

        // Cube 2x2
        case 4:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            break;

        // Bomerang 2x2
        case 5:
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            p_cubes[p_idx(1, 2, 1)] = true;
            break;

        // Mini T
        case 6:
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            break;
        
        // Bomerang 3x2
        case 7:
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            break;

        // Bomerang 3x2x2
        case 8:
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(2, 1, 0)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 2)] = true;
            p_cubes[p_idx(2, 0, 0)] = true;
            break;

        // Wall 1x3x3
        case 9:
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(2, 1, 0)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            p_cubes[p_idx(0, 1, 2)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            p_cubes[p_idx(2, 1, 2)] = true;
            break;
        
        // Z
        case 10:
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            break;
        
        // Wall 1x2x3
        case 11:
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(0, 1, 2)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            break;
        
        // Wall 1x2x2
        case 12:
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            break;
        
        // Quase um Cube 2x2
        case 13:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            break;
        
        // Z gordo
        case 14:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(2, 1, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            break;
        
        // Cubo com pontinha
        case 15:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(2, 1, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            break;
        
        // "estrela" << pior de todos
        case 16:
            p_cubes[p_idx(1, 1, 0)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 2)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(1, 2, 1)] = true;
            p_cubes[p_idx(0, 1, 1)] = true; 
            p_cubes[p_idx(2, 1, 1)] = true;            
            break;

        default:
            p_cubes[p_idx(0, 0, 0)] = true;
    }
    return p_cubes;
}

function p_idx(x, y, z) {
    return Math.floor(x + y * px + z * px * py);
}
