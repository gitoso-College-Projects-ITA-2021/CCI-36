function generate_vase() {
    var texture =  new THREE.TextureLoader().load('assets/clay.png')
    var geometry = new THREE.CylinderGeometry( 0.5, 0.4, 1, 20 );
    var material = new THREE.MeshPhongMaterial( {map: texture} );
    var vase = new THREE.Mesh( geometry, material );
    
    return vase
}