// Three.js setup
var renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById("main-canvas"),
    antialias:true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio( window.devicePixelRatio );


var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1.1, 15000);

var loader = new THREE.TextureLoader()

sun_light = new THREE.DirectionalLight( 0xffffff, 0.8 );
scene.add( sun_light );

//scene.fog = new THREE.Fog( 0xcce0ff, 500, 1000 );

var sky = generate_sky();

var cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 
  1024, 
  { 
      format: THREE.RGBFormat, 
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter ,
  }
);
var cubeCamera = new THREE.CubeCamera( 0.1, 1, cubeRenderTarget );


// Isso aqui nao tah funcionando e nao entendo pq
scene.background = cubeRenderTarget;

camera.position.set(7500.0,  1200.0, 6000.0);
camera.lookAt(3000.0, 200.0, 1000.0);
var controls = new THREE.FlyControls(camera, renderer.domElement)
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;
//controls.mouseDragOn = true;
var sky_uniforms = sky.material.uniforms;
var parameters = {
  distance: 400,
  inclination: 0.489,
  azimuth: 0.1257
};

function updateSun() {
  update_sun(sky, sun_light, parameters.inclination, parameters.azimuth, parameters.distance);
  cubeCamera.update(renderer, sky);
}

// Initial values (Sky)
sky_uniforms.rayleigh.value = 1;
sky_uniforms.turbidity.value = 2;
sky_uniforms.luminance.value = 1;
sky_uniforms.mie_coeff.value = 0.00005;
sky_uniforms.mie_directionalg.value = 0.8;

updateSun();

function save() {
    var ctx3d = renderer.getContext();
    var width = 1024;
    var height = 1024;
    var cameraNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    var canvas = document.createElement('canvas');
    canvas.id     = 'canvas';
    canvas.width  = width;
    canvas.height = height;
    canvas.style.zIndex   = 8;
    canvas.style.position = 'absolute';

    document.body.appendChild(canvas);

    renderer.setSize(1024, 1024);
    const zip = new JSZip();
    for (var i = 0; i < 6; i++) {
        var data = new Uint8Array(width * height * 4);
        renderer.render(scene, cubeCamera.children[i]);
        ctx3d.readPixels(0, 0, width, height, ctx3d.RGBA, ctx3d.UNSIGNED_BYTE, data);

        var ctx = canvas.getContext('2d');

        var imageData = ctx.createImageData(width, height);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);

        var pngUrl = canvas.toDataURL().split(",")[1];
        zip.file(`${cameraNames[i]}.png`, pngUrl, {base64: true});
    }
    zip.generateAsync({ type: "blob" }).then(blob => {
        saveAs(blob, "skybox.zip");
    });
    renderer.setSize(window.innerWidth, window.innerHeight)
}

var f = {
    saveFunction: save,
};
var gui = new dat.GUI();
var folder = gui.addFolder( 'Sky' );
folder.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun );
folder.add( sky_uniforms.rayleigh, 'value', 0, 10, 0.0001 ).onChange( updateSun ).name('Rayleigh');
folder.add( sky_uniforms.turbidity, 'value', 0, 5, 0.0001 ).onChange( updateSun ).name('Turbidity');
folder.add( sky_uniforms.luminance, 'value', 0, 5, 0.00001 ).onChange( updateSun ).name('Luminance');
folder.add( sky_uniforms.mie_coeff, 'value', 0, 0.01, 0.00001 ).onChange( updateSun ).name('Mie Coeff');
folder.add( sky_uniforms.mie_directionalg, 'value', 0, 1, 0.00001 ).onChange( updateSun ).name('Mie Dir G');
folder.add( f, 'saveFunction').name('Save');

folder.open();


//var folder = gui.addFolder('tree');
//folder.add(tree_uniforms.speed, 'value', 0, 100, 0.001).name('Speed');
//folder.add(tree_uniforms.min_strength, 'value', 0, 20, 0.001).name('Min Strength');
//folder.add(tree_uniforms.max_strength, 'value', 1, 200, 0.001).name('Max Strength');
//folder.add(tree_uniforms.interval, 'value', 0, 10, 0.001).name('Interval');
//folder.add(tree_uniforms.detail, 'value', 0, 100, 0.001).name('Detail');
//folder.add(tree_uniforms.distortion, 'value', 0, 1, 0.001).name('Distortion');
//folder.add(tree_uniforms.height_offset, 'value', 0, 10, 0.001).name('Height offset');
//folder.open();

var last_time = 0.0;
var total = 0.0;
var dt = 0;
var count = 0;
function animate() {  
  requestAnimationFrame(animate)
  render()

  controls.movementSpeed = 500;
  controls.lookSpeed = 0.1;
  controls.update( dt );

  dt = (dt * count  + (Date.now() - last_time)/1000)/(count + 1);
  dt = (Date.now() - last_time)/1000;
  last_time = Date.now();
  total = dt/2.0;
  //tree_uniforms.time.value = total;

  count += 1;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {
renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
animate()
