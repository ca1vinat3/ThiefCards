import { Scene } from 'phaser'
import { ball } from '../Cards/ball'
import { rotatePlatform } from '../Cards/rotatePlatform';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.platforms = [];
  }



  create () {
   // this.add.image(400, 300, 'background');
   this.ball = this.add.image(400, 300, 'thief');

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

    
    
    this.myRotatingPlatforms = new rotatePlatform(this,this.platforms, 400, 300,true,true,null);

    this.myThief = new ball(this, 400, 200, this.ball, false);

    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
  


  

   

  }



  update () {

 
  }
}