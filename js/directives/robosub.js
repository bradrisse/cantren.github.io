'use strict';

angular.module('simbox')
    .directive('robosub', function () {
        return {
            restrict: 'A',
            scope: {
                'width': '=',
                'height': '=',
                'fillcontainer': '=',
                'scale': '=',
                'materialType': '=',
                'speed': '=',
                'depth': '=',
                'trim': '='
            },
            link: function postLink(scope, element, attrs) {

                var camera, camera2, camera3, scene, scene2, renderer, renderer2, caustic, caustic2, container2,
                    shadowMesh, icosahedron, light, water, water2, waterNormals, waterNormals2, waterNormals3, spotLightRED, mirrorMesh, mirrorMesh, mirrorMesh2, mirrorMeshB, mirrorMeshB2, mirrorMesh3, mirrorMeshB3,
                    renderPass, copyPass, brightnessContrastPass, camControls, camControls2, camControls3,
                    lightRed, lightGreen, lightBlue, light2Red, light2Green, light2Blue, ambientLightRed, ambientLight2Red, ambientLightGreen, ambientLight2Green, ambientLightBlue, ambientLight2Blue, spotLightRED, spotLightRED2, spotLightGREEN, spotLightGREEN2, spotLightBLUE, spotLightBLUE2,
                    sphere, sphere2, shaderParams, onToggleShaders,
                    intensity, intensity1, intensity2, intensity3, depthcm,
                    adjIntensityRED, adjIntensityGREEN, adjIntensityBLUE, adjIntensity1RED, adjIntensity1GREEN, adjIntensity1BLUE, adjIntensity2RED, adjIntensity2GREEN, adjIntensity2BLUE, adjIntensity3RED, adjIntensity3GREEN, adjIntensity3BLUE,
                    posX, timeSolar,
                    fogDensity,
                    contW = (scope.fillcontainer) ?
                    element[0].clientWidth : scope.width,
                    contH = scope.height,
                    windowHalfX = contW / 2,
                    windowHalfY = contH / 2,
                    materials = {};
                var keyboard = new KeyboardState();
                var clock = new THREE.Clock();
                var parameters = {
                    width: 2000,
                    height: 2000,
                    widthSegments: 250,
                    heightSegments: 250,
                    depth: 1500,
                    param: 4,
                    filterparam: 1
                }


                scope.init = function () {
                    renderer = new THREE.WebGLRenderer({
                        antialias: true
                    });
                    renderer.setClearColor(0xffffff);
                    renderer.setSize(window.innerWidth, window.innerHeight);

                    container2 = document.getElementById('inset');
                    // renderer
                    renderer2 = new THREE.WebGLRenderer();
                    renderer2.setClearColor(0xf0f0f0, 1);
                    renderer2.setSize(300, 300);
                    container2.appendChild(renderer2.domElement);


                    scene = new THREE.Scene();
                    //scene.overrideMaterial = new THREE.MeshDepthMaterial();
                    scene2 = new THREE.Scene();
                    //scene2.overrideMaterial = new THREE.MeshDepthMaterial();

                    //add water colored fog
                    scene.fog = new THREE.FogExp2(0x008080, 0.1875);
                    scene2.fog = new THREE.FogExp2(0x008080, 0.1875);

                    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 3000000);
                    //buoy closeup location
                    camera.position.x = -16.73; //pool line of symetry is x axis
                    camera.position.y = -2.52; //water depth
                    camera.position.z = -22.57; //how close to the wall are you


                    //normal starting location
                    //              camera.position.x = 0.0;//pool line of symetry is x axis
                    //              camera.position.y = -2.0;//water depth
                    //                  camera.position.z = -28.0;//how close to the wall are you
                    //normal starting location
                    camera.rotation.z = 3.06;
                    camera.near = 0.5;
                    camera.far = 21.5;

                    camera2 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 3000000);
                    camera2.up = camera.up; // important!

                    //buoy closeup location
                    camera2.position.x = -16.73; //pool line of symetry is x axis
                    camera2.position.y = -2.52; //water depth
                    camera2.position.z = -22.57; //how close to the wall are you
                    //buoy closeup location

                    //normal starting location
                    //                  camera2.position.x = 0.0;//pool line of symetry is x axis
                    //              camera2.position.y = -2.0;//water depth
                    //                  camera2.position.z = -28.0;//how close to the wall are you
                    camera2.rotation.z = 3.06;
                    //camera.position.set( 0, -2, -28 );

                    camera3 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 3000000);
                    camera3.up = camera.up; // important!

                    camera3.position.x = 0.0; //pool line of symetry is x axis
                    camera3.position.y = -2.0; //water depth
                    camera3.position.z = -28.0; //how close to the wall are you

                    //POST PROCESSING
                    //Create Shader Passes
                    renderPass = new THREE.RenderPass(scene, camera);
                    copyPass = new THREE.ShaderPass(THREE.CopyShader);

                    brightnessContrastPass = new THREE.ShaderPass(THREE.BrightnessContrastShader);
                    brightnessContrastPass.uniforms["contrast"].value = 0.8;

                    camControls = new THREE.FirstPersonControls(camera, renderer.domElement);
                    camControls.activeLook = false;
                    camControls.lookSpeed = 0.05; //Pitch Thrust to drag ratio
                    camControls.movementSpeed = 0.25; // FWD BKWD Thrust to drag ratio 
                    camControls.verticalMin = -50.0; //basement floor level
                    camControls.verticalMax = 10.0; //sky ceiling level

                    camControls2 = new THREE.FirstPersonControls(camera2, renderer2.domElement);
                    camControls2.lookSpeed = 0.05; //Pitch Thrust to drag ratio
                    camControls2.movementSpeed = 0.25; // FWD BKWD Thrust to drag ratio 
                    camControls2.verticalMin = -50.0; //basement floor level
                    camControls2.verticalMax = 10.0; //sky ceiling level

                    camControls3 = new THREE.FirstPersonControls(camera2, renderer2.domElement);
                    camControls2.lookSpeed = 0.05; //Pitch Thrust to drag ratio
                    camControls2.movementSpeed = 0.25; // FWD BKWD Thrust to drag ratio 
                    camControls2.verticalMin = -50.0; //basement floor level
                    camControls2.verticalMax = 10.0; //sky ceiling level



                    //Add scene lighting
                    lightRed = new THREE.HemisphereLight(0xff0000, 0x008080, 1); //I tried changing the light color here to see what would happen
                    lightRed.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    lightRed.intensity = .25;
                    scene.add(lightRed); //I changed the name to distinguish a negative y value from "sunlight"

                    light2Red = new THREE.HemisphereLight(0xff0000, 0x008080, 1); //I tried changing the light color here to see what would happen
                    light2Red.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    light2Red.intensity = .25;
                    scene2.add(light2Red); //I changed the name to distinguish a negative y value from "sunlight"

                    lightGreen = new THREE.HemisphereLight(0x5eff00, 0x008080, 1); //I tried changing the light color here to see what would happen
                    lightGreen.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    lightGreen.intensity = .25;
                    scene.add(lightGreen); //I changed the name to distinguish a negative y value from "sunlight"

                    light2Green = new THREE.HemisphereLight(0x5eff00, 0x008080, 1); //I tried changing the light color here to see what would happen
                    light2Green.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    light2Green.intensity = .25;
                    scene2.add(light2Green); //I changed the name to distinguish a negative y value from "sunlight"

                    lightBlue = new THREE.HemisphereLight(0x00a9ff, 0x008080, 1); //I tried changing the light color here to see what would happen
                    lightBlue.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    lightBlue.intensity = .25;
                    scene.add(lightBlue); //I changed the name to distinguish a negative y value from "sunlight"

                    light2Blue = new THREE.HemisphereLight(0x00a9ff, 0x008080, 1); //I tried changing the light color here to see what would happen
                    light2Blue.position.set(-1, 1, -1); //my hemisphere flipped upside down
                    light2Blue.intensity = .25;
                    scene2.add(light2Blue); //I changed the name to distinguish a negative y value from "sunlight"

                    //More scene lighting
                    //Red
                    ambientLightRed = new THREE.AmbientLight(0xff0000);
                    ambientLightRed.intensity = .375;
                    scene.add(ambientLightRed);

                    ambientLight2Red = new THREE.AmbientLight(0xff0000);
                    ambientLight2Red.intensity = .375;
                    scene2.add(ambientLight2Red);

                    //Green
                    ambientLightGreen = new THREE.AmbientLight(0x5eff00);
                    ambientLightGreen.intensity = .375;
                    scene.add(ambientLightGreen);

                    ambientLight2Green = new THREE.AmbientLight(0x5eff00);
                    ambientLight2Green.intensity = .375;
                    scene2.add(ambientLight2Green);

                    //Blue
                    ambientLightBlue = new THREE.AmbientLight(0x00a9ff);
                    ambientLightBlue.intensity = .375;
                    scene.add(ambientLightBlue);

                    ambientLight2Blue = new THREE.AmbientLight(0x00a9ff);
                    ambientLight2Blue.intensity = .375;
                    scene2.add(ambientLight2Blue);

                    /*
                    //HemisphereLight details
                    lightRed lightRed.intensity = .25;
                    light2Red light2Red.intensity = .25;
                    lightGreen lightGreen.intensity = .25;
                    light2Green light2Green.intensity = .25;
                    lightBlue lightBlue.intensity = .25;
                    light2Blue light2Blue.intensity = .25;
                    //HemisphereLight details

                    //ambient light details
                    ambientLightRed ambientLightRed.intensity = .375;
                    ambientLight2Red ambientLight2Red.intensity = .375;
                    ambientLightGreen ambientLightGreen.intensity = .375;
                    ambientLight2Green ambientLight2Green.intensity = .375;
                    ambientLightBlue ambientLightBlue.intensity = .375;
                    ambientLight2Blue ambientLight2Blue.intensity = .375;
                    //ambient light details
                    */


                    //light up the sun
                    //spotLightSUN = new THREE.SpotLight(0xFFFFFF);
                    //spotLightSUN.position.set(100, 140, -130);
                    //spotLightSUN.intensity = 1000;
                    //scene.add(spotLightSUN);

                    //Add the three spotlights representing the sun(intensity will be modified as a function of depth)
                    spotLightRED = new THREE.SpotLight(0xff0000);
                    spotLightRED.position.set(100, 140, -130);
                    spotLightRED.intensity = .85;
                    scene.add(spotLightRED);

                    spotLightRED2 = new THREE.SpotLight(0xff0000);
                    spotLightRED2.position.set(100, 140, -130);
                    spotLightRED2.intensity = .85;
                    scene2.add(spotLightRED2);

                    spotLightBLUE = new THREE.SpotLight(0x00a9ff);
                    spotLightBLUE.position.set(100, 140, -130);
                    spotLightBLUE.intensity = .85;
                    scene.add(spotLightBLUE);

                    spotLightBLUE2 = new THREE.SpotLight(0x00a9ff);
                    spotLightBLUE2.position.set(100, 140, -130);
                    spotLightBLUE2.intensity = .85;
                    scene2.add(spotLightBLUE2);

                    spotLightGREEN = new THREE.SpotLight(0x5eff00);
                    spotLightGREEN.position.set(100, 140, -130);
                    spotLightGREEN.intensity = .85;
                    scene.add(spotLightGREEN);

                    spotLightGREEN2 = new THREE.SpotLight(0x5eff00);
                    spotLightGREEN2.position.set(100, 140, -130);
                    spotLightGREEN2.intensity = .85;
                    scene2.add(spotLightGREEN2);
                    //Add the three spotlights representing the sun(intensity will be modified as a function of depth)


                    // add spotlight for the shadows
                    /*
                                var spotLight = new THREE.SpotLight(0xffffff);
                                spotLight.position.set(100, 140, 130);
                                spotLight.intensity = 2;
                                scene.add(spotLight);
                                
                                var spotLight2 = new THREE.SpotLight(0xffffff);
                                spotLight2.position.set(100, 140, 130);
                                spotLight2.intensity = 2;
                                scene2.add(spotLight2);
                                */


                    //load and insert the obj meshes and mtl textures
                    //the "secret sauce" is in these .obj and .mtl files.
                    //              var loader = new THREE.OBJLoader(); //this object does the work
                    var loader = new THREE.OBJMTLLoader(); //this object does the work
                    //
                    //              loader.load('../obj/transdec OBJ/transdec test.obj', function ( object ) {
                    loader.load('obj/transdec OBJ/transdec test.obj', 'obj/transdec OBJ/transdec test.mtl', function (object) {
                        object.position.y = -12.975; //experimentally generated via trial and error
                        //                  for(var i in object.children) {
                        //                          object.children[i].material = new THREE.MeshDepthMaterial({color: 0x2194CE});
                        //                      }
                        scene.add(object); //to make a Robosub you would likely need to change it's name from "object"
                    });
                    //              loader.load('../obj/robosub obstacles/obstacles.obj', function ( object ) {
                    loader.load('obj/robosub obstacles/obstacles.obj', 'obj/robosub obstacles/obstacles.mtl', function (object) {
                        object.position.y = -12.975; //experimentally generated via trial and error
                        //                  for(var i in object.children) {
                        //                          object.children[i].material = new THREE.MeshDepthMaterial({color: 0x2194CE});
                        //                      }
                        scene.add(object); //to make a Robosub you would likely need to change it's name from "object"
                    });
                    //              loader.load('../obj/transdec OBJ/transdec test.obj', function ( object ) {
                    loader.load('obj/transdec OBJ/transdec test.obj', 'obj/transdec OBJ/transdec test.mtl', function (object) {
                        object.position.y = -12.975; //experimentally generated via trial and error
                        scene2.add(object); //to make a Robosub you would likely need to change it's name from "object"
                    });
                    //              loader.load('../obj/robosub obstacles/obstacles.obj', function ( object ) {
                    loader.load('obj/robosub obstacles/obstacles.obj', 'obj/robosub obstacles/obstacles.mtl', function (object) {
                        object.position.y = -12.975; //experimentally generated via trial and error
                        scene2.add(object); //to make a Robosub you would likely need to change it's name from "object"
                    });

                    waterNormals = new THREE.ImageUtils.loadTexture('textures/waternormals.jpg'); //potential for easy modification/obstacle reflections
                    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; //recycle that .jpg like a TV re-run

                    waterNormals2 = new THREE.ImageUtils.loadTexture('textures/waternormals.jpg'); //potential for easy modification/obstacle reflections
                    waterNormals2.wrapS = waterNormals2.wrapT = THREE.RepeatWrapping; //recycle that .jpg like a TV re-run

                    waterNormals3 = new THREE.ImageUtils.loadTexture('textures/waternormals.jpg'); //potential for easy modification/obstacle reflections
                    waterNormals3.wrapS = waterNormals3.wrapT = THREE.RepeatWrapping; //recycle that .jpg like a TV re-run


                    //initialize/declare water shader and provide parameters
                    water = new THREE.Water(renderer, camera, scene, {
                        textureWidth: 64,
                        textureHeight: 64,
                        waterNormals: waterNormals,
                        alpha: 0.925,
                        sunDirection: spotLightRED.position.clone().normalize(),
                        sunColor: 0xffffff,
                        waterColor: 0x001e0f,
                        distortionScale: 6.25,
                        fog: true,
                    });
                    water2 = new THREE.Water(renderer2, camera2, scene2, {
                        textureWidth: 64,
                        textureHeight: 64,
                        waterNormals: waterNormals2,
                        alpha: 0.925,
                        sunDirection: spotLightRED.position.clone().normalize(),
                        sunColor: 0xffffff,
                        waterColor: 0x001e0f,
                        distortionScale: 6.25,
                        fog: true,
                    });
                    caustic = new THREE.Water(renderer, camera, scene, {
                        textureWidth: 32,
                        textureHeight: 32,
                        waterNormals: waterNormals3,
                        alpha: 0.125,
                        sunDirection: spotLightRED.position.clone().normalize(),
                        sunColor: 0xffffff,
                        waterColor: 0xffffff,
                        distortionScale: 6.25,
                        fog: true,
                    });
                    caustic2 = new THREE.Water(renderer2, camera2, scene2, {
                        textureWidth: 32,
                        textureHeight: 32,
                        waterNormals: waterNormals3,
                        alpha: 0.125,
                        sunDirection: spotLightRED.position.clone().normalize(),
                        sunColor: 0xffffff,
                        waterColor: 0xffffff,
                        distortionScale: 6.25,
                        fog: true,
                    });

                    /*
                    water = new THREE.Water( renderer, camera, scene, { //three.js has a specific thing for water, this is it
                        textureWidth: 512, //size of waves I think, maybe the waternormals.jpg stretch?
                        textureHeight: 512, //size of waves I think, maybe the waternormals.jpg stretch?
                        waterNormals: waterNormals, //provides the .jpg Texture
                        alpha:  0.925, //how transparent is the water?
                        //sunDirection: new THREE.Vector3( 0.70707, -0.70707, 0 ), 
                        sunDirection: light.position.clone().normalize(), // I think this makes the reflection normal to the texture
                        sunColor: 0xffffff, //Light has to hit the water, what color is it?
                        waterColor: 0xe7e7ec,//,0x000000,//0x001e0f,//0xe7e7ec,//0x001e0f,//water color for different effects
                        distortionScale: 50.0, //also related to size of waves?
                        fog: true,
                    });
                    */

                    //initialize/declare new planes for holding the "water" texture mapping
                    mirrorMesh = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        water.material
                    );
                    mirrorMesh2 = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        water.material
                    );
                    mirrorMeshB = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        water2.material
                    );
                    mirrorMeshB2 = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        water2.material
                    );
                    mirrorMesh3 = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        caustic.material
                    );
                    mirrorMeshB3 = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        caustic2.material
                    );


                    mirrorMesh.add(water); //add water shader to otherwise boring underwater PlaneBufferGeometry
                    mirrorMesh2.add(water); //add water shader to otherwise boring PlaneBufferGeometry
                    mirrorMesh3.add(caustic); //add water shader to otherwise boring PlaneBufferGeometry

                    mirrorMeshB.add(water2); //add water shader to otherwise boring underwater PlaneBufferGeometry
                    mirrorMeshB2.add(water2); //add water shader to otherwise boring PlaneBufferGeometry
                    mirrorMeshB3.add(caustic2); //add water shader to otherwise boring PlaneBufferGeometry


                    mirrorMesh.rotation.x = -Math.PI * 1.5; //rotate undwater water surface to point down
                    mirrorMesh2.rotation.x = -Math.PI * 0.5; //rotate water surface to point up
                    mirrorMesh3.rotation.x = -Math.PI * 0.5; //rotate undwater water surface to point down

                    mirrorMeshB.rotation.x = -Math.PI * 1.5; //rotate undwater water surface to point down
                    mirrorMeshB2.rotation.x = -Math.PI * 0.5; //rotate water surface to point up
                    mirrorMeshB3.rotation.x = -Math.PI * 0.5; //rotate undwater water surface to point down

                    mirrorMesh.position.y = -.95; //water height experimentally generated via trial and error
                    mirrorMesh2.position.y = -.95; //water height experimentally generated via trial and error
                    mirrorMesh3.position.y = -5.65; //water height experimentally generated via trial and error

                    mirrorMeshB.position.y = -.95; //water height experimentally generated via trial and error
                    mirrorMeshB2.position.y = -.95; //water height experimentally generated via trial and error
                    mirrorMeshB3.position.y = -5.65; //water height experimentally generated via trial and error


                    scene.add(mirrorMesh); //add underwater water surface
                    scene.add(mirrorMesh2); //add water surface
                    scene.add(mirrorMesh3); //add water surface

                    scene2.add(mirrorMeshB); //add underwater water surface
                    scene2.add(mirrorMeshB2); //add water surface
                    scene2.add(mirrorMeshB3); //add water surface



                    // load skybox &/or (start example code copypasta: http://threejs.org/examples/#webgl_shaders_ocean)
                    var cubeMap = new THREE.CubeTexture([]); //initialize/declare the texture object to be mapped to the skybox mesh var skyBox = new THREE.Mesh
                    cubeMap.format = THREE.RGBFormat; //don't know what this does, appears to be a type declaration?
                    cubeMap.flipY = false; //if you make this true the walls of the box go below the horizon

                    var cubeMap2 = new THREE.CubeTexture([]); //initialize/declare the texture object to be mapped to the skybox mesh var skyBox = new THREE.Mesh
                    cubeMap2.format = THREE.RGBFormat; //don't know what this does, appears to be a type declaration?
                    cubeMap2.flipY = false; //if you make this true the walls of the box go below the horizon

                    var loader = new THREE.ImageLoader();
                    loader.load('textures/skyboxsun25degtest.png', function (image) {
                        var getSide = function (x, y) {
                            var size = 1024;
                            var canvas = document.createElement('canvas');
                            canvas.width = size;
                            canvas.height = size;
                            var context = canvas.getContext('2d');
                            context.drawImage(image, -x * size, -y * size);
                            return canvas;
                        };
                        cubeMap.images[0] = getSide(2, 1); // px
                        cubeMap.images[1] = getSide(0, 1); // nx
                        cubeMap.images[2] = getSide(1, 0); // py
                        cubeMap.images[3] = getSide(1, 2); // ny
                        cubeMap.images[4] = getSide(1, 1); // pz
                        cubeMap.images[5] = getSide(3, 1); // nz
                        cubeMap.needsUpdate = true;
                    });

                    var loader2 = new THREE.ImageLoader();
                    loader2.load('textures/skyboxsun25degtest.png', function (image) {
                        var getSide = function (x, y) {
                            var size = 1024;
                            var canvas = document.createElement('canvas');
                            canvas.width = size;
                            canvas.height = size;
                            var context = canvas.getContext('2d');
                            context.drawImage(image, -x * size, -y * size);
                            return canvas;
                        };
                        cubeMap2.images[0] = getSide(2, 1); // px
                        cubeMap2.images[1] = getSide(0, 1); // nx
                        cubeMap2.images[2] = getSide(1, 0); // py
                        cubeMap2.images[3] = getSide(1, 2); // ny
                        cubeMap2.images[4] = getSide(1, 1); // pz
                        cubeMap2.images[5] = getSide(3, 1); // nz
                        cubeMap2.needsUpdate = true;
                    });


                    var cubeShader = THREE.ShaderLib['cube'];
                    cubeShader.uniforms['tCube'].value = cubeMap;

                    var cubeShader2 = THREE.ShaderLib['cube'];
                    cubeShader2.uniforms['tCube'].value = cubeMap2;

                    //Create skybox material 
                    var skyBoxMaterial = new THREE.ShaderMaterial({
                        fragmentShader: cubeShader.fragmentShader,
                        vertexShader: cubeShader.vertexShader,
                        uniforms: cubeShader.uniforms,
                        depthWrite: false,
                        //fog: true, //To Do: make a derived shade which has been modified for "fog"
                        side: THREE.BackSide
                    });

                    var skyBoxMaterial2 = new THREE.ShaderMaterial({
                        fragmentShader: cubeShader2.fragmentShader,
                        vertexShader: cubeShader2.vertexShader,
                        uniforms: cubeShader2.uniforms,
                        depthWrite: false,
                        //fog: true, //To Do: make a derived shade which has been modified for "fog"
                        side: THREE.BackSide
                    });

                    //Create Mesh to map skybox material on to
                    var skyBox = new THREE.Mesh(
                        new THREE.BoxGeometry(10000, 10000, 10000),
                        skyBoxMaterial
                    );
                    var skyBox2 = new THREE.Mesh(
                        new THREE.BoxGeometry(10000, 10000, 10000),
                        skyBoxMaterial2
                    );

                    scene.add(skyBox); //create Point Loma Sky
                    scene2.add(skyBox2); //create Point Loma Sky

                    var guivalues = new function () {

                            this.timeShift = 0;
                            this.cameraNear = camera.near;
                            this.cameraFar = camera.far;
                            this.getLostBoth = function () {
                                camera.position.x = (Math.random() * 90.0);
                                camera.position.x -= 45.0;
                                camera.position.y = ((Math.random() * -4.55) - 0.95);
                                camera.position.z = (Math.random() * 60.0);
                                camera.position.z -= 30.0;
                                camera.rotation.y = (Math.random() * (Math.PI * 2.0));
                                camera.rotation.y -= Math.PI;
                            };
                            this.getLostComp = function () {
                                camera.position.x = (Math.random() * -45.0);
                                camera.position.y = ((Math.random() * -4.55) - 0.95);
                                camera.position.z = (Math.random() * 60.0);
                                camera.position.z -= 30.0;
                                camera2.rotation.y = (Math.random() * (Math.PI * 2.0));
                                camera2.rotation.y -= Math.PI;
                                camera.rotation.y = camera2.rotation.y;
                            };
                            this.getLostPract = function () {
                                camera.position.x = (Math.random() * 45.0);
                                camera.position.y = ((Math.random() * -4.55) - 0.95);
                                camera.position.z = (Math.random() * 60.0);
                                camera.position.z -= 30.0;

                                camera.rotation.y = (Math.random() * (Math.PI * 2.0));
                                camera.rotation.y -= Math.PI;
                            };
                            this.lookAtRedBuoy = function () {
                                camera.position.x = -23.14 + ((Math.random() * 10.0) - 5.0);
                                camera.position.y = -2.2; // + ((Math.random() * 1.0) - 0.5);
                                camera.position.z = -21.74 + ((Math.random() * 10.0) - 5.0);
                                //camera3.position.copy(camera);
                                camera3.position.x = -23.14;
                                camera3.position.y = -2.2
                                camera3.position.z = -21.74;


                                //camera.lookAt(-23.14,-2.2,-21.74);
                                //camera2.lookAt(camera3);
                                //camera.rotation.z = camera3.rotation.z;

                                //camera.rotation.z = (Math.random() * (Math.PI*2.0));
                                //camera.rotation.z -= Math.PI;
                            };
                            this.lookAtYellowBuoy = function () {
                                camera.position.x = -22.44 + ((Math.random() * 10.0) - 5.0);
                                camera.position.y = -2.15; // + ((Math.random() * 1.0) - 0.5);
                                camera.position.z = -20.69 + ((Math.random() * 10.0) - 5.0);
                                //camera3.position.copy(camera);
                                //camera.lookAt(-22.44,-2.15,-20.69);
                                //camera.rotation.z = camera3.rotation.z;

                                //camera.rotation.z = (Math.random() * (Math.PI*2.0));
                                //camera.rotation.z -= Math.PI;
                            };
                            this.lookAtGreenBuoy = function () {
                                camera.position.x = -21.8 + ((Math.random() * 10.0) - 5.0);
                                camera.position.y = -2.05; // + ((Math.random() * 1.0) - 0.5);
                                camera.position.z = -19.65 + ((Math.random() * 10.0) - 5.0);
                                //camera3.position.copy(camera);
                                //camera.lookAt(-21.8,-2.05,-19.65);
                                //camera.rotation.z = camera3.rotation.z;

                                //camera.rotation.z = (Math.random() * (Math.PI*2.0));
                                //camera.rotation.z -= Math.PI;
                            };
                            this.lightDepthFix = function () {
                                intensity = .85;
                                depthcm = (camera2.position.y + (0.9)) * (-100.0);
                                adjIntensityRED = (intensity * (Math.exp(-.006 * depthcm)));
                                adjIntensityGREEN = (intensity * (Math.exp(-.00032 * depthcm)));
                                adjIntensityBLUE = (intensity * (Math.exp(-.000247 * depthcm)));
                                spotLightRED.intensity = adjIntensityRED;
                                spotLightRED2.intensity = adjIntensityRED;
                                spotLightGREEN.intensity = adjIntensityGREEN;
                                spotLightGREEN2.intensity = adjIntensityGREEN;
                                spotLightBLUE.intensity = adjIntensityBLUE;
                                spotLightBLUE2.intensity = adjIntensityBLUE;
                            };
                            this.normalLight = function () {
                                var nintensity = 0.85;
                                var nintensity1 = .95;
                                var nintensity2 = .25;
                                var nintensity3 = .375;

                                spotLightRED.intensity = nintensity;
                                spotLightRED2.intensity = nintensity;
                                spotLightGREEN.intensity = nintensity;
                                spotLightGREEN2.intensity = nintensity;
                                spotLightBLUE.intensity = nintensity;
                                spotLightBLUE2.intensity = nintensity;

                                lightRed.intensity = nintensity2;
                                light2Red.intensity = nintensity2;
                                lightGreen.intensity = nintensity2;
                                light2Green.intensity = nintensity2;
                                lightBlue.intensity = nintensity2;
                                light2Blue.intensity = nintensity2;

                                //ambient light set
                                ambientLightRed.intensity = nintensity3;
                                ambientLight2Red.intensity = nintensity3;
                                ambientLightGreen.intensity = nintensity3;
                                ambientLight2Green.intensity = nintensity3;
                                ambientLightBlue.intensity = nintensity3;
                                ambientLight2Blue.intensity = nintensity3;

                                //scene.spotLight.intensity = (Math.random() * 5.0);
                                //scene2.spotLight2.intensity = (Math.random() * 5.0);
                            };
                            this.randomVis = function () {
                                fdensity = (Math.random() * .75);
                                scene.fog.density = fdensity;
                                scene2.fog.density = fdensity;

                                rintensity = (Math.random() * 0.6667);

                                spotLightRED.intensity = rintensity;
                                spotLightRED2.intensity = rintensity;
                                spotLightGREEN.intensity = rintensity;
                                spotLightGREEN2.intensity = rintensity;
                                spotLightBLUE.intensity = rintensity;
                                spotLightBLUE2.intensity = rintensity;

                            };
                        }
                        //source: This code no longer appears to contain anything that belongs to http://www.smartjava.org/ltjs/chapter-09/02-selecting-objects.html
                    shaderParams = {
                        binaryThreshold: true,
                    }

                    //source: This code no longer appears to contain anything that belongs to http://nuevil.com/index3.html
                    var gui = new dat.GUI({
                        resizable: false
                    });
                    gui.add(shaderParams, 'binaryThreshold').onChange(onToggleShaders);

                    gui.add(guivalues, 'cameraNear', 0, 25).onChange(function (e) {
                        camera.near = e;
                    });
                    gui.add(guivalues, 'cameraFar', 10, 25).onChange(function (e) {
                        camera.far = e;
                    });
                    var folder1 = gui.addFolder('visibility');
                    var fogDensity = folder1.add(scene2.fog, 'density').min(0.00).max(0.75).step(0.01).listen();
                    //var cameraNear = 

                    var lightIntensity = folder1.add(spotLightRED, 'intensity').min(0.00).max(2.0).step(0.01).listen();
                    var timeOfDay = folder1.add(guivalues, 'timeShift').min(-6.0).max(6.0).step(0.01).listen();
                    var folder2 = gui.addFolder('behavior');
                    var rotSpeed = folder2.add(camControls2, 'lookSpeed').min(0.0).max(0.5).step(0.01).listen();
                    var movSpeed = folder2.add(camControls2, 'movementSpeed').min(0.0).max(5.0).step(0.01).listen();
                    var folder3 = gui.addFolder('position');
                    var posX = folder3.add(camera2.position, 'x').min(-50.00).max(50.00).step(0.01).listen();
                    var posY = folder3.add(camera2.position, 'y').min(-50.00).max(50.00).step(0.01).listen();
                    var posZ = folder3.add(camera2.position, 'z').min(-50.00).max(50.00).step(0.01).listen();
                    var folder4 = gui.addFolder('rotation');
                    var rotY = folder4.add(camera.rotation, 'y').min(-1.58).max(1.58).step(0.01).listen();
                    var folder5 = gui.addFolder('confusion');
                    var rVis = gui.add(guivalues, 'randomVis');
                    var rPosHead = gui.add(guivalues, 'getLostBoth');
                    var rPosHeadComp = gui.add(guivalues, 'getLostComp');
                    var rPosHeadPract = gui.add(guivalues, 'getLostPract');
                    //source: This code no longer appears to contain anything that belongs to http://nuevil.com/index3.html

                    posX.onChange(function (value) {
                        camera2.position.x = value;
                        camera.position.x = value;
                    });
                    posY.onChange(function (value) {
                        camera2.position.y = value;
                        camera.position.y = value;
                    });
                    posZ.onChange(function (value) {
                        camera2.position.z = value;
                        camera.position.z = value;
                    });
                    rotY.onChange(function (value) {
                        camera2.rotation.y = value;
                        camera.rotation.y = value;
                    });
                    //source:http://nuevil.com/index3.html

                    //source: This code no longer appears to contain anything that belongs to Rudie Dirkx http://hotblocks.nl/tests/three/dat.gui.html 
                    fogDensity.onChange(function (value) {
                        scene2.fog.density = value;
                        scene.fog.density = value;
                    });
                    rotSpeed.onChange(function (value) {
                        camControls2.lookSpeed = value;
                        camControls.lookSpeed = value;
                    });
                    movSpeed.onChange(function (value) {
                        camControls2.movementSpeed = value;
                        camControls.movementSpeed = value;
                    });
                    lightIntensity.onChange(function (value) {
                        spotLightRED2.intensity = value;
                        spotLightRED.intensity = value;
                    });
                    timeOfDay.onChange(function (value) {
                        guivalues.timeShift = value;
                    });

                    // element is provided by the angular directive
                    element[0].appendChild(renderer.domElement);

                    window.addEventListener('resize', scope.onWindowResize, false);
                };



                // -----------------------------------
                // Event listeners
                // -----------------------------------
                scope.onWindowResize = function () {

                    scope.resizeCanvas();
                };

                // -----------------------------------
                // Updates
                // -----------------------------------
                scope.resizeCanvas = function () {

                    contW = (scope.fillcontainer) ?
                        element[0].clientWidth : scope.width;
                    contH = scope.height;

                    windowHalfX = contW / 2;
                    windowHalfY = contH / 2;

                    camera.aspect = contW / contH;
                    camera.updateProjectionMatrix();

                    renderer.setSize(contW, contH);

                };


                // -----------------------------------
                // Draw and Animate
                // -----------------------------------
                scope.animate = function () {

                    requestAnimationFrame(scope.animate);

                    scope.render();

                };

                scope.render = function () {

                    keyboard.update();
                    camControls.update(clock.getDelta()); //update First Person Camera
                    camControls2.update(clock.getDelta()); //update First Person Camera
                    camera2.position.copy(camera.position);
                    camera2.rotation.copy(camera.rotation);
                    //camera2.rotation.z = camera3.rotation.z;
                    camera2.up = new THREE.Vector3(-1, -1, -1);
                    camera2.rotateX(Math.PI / -2);
                    camera2.rotateZ((Math.PI / -2));
                    camera2.rotateZ(Math.PI / 2);

                    //camera3.position.x =-23.14;
                    //camera3.position.y = -2.2
                    //camera3.position.z = -21.74;

                    //camera.lookAt(camera3);
                    //camera2.lookAt(camera3);
                    //if (1==1){guivalues.lightDepthFix();}
                    var time = performance.now() * 0.001; //Measure time for water

                    //real time 24 hour day
                    //var timeSolar = performance.now() * 0.000000003472 + 32470000 + 3 * 3600000; //Measure time for sun
                    //rapid time for testing
                    timeSolar = performance.now() * 0.00000003472 * 36000; //Measure time for sun

                    water.material.uniforms.time.value += 1.0 / 60.0; //speed of water motion(wind chop)
                    water.render(); //render water surface
                    water2.material.uniforms.time.value += 1.0 / 60.0; //speed of water motion(wind chop)
                    water2.render(); //render water surface
                    caustic.material.uniforms.time.value += 1.0 / 30.0; //speed of water motion(wind chop)
                    caustic.render(); //render water surface
                    caustic2.material.uniforms.time.value += 1.0 / 30.0; //speed of water motion(wind chop)
                    caustic2.render(); //render water surface


                    //source:https://github.com/dirkk0/threejs_daynight/blob/master/index.html
                    var nsin = Math.abs(Math.sin(timeSolar));
                    var ncos = Math.cos(timeSolar);
                    // set the sun
                    spotLightRED.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightRED.lookAt(0, 0, 0);
                    //spotLightRED2.position.copy( spotLightRED );
                    spotLightRED2.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightRED2.lookAt(0, 0, 0);
                    //spotLightGREEN.position.copy( spotLightRED );
                    spotLightGREEN.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightGREEN.lookAt(0, 0, 0);
                    //spotLightGREEN2.position.copy( spotLightRED );
                    spotLightGREEN2.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightGREEN2.lookAt(0, 0, 0);
                    //spotLightBLUE.position.copy( spotLightRED );
                    spotLightBLUE.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightBLUE.lookAt(0, 0, 0);
                    //spotLightBLUE2.position.copy( spotLightRED );
                    spotLightBLUE2.position.set(-2000 * ncos, 2000 * nsin, 1500 * ncos + 1000);
                    spotLightBLUE2.lookAt(0, 0, 0);
                    //source:https://github.com/dirkk0/threejs_daynight/blob/master/index.html
                    //spotLightSUN.position.set( -1900*ncos, 1900*nsin, 1425*ncos+1000);
                    //spotLightSUN.lookAt ( spotLightRED.position );

                    var lightFix = new function () {
                        //this function uses a spectra specific implementation of the beer-lambert law to modify lighting intensity as a function of depth
                        //when combined with colored exponential fog, it is a reasonable approximation for the color specific light attenuation observed underwater 

                        this.lightDepthFix = function () {
                            intensity1 = .95;
                            intensity2 = .25;
                            intensity3 = .375;

                            depthcm = (camera2.position.y + (0.9)) * (-100.0); //meter to cm conversion
                            adjIntensity1RED = (intensity1 * (Math.exp(-.006 * depthcm))); //red spectra attenuation coefficient
                            adjIntensity1GREEN = (intensity1 * (Math.exp(-.00032 * depthcm))); //green spectra attenuation coefficient
                            adjIntensity1BLUE = (intensity1 * (Math.exp(-.000247 * depthcm))); //blue spectra attenuation coefficient

                            adjIntensity2RED = (intensity2 * (Math.exp(-.006 * depthcm)));
                            adjIntensity2GREEN = (intensity2 * (Math.exp(-.00032 * depthcm)));
                            adjIntensity2BLUE = (intensity2 * (Math.exp(-.000247 * depthcm)));

                            adjIntensity3RED = (intensity3 * (Math.exp(-.006 * depthcm)));
                            adjIntensity3GREEN = (intensity3 * (Math.exp(-.00032 * depthcm)));
                            adjIntensity3BLUE = (intensity3 * (Math.exp(-.000247 * depthcm)));


                            //artificial sun light set
                            spotLightRED.intensity = adjIntensity1RED;
                            spotLightRED2.intensity = adjIntensity1RED;
                            spotLightGREEN.intensity = adjIntensity1GREEN;
                            spotLightGREEN2.intensity = adjIntensity1GREEN;
                            spotLightBLUE.intensity = adjIntensity1BLUE;
                            spotLightBLUE2.intensity = adjIntensity1BLUE;

                            //hemisphere light set
                            lightRed.intensity = adjIntensity2RED;
                            light2Red.intensity = adjIntensity2RED;
                            lightGreen.intensity = adjIntensity2GREEN;
                            light2Green.intensity = adjIntensity2GREEN;
                            lightBlue.intensity = adjIntensity2BLUE;
                            light2Blue.intensity = adjIntensity2BLUE;

                            //ambient light set
                            ambientLightRed.intensity = adjIntensity3RED;
                            ambientLight2Red.intensity = adjIntensity3RED;
                            ambientLightGreen.intensity = adjIntensity3GREEN;
                            ambientLight2Green.intensity = adjIntensity3GREEN;
                            ambientLightBlue.intensity = adjIntensity3BLUE;
                            ambientLight2Blue.intensity = adjIntensity3BLUE;

                        };
                    }
                    if (keyboard.pressed("shift")) { //almost positive this is original code
                        camControls2.movementSpeed = 2.0; //note: it also doesn't work properly
                        camControls2.lookSpeed = 0.15; //note: it also doesn't work properly
                        camControls.movementSpeed = 2.0; //note: it also doesn't work properly
                        camControls.lookSpeed = 0.15; //note: it also doesn't work properly
                    }
                    if (keyboard.pressed("ctrl")) { //almost positive this is original code
                        camControls2.movementSpeed = 0.25; //note: it also doesn't work properly
                        camControls2.lookSpeed = 0.05; //note: it also doesn't work properly
                        camControls.movementSpeed = 0.25; //note: it also doesn't work properly
                        camControls.lookSpeed = 0.05; //note: it also doesn't work properly
                    }
                    if (keyboard.pressed("E")) { //almost positive this is original code
                        camera2.rotateY(Math.PI / -1); //original code
                        camera2.rotateZ((Math.PI) / -1); //original code
                    } //this line is probably safe :P
                    if (keyboard.pressed("3")) { //almost positive this is original code
                        scene.overrideMaterial = new THREE.MeshDepthMaterial();
                    }
                    if (keyboard.pressed("C")) { //almost positive this is original code
                        scene.overrideMaterial = null;
                    }
                    if (keyboard.pressed("J")) {
                        guivalues.getLostBoth();
                    }
                    if (keyboard.pressed("K")) {
                        guivalues.getLostComp();
                    }
                    if (keyboard.pressed("L")) {
                        guivalues.getLostPract();
                    }

                    if (keyboard.pressed("R")) {
                        guivalues.lookAtRedBuoy();
                    }
                    if (keyboard.pressed("Y")) {
                        guivalues.lookAtYellowBuoy();
                    }
                    if (keyboard.pressed("G")) {
                        guivalues.lookAtGreenBuoy();
                    }


                    if (keyboard.pressed("P")) {
                        lightFix.lightDepthFix();
                    }
                    if (keyboard.pressed("V")) {
                        //guivalues.lightDepthFix();
                        guivalues.randomVis();
                    }


                    lightFix.lightDepthFix();
                    //if ( true ) {
                    //guivalues.lightDepthFix();

                    //}
                    if (camera2.position.y > -0.80) { //cheap hack to bypass the fog entangling impact of using a single .obj/.mtl file above and below water
                        scene2.fog.density = 0.0;
                        scene.fog.density = 0.0;
                        guivalues.normalLight();
                    }
                    if (camera2.position.y < -0.81 && camera2.position.y > -.9) { //cheap hack to bypass the fog entangling impact of using a single .obj/.mtl file above and below water
                        scene2.fog.density = 0.1875;
                        scene.fog.density = 0.1875;
                        lightFix.lightDepthFix();
                    }

                    if (camera2.position.y < -5.5) { //cheap hack to bound behavior
                        camera2.position.y = -5.5;
                        camera.position.y = -5.5;
                    }
                    //              if ( camera2.position.y > 5.5 ) { //normal ceilling
                    if (camera2.position.y > -1.04) { //cheap hack to bound behavior
                        //camera2.position.y = 5.5; 
                        //camera.position.y = 5.5; 

                        camera2.position.y = -1.04;
                        camera.position.y = -1.04;
                    }


                    renderer.render(scene, camera); //render everything else
                    renderer2.render(scene2, camera2); //render everything else

                };

                scope.$watch('speed', function(newValue, oldValue) {
                    if (newValue) {
                        console.log('new speed ', newValue);
                        if (newValue < 0 ) {
                            camControls.moveForward = true;
                        }

                        if (newValue > 0 ) {
                            camControls.moveBackward = true;
                        }

                        if (newValue == 0 ) {
                            camControls.moveBackward = false;
                            camControls.moveForward = false;
                        }
                    }
                });


                scope.$watch('depth', function(newValue, oldValue) {
                    if (newValue) {
                        console.log('new depth ', newValue);
                        if (newValue < 0 ) {
                            camControls.moveDown = true;
                        }

                        if (newValue > 0 ) {
                            camControls.moveUp = true;
                        }

                        if (newValue == 0 ) {
                            camControls.moveUp = false;
                            camControls.moveDown = false;
                        }
                    }
                });

                scope.$watch('trim', function(newValue, oldValue) {
                    if (newValue) {
                        console.log('new trim ', newValue);
                        if (newValue < 0 ) {
                            camControls.moveLeft = true;
                        }

                        if (newValue > 0 ) {
                            camControls.moveRight = true;
                            //camera.translateZ(-40);
                        }

                        if (newValue == 0 ) {
                            camControls.moveLeft = false;
                            camControls.moveRight = false;
                        }
                    }
                });

                // Begin
                scope.init();
                scope.animate();

            }
        };
    });
