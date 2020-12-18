"use strict";

// * Initialize webGL and create a scene with camera and light
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setClearColor('rgb(255, 255, 255)');    // set background color

const scene = new THREE.Scene();
const fov = 45;
const aspect = canvas.width / canvas.height;
const near = 1;//0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(8,18,8);
camera.lookAt(scene.position);
const light = new THREE.PointLight();
light.position.copy(camera.position.clone());
scene.add( light );
scene.add(new THREE.AmbientLight(0x606060));

// * Place balls randomly within outerRadius from center of world
const nBalls = 10;
const outerRadius = 8;
const ballMinRadius = 0.5;
const ballMaxRadius = 1.5;
const balls = [];
const ballData = {
  ndcCoord: new THREE.Vector3(0,0,0),
  cameraCoord: new THREE.Vector3(0,0,0),
  worldSpaceCoord: new THREE.Vector3(0,0,0)
};
for(let k=1; k<=nBalls; ++k) {
  // random color
  const rdColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  // random radius
  const rdRadius = ballMinRadius + Math.random() * (ballMaxRadius - ballMinRadius);
  // random position
  const rd = () => 2*Math.random() - 1;  // just a helper function
  let rdPos;
  while(true) {
    rdPos = new THREE.Vector3(outerRadius*rd(), outerRadius*rd(), outerRadius*rd());
    if(rdPos.lengthSq() <= outerRadius*outerRadius) {
      break;
    }
  }

  // store all the balls within balls array
  const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(rdRadius, 32, 32), 
                              new THREE.MeshStandardMaterial( {color: rdColor,
                                                                metalness:0.6,
                                                                roughness:0.4}));
  ball.userData.radius = rdRadius;
  ball.position.copy(rdPos);
  scene.add(ball);
  balls.push(ball);
}

// locate ball on pick
const locateOnClick = (valueX, valueY, ball) => {
  // calculate position in camera space
  const ballPositions = ball.position.clone();
  
  //collect world space data of ball
  const worldPosition = ball.position.clone();
  worldPosition.applyMatrix4(ball.matrixWorld);
  ballData.worldSpaceCoord.copy(worldPosition);

  ballPositions.applyMatrix4(camera.matrixWorldInverse);
  //collect camera space data of ball
  ballData.cameraCoord.copy(ballPositions);

  ballPositions.applyMatrix4(camera.projectionMatrix);
  // collect NDC data of ball
  ballData.ndcCoord.copy(ballPositions);
  
  //screen position from NDC
  const x_s = (ballPositions.x + 1) * canvas.width/2;
  const y_s = (1 - ballPositions.y) * canvas.height/2;
  
  const distance = Math.pow(Math.pow((valueX - x_s), 2) + Math.pow((valueY - y_s), 2), 0.5)/(canvas.width/2);

  // if position clicked is located within balls radius
  const clickedSpace = 35*ball.userData.radius;
  const corespond = Math.pow((valueX - x_s), 2) + Math.pow((valueY - y_s), 2) <= Math.pow(clickedSpace, 2);
  if(corespond){
    console.log("distance between point on screen and ball centre: " + distance);
    return true;
  }else
  return false;
}

// * Implement picking functionality
canvas.addEventListener('mousedown', event => {
  // calculate viewport pixel position:
  const rect = canvas.getBoundingClientRect();
  const xvp = event.clientX - rect.left;
  const yvp = event.clientY - rect.top;

  // highlight ball if it has been picked
  balls.forEach(b => pickBall(xvp, yvp, b));
});

/**
 * Find out if a ball is picked with the mouse. It it is, set the emissive color
 * of the material equal to its color.
 *
 * @param {Number} xvp the viewport x-coordinate (pixel units)
 * @param {Number} yvp the viewport y-coordinate (pixel units)
 * @param {Object} ball a THREE.Mesh storing the ball and its radius as ball.userData.radius.
 */ 

  function pickBall(xvp, yvp, ball) {
  // viewport coordinates should be within the canvas
  console.assert(xvp>=0 && xvp<=canvas.width, 'xvp='+xvp);
  console.assert(yvp>=0 && yvp<=canvas.height, 'yvp='+yvp);

   // TODO: implement this function
  if(locateOnClick(xvp, yvp, ball)){
    ball.material.emissive = {r: ball.material.color.r, g: ball.material.color.g, b: ball.material.color.b};
    console.log("NDC: (" + ballData.ndcCoord.x + ", " + ballData.ndcCoord.y + ", " + ballData.ndcCoord.z) + " )";
    console.log("Camera Space: (" + ballData.cameraCoord.x + ", " + ballData.cameraCoord.y + ", " + ballData.cameraCoord.z + " )");
    console.log("World Space: (" + ballData.worldSpaceCoord.x + ", " + ballData.worldSpaceCoord.y + ", " + ballData.worldSpaceCoord.z + " )");
  }
}

// Dehighlight ball if mouse is released
canvas.addEventListener('mouseup', event => {

  // TODO: implement this function
  balls.forEach(b => b.material.emissive = {r: 0, g: 0, b: 0});
});

// * Render loop
const controls = new THREE.TrackballControls(camera, renderer.domElement);
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();
