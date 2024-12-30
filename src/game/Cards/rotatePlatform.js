
export class rotatePlatform {
  constructor(scene, x, y, self ,pointx,pointy,radius,texture) {

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.self = self;
    this.pointX = pointx;
    this.pointY = pointy;
    this.radius = radius
    this.localRotate = false;
    this.holdRigth = false;
    this.holdLeft = false;
    this.angle = 3;  
    this.createPlatforms(scene);
    this.createEventHandlers(scene);
  

  }

  createPlatforms(scene) {

  this.platform = this.scene.add.sprite(this.x, this.y, 'platform');


  this.scene.matter.add.gameObject(this.platform, {
    shape: { type: 'rectangle', width:200, height: 50 }, 
    restitution: 0.8, 
  });

  this.platform.setIgnoreGravity(true);
  this.platform.setStatic(true);
  //this.platform.setOrigin(0,1);
  //this.platform.setRotation(Phaser.Math.DegToRad(45));

}

createEventHandlers(scene) {

    this.scene.input.on('pointerdown', this.handleControlOn, this);
    this.scene.input.on('pointerup', this.handleControlOff, this);
}

handleControlOn(pointer) {

    if (pointer.x > 400) {
        this.holdRigth = true;
        this.holdLeft = false;
    } else {
        this.holdLeft = true;
        this.holdRigth = false;
    }
    
}

handleControlOff() {

    this.holdRigth = false;
    this.holdLeft = false;
}
 
rotateFromPoint() {

    let radian = Phaser.Math.DegToRad(this.angle);

     this.platform.x = this.pointX + Math.cos(radian) * this.radius; // 150 is the radius of rotation
     this.platform.y = this.pointY + Math.sin(radian) * this.radius;
 
    let facingAngle =  Phaser.Math.Angle.Between(this.platform.x, this.platform.y, this.pointX, this.pointY);
    this.platform.setRotation(facingAngle-90);

}

rotateSelf() {

    this.platform.setRotation(Phaser.Math.DegToRad(this.angle));

}

updatePlatform(){

    if (this.holdRigth) {
        this.angle += 0.5;
    } else if (this.holdLeft) {
        this.angle -= 0.5;
    }else if (!this.holdLeft && !this.holdRigth) {
        this.angle += 0;
    }
    
   
    if(this.self) {
        this.rotateSelf();
    } else {
        this.rotateFromPoint();
    }
   // this.platform.setRotation(Phaser.Math.DegToRad(this.angle));

}




}