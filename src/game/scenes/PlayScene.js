import { Scene } from 'phaser'
import { ball } from '../Cards/ball'
import { rotatePlatform } from '../Cards/rotatePlatform';
import  actionSequence  from '../Cards/actionSequence';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.platforms = [];
  }



  create () {
    this.add.image(400, 300, 'background');

    this.createCircles();

/*
    let rows = 4; // Number of rows
    let cols = 4; // Number of columns
    let spacingX = 300; // Horizontal spacing between platforms
    let spacingY =100; // Vertical spacing between platforms
    let startX = 0; // Starting X position
    let startY = 300; // Starting Y position


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate position for each platform
        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        // Create the platform sprite
        let platform = this.add.sprite(x, y, 'platform');

          platform.setDisplaySize(200, 50);
        
        this.matter.add.gameObject(platform, {
          shape: { type: 'rectangle', width:200, height: 50 }, 
          restitution: 0.8, 
        });

        platform.setIgnoreGravity(true);
        platform.setStatic(true);
        platform.setInteractive();
        this.input.setDraggable(platform);
        // Set a random starting angle (in radians)
        let randomAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        platform.setRotation(randomAngle);

        // Add the platform to the array
        this.platforms.push(platform);
      }
    }

    
    
    // this.myRotatingPlatforms = new rotatePlatform(this,this.platforms, 400, 300,true,true,null);

    // this.myThief = new ball(this, 400, 200, 'thief');

    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);

    */

    
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

      this.myActionSequence.reset();
      this.myActionSequence.runSequence();

    })

    


  }

  createCircles()
  {
    this.circleOne = this.add.sprite(150, 300, 'circleOne');
    this.circleOne.setScale(0.3);
    this.circleOne.setInteractive();
    this.circleTwo = this.add.sprite(400, 300, 'circleTwo');
    this.circleTwo.setScale(0.3);
    this.circleTwo.setInteractive();
    this.circleThree = this.add.sprite(650, 300, 'circleThree');
    this.circleThree.setScale(0.3);
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

   if(this.myActionSequence){console.log("we followed the sequence",this.myActionSequence.checkUserSequence());}

  }
}