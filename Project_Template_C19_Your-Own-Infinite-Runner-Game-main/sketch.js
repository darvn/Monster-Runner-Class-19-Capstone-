var cave, caveImg
var monster, monsterImg
var boy, boyImg
var invisibleGround, invisibleBarrier;
var score = 0
var gameState = "play";
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstaclesGroup;
var jumpSound, collisionSound, coinSound, dieSound, restartSound;
var coinImg, coinsGroup
var coin_reacher, coin_reachersGroup;
var money = 0
var gameoverImg, restartImg, gameover, restart;


function preload(){
    caveImg = loadImage("cave.jpg");
    monsterImg = loadImage("monster.png");
    boyImg = loadImage("boy.png");
    obstacle1 = loadImage("obstacle1.png")
    obstacle2 = loadImage("obstacle3.png")
    obstacle3 = loadImage("obstacle4.png");
    obstacle4 = loadImage("obstacle5.png");
    jumpSound = loadSound("jumpSound.wav");
    collisionSound = loadSound("collisionSound.wav");
    coinImg = loadImage("coin.png");
    coinSound = loadSound("coinSound.wav");
    dieSound = loadSound("die.mp3");
    gameoverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    restartSound = loadSound("restartSound.mp3");



}

function setup() {
    createCanvas(750, 600);
    cave = createSprite(300, 300)
    cave.addImage(caveImg);
    cave.scale = 2;
    cave.velocityX = -(6 + 1*score/100);

    monster = createSprite(-70, 480);
    monster.addImage(monsterImg)
    monster.scale = 0.25
    //monster.debug = true;
    monster.setCollider('circle', 0, -120, 900)

    boy = createSprite(200, 480);
    boy.addImage(boyImg);
    boy.scale = 0.13
  //  boy.debug = true
    boy.setCollider('circle', 0, 95, 350)

    gameover = createSprite(375, 50)
    gameover.addImage(gameoverImg);

    restart = createSprite(375, 125);
    restart.addImage(restartImg);
    restart.scale = 0.5
    
    invisibleGround = createSprite(375, 580, 1000, 5);
    invisibleGround.visible = false;
    invisibleBarrier = createSprite(760, 300, 5, 700);
    invisibleBarrier.visible = false;

    obstaclesGroup = new Group();
    bigObstaclesGroup = new Group();
    coinsGroup = new Group();
    coin_reachersGroup = new Group();

    
    
}

function draw() {
    background(0)
    textSize(20);
    fill("white")
    text("Score: "+ score,50,50);
    textSize(20);
    fill("white")
    text("Money: "+ money, 50, 70);

    
    if(gameState === "play"){
      score = score + Math.round(getFrameRate()/50);
      
      if(boy.collide(coinsGroup)){
        coinsGroup.destroyEach();
        money = money + 5;
        coinSound.play();
      }

      if (cave.x < 150){
        cave.x = cave.width/2
      }

      if(keyDown("UP_ARROW") && boy.y  >= height -100 || keyDown("space") && boy.y  >= height -100){
        boy.velocityY = -18;
        jumpSound.play();
      }

      if(keyDown("LEFT_ARROW")){
        boy.x = boy.x - 10;
      }

      if(keyDown("RIGHT_ARROW")){
        boy.x = boy.x + 10;
      }

      if(boy.collide(coin_reachersGroup)){
        boy.velocityY = -18;
        boy.velocityX = 0;
        jumpSound.play();
      }
      
      if(boy.isTouching(monster) || boy.isTouching(obstaclesGroup)){
        gameState = "end";
        collisionSound.play();
        monster.x = boy.x;
        monster.y = boy.y - 300;
        boy.destroy();
      }

      gameover.visible = false;
      restart.visible = false;
      spawnObstacles();
    }
    
    if (gameState == "end"){
      obstaclesGroup.setVelocityXEach(0);
      obstaclesGroup.lifetime = -1;
      
      coinsGroup.lifetime = -1;
      coinsGroup.destroyEach();
      
      coin_reachersGroup.lifetime = -1;
      coin_reachersGroup.destroyEach();
      
      cave.velocityX = 0
      
      gameover.visible = true;
      restart.visible = true;

      if(mousePressedOver(restart)){
        reset();
      }
    }
    

  

  monster.velocityY = monster.velocityY + 3;
  boy.velocityY = boy.velocityY + 0.8;
  monster.collide(invisibleGround);
  boy.collide(invisibleGround);
  boy.collide(coin_reachersGroup)
  boy.collide(invisibleBarrier)

  if(monster.isTouching(obstaclesGroup)){
    obstaclesGroup.destroyEach();
    collisionSound.play();
  }
     
  
    drawSprites();
}

function spawnObstacles(){
  
  

  if(monster.isTouching(coin_reachersGroup) || monster.isTouching(coinsGroup)){
    coinsGroup.destroyEach();
    coin_reachersGroup.destroyEach();
    collisionSound.play();
  }

  if(frameCount % 100 === 0) {
     var obstacle = createSprite(750,530, 70, 70);

    obstacle.setCollider('circle',0,0,300)
    //obstacle.debug = true
  
    obstacle.velocityX = -(6 + 1*score/100);
    
    
    var rand = Math.round(random(1,3));
     switch(rand) {
       
       case 1: obstacle.addImage(obstacle2);
               break;
       case 2: obstacle.addImage(obstacle3);
               break;
       case 3: obstacle.addImage(obstacle1);
               break;
             
       default: break;
     }
     obstaclesGroup.add(obstacle);
     obstacle.scale = 0.3;
     obstacle.lifetime = 380;
     obstacle.depth = boy.depth;
     boy.depth +=1;
     obstacle.depth = monster.depth;
     monster.depth +=1;
  }

  if (frameCount % 350 === 0){
    var coin = createSprite(800, 100);
    coin.velocityX = -5
    coin.addImage(coinImg);
    coin.scale = 0.1
    coin.lifetime = 380
    coinsGroup.add(coin);


    coin_reacher = createSprite(800, 400, 50, 5);
    coin_reacher.velocityX = -6;
    coin_reacher.lifetime = 380;
    coin_reachersGroup.add(coin_reacher)


  }
}

function reset(){
  gameState = "play";

  restartSound.play();
 
  gameover.visible = false;
  restart.visible = false;
 
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  coin_reachersGroup.destroyEach();
  
  score = 0;
 
  monster.x = -70;
  monster.y = 480;

  boy = createSprite(200, 480);
  boy.addImage(boyImg);
  boy.scale = 0.13
 // boy.debug = true
  boy.setCollider('circle', 0, 95, 350)
  
  cave.velocityX = -(6 + 1*score/100);
}