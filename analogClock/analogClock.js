// Assignment 2
//The front face is German time and when flipped over its Cameroon time.

//import * as THREE from "../moduleLibs/build/three.module.js";
// Initialize WebGL renderer
const canvas1 = document.getElementById("canvas1");
const renderer1 = new THREE.WebGLRenderer({canvas:canvas1, antialias:true});
renderer1.setClearColor('black');  // background color

// Create a new Three.js scene
const scene = new THREE.Scene();

// Add a camera
const camera1 = new THREE.PerspectiveCamera( 75, canvas1.width / canvas1.height, 0.1, 500 );
camera1.position.set(1,2,5);

// Add a mouse controller to move the camera
const controls = new THREE.TrackballControls(camera1, canvas1);
controls.rotateSpeed = 2;

//time frames 
const germanTime = new THREE.Object3D();
const cameroonTime = new THREE.Object3D();

// clock frame
const ring = {
  radius: 2,  
  height: 0.3,
  thickness: 0.1
};

const points = new Array(5);
points[0] = new THREE.Vector2(ring.radius, 0);
points[1] = new THREE.Vector2(ring.radius, ring.height);
points[2] = new THREE.Vector2(ring.radius+ring.thickness, ring.height);
points[3] = new THREE.Vector2(ring.radius+ring.thickness, 0);
points[4] = new THREE.Vector2(ring.radius,0);

const frameGeo = new THREE.LatheGeometry( points, 500);
frameGeo.computeFlatVertexNormals();
const mat = new THREE.MeshBasicMaterial({color: "#40E0D0"});
const clockFrame = new THREE.Mesh(frameGeo, mat);
scene.add(clockFrame);
clockFrame.rotation.x = Math.PI/2;

// rotation of an object by an angle
function rotate(object, angle) {
  const div = 180/angle;
  const rotationAngle = -Math.PI/div;
  const eulers = new THREE.Euler(0,0,rotationAngle,"ZXY");
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationFromEuler(eulers);
  object.applyMatrix4(rotationMatrix);
}

//clock hand maker
function clockHand(farbe, thickness, scale, thinness) {
  const geo = new THREE.SphereGeometry((ring.radius-thickness)/scale, 32, 32 );
  const mat = new THREE.MeshBasicMaterial( {color: farbe} );
  const object = new THREE.Mesh( geo, mat );
  object.scale.x = ring.radius/thinness;
  object.scale.z = ring.radius/thinness;

  return object;
}

//clock ticks maker
function numberLocation(thickness, size, scaleLength, farbe){
  const geo = new THREE.BoxBufferGeometry(thickness+scaleLength, thickness/size, thickness/9);
  const mat = new THREE.MeshBasicMaterial({color: farbe});
  const ticks = new THREE.Mesh(geo, mat); 
  ticks.rotation.z = Math.PI/2;

  return ticks;
}

//clock center point
const centerGeo = new THREE.CircleBufferGeometry( ring.radius/15, 32 );
const centerMat = new THREE.MeshBasicMaterial( { color: '#8B0000' } );
const center = new THREE.Mesh(centerGeo, centerMat);
germanTime.add(center);
const cameroonCenter = center.clone();
cameroonTime.add(cameroonCenter);
center.position.z = ring.height/10;
cameroonCenter.position.z = 0.07;

//clock front face
const frontFaceGeo = new THREE.CircleBufferGeometry( ring.radius, 32 );
const frontFaceMat = new THREE.MeshBasicMaterial( { color: '#FFFAFA' } );
const frontFace = new THREE.Mesh(frontFaceGeo, frontFaceMat);
germanTime.add(frontFace);
cameroonTime.add(frontFace.clone());

//axes on which the clock hands can rotate with
const germanSecondsSpace = new THREE.Object3D();
const germanMinutesSpace = new THREE.Object3D();
const germanHoursSpace = new THREE.Object3D();

const cameroonSecondsSpace = new THREE.Object3D();
const cameroonMinutessSpace = new THREE.Object3D();
const cameroonHoursSpace = new THREE.Object3D();

//hour hand
const handColor = '#004d66';
const hourHand = clockHand(handColor, ring.thickness, 4, 25);
hourHand.position.y = (ring.radius/4);
germanHoursSpace.add(hourHand);
germanTime.add(germanHoursSpace);
const cameroonHourHand = hourHand.clone();
cameroonHoursSpace.add(cameroonHourHand);
cameroonTime.add(cameroonHoursSpace);

//minute hand
const minuteHand = clockHand(handColor, ring.thickness, 2.2, 25);
minuteHand.position.y = (ring.radius/2.2);
germanMinutesSpace.add(minuteHand);
germanTime.add(germanMinutesSpace);
const cameroonMinuteHand = minuteHand.clone();
cameroonMinutessSpace.add(cameroonMinuteHand);
cameroonTime.add(cameroonMinutessSpace);

//senconds hand 
const secondHand = clockHand('black', ring.thickness, 2.2, 65);
secondHand.position.y = (ring.radius/2.2);
germanSecondsSpace.add(secondHand);
germanTime.add(germanSecondsSpace);
const cameroonSecondHand = secondHand.clone();
cameroonSecondsSpace.add(cameroonSecondHand);
cameroonTime.add(cameroonSecondsSpace);

// midDay tick with special color
const midDay = numberLocation(0.2, 2, 0.16, '#40E0D0');
midDay.position.y = ring.radius - (ring.thickness+0.16)/1.4;
const cameroonMidDay = midDay.clone();
germanTime.add(midDay);
cameroonTime.add(cameroonMidDay);

//the 30deg and 6deg interval ticks respectively
const farbe = 'black';
const boldLines = numberLocation(0.2, 2, 0.16, farbe);
boldLines.position.y = ring.radius - (ring.thickness+0.16)/1.4;

const thinLines = numberLocation(0.2, 9, 0.03, farbe);
thinLines.position.y = ring.radius - (ring.thickness+0.03)/1.1;

//place ticks around clock
let angle = 0;
let miniAngle = 0;
for(let i = 0; i < 12; i++){
  miniAngle = angle;
  angle += 30; 
  for(c = 0; c < 4; c++){
    let miniPositions = thinLines.clone();
    miniAngle += 6;
    rotate(miniPositions, miniAngle);
    germanTime.add(miniPositions); 
    cameroonTime.add(miniPositions.clone());
  }
  if(angle > 354) break;
  let numberPositions = boldLines.clone();
  rotate(numberPositions, angle);
  germanTime.add(numberPositions); 
  cameroonTime.add(numberPositions.clone());
}

//add to scenes
germanTime.position.z = ring.height - 0.08;
cameroonTime.rotation.y = Math.PI;
cameroonTime.position.z = 0.08;
scene.add(germanTime);
scene.add(cameroonTime);

// Render the scene
function render() {
  requestAnimationFrame(render);

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    //time in Deutschland 
    germanSecondsSpace.rotation.z = -(seconds * Math.PI/30);
    germanMinutesSpace.rotation.z = -((minutes * Math.PI/30) + (seconds * Math.PI/30)/60);
    germanHoursSpace.rotation.z = -(hours * 2 * Math.PI/12 + ((minutes * Math.PI/30)/12));
    
    //time in Cameroon, an hour behind 
    const hourDifference = 1;
    cameroonSecondsSpace.rotation.z = -(seconds * Math.PI/30);
    cameroonMinutessSpace.rotation.z = -((minutes * Math.PI/30) + (seconds * Math.PI/30)/60);
    cameroonHoursSpace.rotation.z = -((hours - hourDifference) * 2 * Math.PI/12 + ((minutes * Math.PI/30)/12));
    
  controls.update();
  renderer1.render(scene, camera1);
}
render();
