var PLAY = 1;
var END = 0;
var gameState = PLAY;
var reset,imgReset
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameOver,imgGameOver
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var die,checkpoint
var score;
var jump

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  imgReset = loadImage("restart.png");
  imgGameOver =loadImage ("gameOver.png");

  die = loadSound('die.mp3')
   jump = loadSound('jump.mp3')
    

  checkpoint = loadSound ("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider('circle',0,0,40)

 // trex.debug=true
  
  ground = createSprite(width/2,height - 20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height - 10,width,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  reset = createSprite(width/2,height/2 ,40,40);
  reset.addImage (imgReset);
  reset.scale = 0.5;
  reset.visible = false

  gameOver = createSprite(width/2,height/2+50,40,40);
  gameOver.addImage(imgGameOver)
  gameOver.scale = 0.5
  gameOver.visible = false
  score = 0;

}

function draw() {
  background(240);
  text("Score: "+ score, 500,50);
  score = score + Math.round(getFrameRate()/60);
  if(score > 0 && score % 100 === 0){
   checkpoint.play()
  }  
  if(gameState === PLAY){
    //mover o solo
    ground.velocityX = -(4+3*score/500);


    if(keyDown("space")&& trex.y > height-60||(touches.length> 0 &&trex.y>height-60)) {
      trex.velocityY = -13;
      jump.play();
      touches = []
    } 

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    trex.velocityY = trex.velocityY + 0.8
     
   //gere as nuvens
  spawnClouds();
  
   //gere obstáculos no solo
   spawnObstacles();
  
   if(obstaclesGroup.isTouching(trex)){
     gameState=END
     die.play()
   }

   
  }
  else if(gameState === END){
    //parar o solo
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloud.velocityX = 0;
    cloudsGroup.setVelocityXEach(0)
    trex.velocityY = 0
    trex.changeAnimation('collided');
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1 )
    reset.visible = true;
    gameOver.visible =true;

    if(mousePressedOver(reset)|| touches.length>0){
      
      resetar();
    touches=[]
    }


  }
  
  trex.collide(invisibleGround);
 
  drawSprites();
}
 function resetar(){
  gameState = PLAY;
  gameOver.visible = false;
  reset.visible = false;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation('running')
  score = 0
 }

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-30,10,40);
   obstacle.velocityX = -(6+ score /100);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height,40,10);
    cloud.y = Math.round(random(height,height/2-300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = 800;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}