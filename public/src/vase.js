function generate_vase(r1, r2, h) {
    // External vase
    var texture =  new THREE.TextureLoader().load('assets/vase.jpg')
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    texture.repeat.set( 6 , 2 )

    var normalTexture =  new THREE.TextureLoader().load('assets/vaseNormal.jpg')
    normalTexture.wrapT = THREE.RepeatWrapping
    normalTexture.wrapS = THREE.RepeatWrapping
    normalTexture.repeat.set( 6 , 2 )

    var geometry = new THREE.CylinderGeometry( r1, r2, h, 20 );
    var material = new THREE.MeshPhongMaterial( {map: texture, normalMap: normalTexture} );
    var vase = new THREE.Mesh( geometry, material );


    // Internal earth
    texture =  new THREE.TextureLoader().load('assets/earth.png')

    geometry = new THREE.CylinderGeometry( r1 - 0.15*r1, r2 - 0.15*r2, h + 0.005, 20 );
    material = new THREE.MeshLambertMaterial( {map: texture} );
    var earth = new THREE.Mesh( geometry, material );

    // Grouping
    var flowerVase = new THREE.Group();
    flowerVase.add(vase)
    flowerVase.add(earth)
    
    return flowerVase
}
