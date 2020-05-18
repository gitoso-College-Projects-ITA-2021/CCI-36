function generateTable(mesaSize, mesaHeight) {
    var woodTexture = new THREE.TextureLoader().load('assets/hardwood.jpg')
    var woodTextureNormal = new THREE.TextureLoader().load('assets/hardwood_normal.jpg')

    var geometry = new THREE.BoxGeometry(mesaSize.x, mesaSize.y, mesaSize.z)
    var material = new THREE.MeshPhongMaterial({
    map: woodTexture, 
    normalMap: woodTextureNormal
    })
    var tampo = new THREE.Mesh(geometry, material)
    tampo.position.set(0, mesaHeight, 0)

    geometry = new THREE.BoxGeometry(0.5, mesaHeight, 0.5)
    var pe1 = new THREE.Mesh(geometry, material)
    pe1.position.set(mesaSize.x / 2 - 0.5, mesaHeight / 2, mesaSize.z / 2 - 0.5)
    var pe2 = new THREE.Mesh(geometry, material)
    pe2.position.set(- mesaSize.x / 2 + 0.5, mesaHeight / 2, - mesaSize.z / 2 + 0.5)
    var pe3 = new THREE.Mesh(geometry, material)
    pe3.position.set(- mesaSize.x / 2 + 0.5, mesaHeight / 2, mesaSize.z / 2 - 0.5)
    var pe4 = new THREE.Mesh(geometry, material)
    pe4.position.set(mesaSize.x / 2 - 0.5, mesaHeight / 2, - mesaSize.z / 2 + 0.5)

    var mesa = new THREE.Group();
    mesa.add(tampo)
    mesa.add(pe1)
    mesa.add(pe2)
    mesa.add(pe3)
    mesa.add(pe4)
    mesa.receiveShadow = true

    return mesa
}
