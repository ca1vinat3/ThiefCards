import { Scene } from 'phaser'
import { ball } from '../Cards/ball'
import { rotatePlatform } from '../Cards/rotatePlatform';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }

  create () {
    this.add.image(400, 300, 'background');
  
    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
  
    this.myThief = new ball(this, 400, 200, 'bomb');

    this.myRotatingPlatforms = new rotatePlatform(this, 400, 300,true);

    this.myRotatingPlatformss = new rotatePlatform(this, 400, 300,false,400,300,150);

    this.myRotatingPlatformsss = new rotatePlatform(this, 400, 100,false,400,300,250);

  }



  update () {

    this.myRotatingPlatforms.updatePlatform();
    this.myRotatingPlatformss.updatePlatform();
    this.myRotatingPlatformsss.updatePlatform();
  }
}