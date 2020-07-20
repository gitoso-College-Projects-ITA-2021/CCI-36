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

            // Tem que arruma o centros
        // Tree cubes in line
        case 3:
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(1, 1, 1)] = true;
            p_cubes[p_idx(2, 1, 1)] = true;
            break;

        // Four cubes in line
        case 4:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(2, 0, 0)] = true;
            //p_cubes[p_idx(3, 0, 0)] = true;
            break;

        // Bomerang 2x2
        case 5:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(0, 1, 0)] = true;
            break;

        // Bomerang 3x2
        case 6:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(0, 2, 0)] = true;
            break;

        // Bomerang 3x2x2
        case 7:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(0, 1, 0)] = true;
            p_cubes[p_idx(0, 2, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(0, 1, 1)] = true;
            p_cubes[p_idx(0, 2, 1)] = true;
            break;

        // Wall 1x4x4
        case 8:
            p_cubes[p_idx(0, 0, 0)] = true;
            p_cubes[p_idx(1, 0, 0)] = true;
            p_cubes[p_idx(2, 0, 0)] = true;
            p_cubes[p_idx(3, 0, 0)] = true;
            p_cubes[p_idx(0, 0, 1)] = true;
            p_cubes[p_idx(1, 0, 1)] = true;
            p_cubes[p_idx(2, 0, 1)] = true;
            p_cubes[p_idx(3, 0, 1)] = true;
            p_cubes[p_idx(0, 0, 2)] = true;
            p_cubes[p_idx(1, 0, 2)] = true;
            p_cubes[p_idx(2, 0, 2)] = true;
            p_cubes[p_idx(3, 0, 2)] = true;
            p_cubes[p_idx(0, 0, 3)] = true;
            p_cubes[p_idx(1, 0, 3)] = true;
            p_cubes[p_idx(2, 0, 3)] = true;
            p_cubes[p_idx(3, 0, 3)] = true;
            break;

        default:
            p_cubes[p_idx(0, 0, 0)] = true;
    }
    return p_cubes;
}

function p_idx(x, y, z) {
    return Math.floor(x + y * px + z * px * py);
}
