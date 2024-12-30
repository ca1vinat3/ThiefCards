 
  export class ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture)

      this.scene = scene;
      this.x = x;
      this.y = y;  
      this.createBall(scene);
    

    }

    createBall(scene) {

    const thief = this.scene.add.sprite(this.x, this.y, 'thief');
    thief.setScale(0.3);

    this.scene.matter.add.gameObject(thief, {
      shape: { type: 'circle', radius: 25 }, 
      restitution: 0.8, 
    });

    thief.setVelocity(50, 20)



    }


  }