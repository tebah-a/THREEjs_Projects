// Pong Game
// singlePlayer = true implies 1 player mode and if otherwise 2 player mode
  const singlePlayer = true;

  // single player mode 
  if(singlePlayer == true) {   

    // Initialize WebGL renderer ans set background color
    const canvas1 = document.getElementById("canvas1");
    const renderer1 = new THREE.WebGLRenderer({canvas:canvas1, antialias:true});
    renderer1.setClearColor('white');  

    // Create a new Three.js scene
    const scene = new THREE.Scene();

    // Add a camera
    const camera1 = new THREE.PerspectiveCamera( 75, canvas1.width / canvas1.height, 0.1, 500 );
    camera1.position.set(1.8, 1.8, 7);

    // playing field
    const game1 = new THREE.Object3D();
    const length = 8;
    const wallThickness = 0.1;
    const wallHeight = 0.4;
    const fieldMat = new THREE.MeshBasicMaterial({color: "green"});
    const edgesMat = new THREE.MeshBasicMaterial({color: "#006400"});
    const fieldGeo = createField(length);
    const fieldM = new THREE.Mesh(fieldGeo, fieldMat);
    game1.add(fieldM);

    // create walls
    const rightWall = new THREE.BoxBufferGeometry(length, wallHeight, wallThickness);
    const leftWall = rightWall.clone();
    const singlePlayerWall = new THREE.BoxBufferGeometry(length/2, wallHeight, wallThickness);

    const rwallObj = new THREE.Mesh(rightWall, edgesMat);
    const lwallObj = new THREE.Mesh(leftWall, edgesMat);
    const spwObj = new THREE.Mesh(singlePlayerWall, edgesMat);

    rwallObj.position.x = wallThickness/2 + length/2;
    lwallObj.position.x = -wallThickness/2;
    spwObj.position.z = -wallThickness/2 - length/2;
    spwObj.position.x = length/4;
    rwallObj.rotation.y = Math.PI/2;
    lwallObj.rotation.y = -Math.PI/2;
    game1.add(rwallObj);
    game1.add(lwallObj);
    game1.add(spwObj);

    // draw white line on field
    const lineMat = new THREE.LineBasicMaterial( { color: '#FFFAFA' } );
    const points = [];
    points.push( new THREE.Vector3(0, 0, 0) );
    points.push( new THREE.Vector3(length/2, 0, 0));
    const lineGeo = new THREE.BufferGeometry().setFromPoints( points );
    const whiteLine = new THREE.Line(lineGeo, lineMat);
    game1.add(whiteLine);

    // create player
    const playerLength = length/10;
    const playerGeo = new THREE.BoxBufferGeometry(playerLength, wallHeight, wallThickness);
    const playerMat = new THREE.MeshBasicMaterial({color: "red"});
    const player1 = new THREE.Mesh(playerGeo, playerMat);
    game1.add(player1);
    player1.position.z = length/2;
    player1.position.x = length/4;

    scene.add(game1);

    // player movements 
    function myCallback(event){
      if(event.keyCode==39) {   
        player1.position.x += 0.3;
      }
      if(event.keyCode==37) {  
        player1.position.x -= 0.3;
      }
    }
    document.addEventListener("keydown", myCallback);

    // create ball 
    const ballRadius = 0.2;
    const ballGeo = new THREE.SphereBufferGeometry( ballRadius, 32, 32 );
    const ballMat = new THREE.MeshBasicMaterial( {color: 'yellow'} );
    const ball = new THREE.Mesh(ballGeo, ballMat);
    game1.add(ball);
    ball.position.y = ballRadius/2 + 0.07;
    ball.position.x = length/4;

    const speed = new THREE.Vector3(-1 + 2*Math.random(), 0, 2.5);

    // Render the scene
    const clock = new THREE.Clock();
    function render() {
      requestAnimationFrame(render);

      const h = clock.getDelta();
      ball.position.add(speed.clone().multiplyScalar(h));
      const leftPlayer1Dist = player1.position.x - playerLength/2;
      const rightPlayer1Dist = leftPlayer1Dist + playerLength;

      // bouncing off player 
      if((ball.position.x + ballRadius <= rightPlayer1Dist) && (ball.position.z + ballRadius >= player1.position.z)
        && (ball.position.x + ballRadius >= leftPlayer1Dist)){
        speed.z = -speed.z;
      } 

      // ball should bounce off walls, legthewise
      if(ball.position.x + ballRadius >= length/2 || ball.position.x - ballRadius < 0){
        speed.x = -speed.x;
      }

      //ball should bounce off the wall without player
      if(ball.position.z - ballRadius <= -length/2){
        speed.z = -speed.z;
      }

      // ball out of bound 
      if(ball.position.z >= 0.5 + length/2){
        alert('Game Over!');
      }

      renderer1.render(scene, camera1);
    }
    render(); 
  } 

  // double player mode 
  if(singlePlayer == false) {   

    // Initialize WebGL renderer and set background color
    const canvas1 = document.getElementById("canvas1");
    const canvas2 = document.getElementById("canvas2");
    const renderer1 = new THREE.WebGLRenderer({canvas:canvas1, antialias:true});
    const renderer2 = new THREE.WebGLRenderer({canvas:canvas2, antialias:true});
    renderer1.setClearColor('white');  
    renderer2.setClearColor('white'); 

    // Create a new Three.js scene
    const scene = new THREE.Scene();

    // Add a camera
    const camera1 = new THREE.PerspectiveCamera( 75, canvas1.width / canvas1.height, 0.1, 500 );
    const camera2 = new THREE.PerspectiveCamera( 75, canvas2.width / canvas2.height, 0.1, 500 );
    camera1.position.set(1.8, 1.8, 7);
    camera2.position.set(1.8, 1.8, -7);
    camera2.rotation.y = Math.PI;

    // playing field
    const game1 = new THREE.Object3D();
    const length = 8;
    const wallThickness = 0.1;
    const wallHeight = 0.4;
    const fieldMat = new THREE.MeshBasicMaterial({color: "green"});
    const edgesMat = new THREE.MeshBasicMaterial({color: "#006400"});
    const fieldGeo = createField(length);
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    game1.add(field);

    // create walls
    const rightWall = new THREE.BoxBufferGeometry(length, wallHeight, wallThickness);
    const leftWall = rightWall.clone();
    const singlePlayerWall = new THREE.BoxBufferGeometry(length/2, wallHeight, wallThickness);

    const rwallObj = new THREE.Mesh(rightWall, edgesMat);
    const lwallObj = new THREE.Mesh(leftWall, edgesMat);
    const spwObj = new THREE.Mesh(singlePlayerWall, edgesMat);

    rwallObj.position.x = wallThickness/2 + length/2;
    lwallObj.position.x = -wallThickness/2;
    rwallObj.rotation.y = Math.PI/2;
    lwallObj.rotation.y = -Math.PI/2;
    game1.add(rwallObj);
    game1.add(lwallObj);

    // draw white line on field
    const lineMat = new THREE.LineBasicMaterial( { color: '#FFFAFA' } );
    const points = [];
    points.push( new THREE.Vector3(0, 0, 0) );
    points.push( new THREE.Vector3(length/2, 0, 0));
    const lineGeo = new THREE.BufferGeometry().setFromPoints( points );
    const whiteLine = new THREE.Line(lineGeo, lineMat);
    game1.add(whiteLine);

    // create player
    const playerLength = length/10;
    const playerGeo = new THREE.BoxBufferGeometry(playerLength, wallHeight, wallThickness);
    const player1Mat = new THREE.MeshBasicMaterial({color: "red"});
    const player2Mat = new THREE.MeshBasicMaterial({color: "blue"});
    const player1 = new THREE.Mesh(playerGeo, player1Mat);
    const player2 = new THREE.Mesh(playerGeo, player2Mat);
    game1.add(player1);
    game1.add(player2);
    player1.position.z = length/2;
    player1.position.x = length/4;
    player2.position.z = -length/2;
    player2.position.x = length/4;

    // projection of game on scene
    scene.add(game1);

    // player movements 
    function myCallback(event){
      event.preventDefault();
      if(event.keyCode==68) {   
        player1.position.x += 0.3;
      }
      if(event.keyCode==65) {   
        player1.position.x -= 0.3;
      }
      if(event.keyCode==37) {   
        player2.position.x += 0.3;
      }
      if(event.keyCode==39) {   
        player2.position.x -= 0.3;
      }
    }
    document.addEventListener("keydown", myCallback);

    // create ball 
    const ballRadius = 0.2;
    const ballGeo = new THREE.SphereBufferGeometry( ballRadius, 32, 32 );
    const ballMat = new THREE.MeshBasicMaterial( {color: 'yellow'} );
    const ball = new THREE.Mesh(ballGeo, ballMat);
    game1.add(ball);
    ball.position.y = ballRadius/2 + 0.07;
    ball.position.x = length/4;

    // speed of ball
    const speed = new THREE.Vector3(-1 + 2*Math.random(), 0, 2.5);

    // Render the scene
    const clock = new THREE.Clock();
    function render() {
      requestAnimationFrame(render);

      const h = clock.getDelta();
      ball.position.add(speed.clone().multiplyScalar(h));
      
      const leftPlayer1Dist = player1.position.x - playerLength/2;
      const rightPlayer1Dist = leftPlayer1Dist + playerLength;
      const leftPlayer2Dist = player2.position.x - playerLength/2;
      const rightPlayer2Dist = leftPlayer2Dist + playerLength;

      // bouncing off player 1, red
     if((ball.position.x + ballRadius <= rightPlayer1Dist) && (ball.position.z + ballRadius >= player1.position.z)
        && (ball.position.x + ballRadius >= leftPlayer1Dist)){
       speed.z = -speed.z;
      } 
     // bouncing off player 2, blue
     if((ball.position.x + ballRadius <= rightPlayer2Dist) && (ball.position.z - ballRadius <= player2.position.z)
        && (ball.position.x + ballRadius >= leftPlayer2Dist)){
        speed.z = -speed.z;
      } 

      // ball should bounce off walls, legthewise
     if(ball.position.x + ballRadius >= length/2 || ball.position.x - ballRadius < 0){
        speed.x = -speed.x;
      }

      // ball out of bounds on BLUEs side
      if(ball.position.z <= -0.4 - length/2){
        alert('Game Over! \n RED wins');
      }
      // ball out of bounds on REDs side 
      if(ball.position.z >= 0.4 + length/2){
        alert('Game Over! \n BLUE wins');
      }
    
      renderer1.render(scene, camera1);
      renderer2.render(scene, camera2);
    }
    render();
  }

// create plain field 
function createField(length, height) {
  const width = length/2;
  const geo = new THREE.Geometry();
  geo.vertices[0] = new THREE.Vector3(0, 0, length/2);
  geo.vertices[1] = new THREE.Vector3(width, 0, length/2);
  geo.vertices[2] = new THREE.Vector3(width, 0, -length/2);
  geo.vertices[3] = new THREE.Vector3(0, 0, -length/2);

  geo.faces.push(new THREE.Face3(0,1,2));
  geo.faces.push(new THREE.Face3(0,2,3));

  return geo;
}
