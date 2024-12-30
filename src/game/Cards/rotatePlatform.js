

export class rotatePlatform {
  constructor(scene,plaforms, x, y, self ,pointx,pointy,objectInteractive,areaInteractive,radius,texture) {

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.self = self;
    this.myplatforms = plaforms;
    this.pointX = pointx;
    this.pointY = pointy;
    this.radius = radius;
    this.objectInteractive = objectInteractive;
    this.areaInteractive = areaInteractive;
    this.localRotate = false;
    this.holdRigth = false;
    this.holdLeft = false;
    this.angle = 3;  
    this.createPlatforms(scene,this.myplatforms);
   // this.createEventHandlers(scene);
  

  }

  createPlatforms(scene,platforms) {

     for(let i = 0; i < platforms.length; i++) {
      
        let platform = platforms[i];
        platform.setInteractive();

        let dragStartAngle = 0;
        let isDragging = false;
    
    
    if(this.objectInteractive) {
     
      this.scene.input.on('dragstart', (pointer, gameObject) => {
        if (gameObject === platform) {
            isDragging = true;
          // Store the initial angle relative to the pointer
          dragStartAngle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - platform.rotation;
        }
      });
    
      this.scene.input.on('drag', (pointer, gameObject) => {
        if (gameObject === platform) {
            isDragging = true;
          // Calculate the new angle based on pointer position
          let angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - dragStartAngle;
    
          // Update the platform's rotation
          platform.setRotation(angle);
        }
      });
    
      
    }
    
    if(this.areaInteractive) {
    
    this.scene.input.on('pointerdown', (pointer) => {
        
        isDragging = false;
        // Calculate the initial angle difference between pointer and platform
       dragStartAngle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - platform.rotation;
      });
    
      // End drag on pointer up
      this.scene.input.on('pointerup', () => {
        isDragging = false;
      });
    
      // Rotate platform while dragging
      this.scene.input.on('pointermove', (pointer) => {
        if (!isDragging) {
          // Calculate the new angle
          let angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - dragStartAngle;
    
          // Update the platform's rotation
         platform.setRotation(angle);
        }
      });
    
    
    
    }



     };
  
   
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