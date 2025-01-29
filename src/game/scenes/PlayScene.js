import { Scene } from 'phaser'
import { ball } from '../Cards/ball'
import { rotatePlatform } from '../Cards/rotatePlatform';
import  actionSequence  from '../Cards/actionSequence';
import JoyStick from '../Cards/joyStick';
import spawnObject from '../Cards/spawnObject';
import { sRGBEncoding } from 'three';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.platforms = [];
    this.platforms2 = [];
    this.spawn = false;
    this.enemies = [];
    this.bullets = [];
  }



  create () {
    this.add.image(400, 300, 'background');
    
    this.createCircles();


    let rows = 2; // Number of rows
    let cols = 2; // Number of columns
    let spacingX = 50; // Horizontal spacing between platforms
    let spacingY =50; // Vertical spacing between platforms
    let startX = 200; // Starting X position
    let startY = 200; // Starting Y position


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate position for each platform
        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        // Create the platform sprite
        let platform = this.add.sprite(x, y, 'platform');

          platform.setDisplaySize(50, 50);
        
        this.matter.add.gameObject(platform, {
          shape: { type: 'rectangle', width:50, height: 50 }, 
          restitution: 0.8, 
        });

        platform.setIgnoreGravity(true);
        platform.setStatic(true);
        platform.setInteractive();
        this.input.setDraggable(platform);
        // Set a random starting angle (in radians)
        let randomAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        platform.setRotation(randomAngle);


        //second stuff
        let platform2 = this.add.sprite(x, y, 'platform');

        platform2.setDisplaySize(50, 50);
      
      this.matter.add.gameObject(platform2, {
        shape: { type: 'rectangle', width:50, height: 50 }, 
        restitution: 0.8, 
      });

      platform2.setIgnoreGravity(true);
      platform2.setStatic(true);
      platform2.setInteractive();
      this.input.setDraggable(platform2);
      // Set a random starting angle (in radians)
      let randomAngle2 = Phaser.Math.FloatBetween(0, Math.PI * 2);
      platform2.setRotation(randomAngle2);

        // Add the platform to the array
        this.platforms.push(platform);
        this.platforms2.push(platform2);
      }
    }

    
    
    // this.myRotatingPlatforms = new rotatePlatform(this,this.platforms, 400, 300,true,true,null);

    // this.myThief = new ball(this, 400, 200, 'thief');

   // this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);

    
    //spawn object

    

    this.mySpawnedEnemy = new spawnObject(this, this.circleOne, this.platforms, 5, false ,0.5, this.circleThree,"enemy","fromAround");

    setTimeout(() => {

      this.mySpawnedObject = new spawnObject(this, this.circleThree, this.platforms2, 5, true ,1, this.mySpawnedEnemy,"bullet");
      this.spawn = true;
    }, 1500);

  
    //  joystick 


    setInterval(() => {
      console.log(this.mySpawnedEnemy.closeEnemy);
    }, 1000);

    this.myJoystick = new JoyStick(this,400,300,100,this.circleThree);
    

    // action sequence

    this.myActionSequence =  new actionSequence({
      scene: this,
      functions: [this.action1, this.action2, this.action3],
      sequence: "random",
      timeBased: true,
      strictLinear: false,
      delay: 1500,
    });
    
    // Start sequence when pressing space keyboard

    this.input.keyboard.on('keydown-SPACE', () => {

      // this.myActionSequence.reset();
      // this.myActionSequence.runSequence();
      if(this.spawn){
      this.mySpawnedObject.spawn();
      }

    })

    setInterval(() => {
      this.mySpawnedEnemy.spawn();
      //console.log(this.bullets);
    }, 500);

    


  }

  createCircles()
  {
    this.circleOne = this.add.sprite(150, 300, 'circleOne').setAlpha(0);
    this.circleOne.setScale(0.1);
    this.circleOne.setInteractive();
    this.bullets.push(this.circleOne);
    this.bullets.push(this.circleOne);
    this.bullets.push(this.circleOne);
    this.bullets.push(this.circleOne);
    this.bullets.push(this.circleOne);
    this.circleTwo = this.add.sprite(400, 300, 'circleTwo').setAlpha(0);
    this.circleTwo.setScale(0.1);
    this.circleTwo.setInteractive();
    this.enemies.push(this.circleTwo);
    this.enemies.push(this.circleTwo);
    this.circleThree = this.add.sprite(650, 300, 'circleThree');
    this.circleThree.setScale(0.1);
    this.circleThree.setInteractive();

    this.circleOne.on('pointerdown', () => {

    

      this.myActionSequence.userRun(0);

    });

    this.circleTwo.on('pointerdown', () => {

    

      this.myActionSequence.userRun(1);
    });

    this.circleThree.on('pointerdown', () => {

  

    this.myActionSequence.userRun(2);

    });
  }

   action1(myscene) {

    myscene.tweens.add({
      targets: myscene.circleOne,
      alpha:0,
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      repeat:0
    });

    console.log("Action 1 executed!");
    
  }

   action2(myscene) {

    myscene.tweens.add({
      targets: myscene.circleTwo,
      alpha:0,
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      repeat:0
    });

    console.log("Action 2 executed!");
  }
  
   action3(myscene) {
   
    myscene.tweens.add({
      targets: myscene.circleThree,
      alpha:0,
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      repeat:0
    });

    console.log("Action 3 executed!");
  }



  update () {

   //if(this.myActionSequence){console.log("we followed the sequence",this.myActionSequence.checkUserSequence());}

   this.myJoystick.update();

  }
}