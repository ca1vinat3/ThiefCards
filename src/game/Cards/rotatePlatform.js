

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
   // this.createPlatformParent(scene);
    this.createPlatforms(scene,this.myplatforms);
   // this.createEventHandlers(scene);
  

  }


 createPlatformParent(scene) {

 this.platformParent = this.scene.add.container();

    for (let i = 0; i < this.myplatforms.length; i++) {
      let platform = this.myplatforms[i];
      this.platformParent.add(platform);
    }
}
  createPlatforms(scene, platforms) {
    let isDragging = false;
    let currentPlatform = null; // Tracks the platform being dragged
    let angle = 0;
    // Set up interactivity for all platforms
    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];
      platform.setInteractive();
  
      let dragStartAngle = 0;
  
      // Object-specific interactivity
      if (this.objectInteractive) {
      this.scene.input.on('dragstart', (pointer, gameObject) => {
        if (gameObject === platform) {
          isDragging = true;
          currentPlatform = platform; // Store the current platform
          dragStartAngle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - platform.rotation;
        }
      });
  
      this.scene.input.on('drag', (pointer, gameObject) => {
        if (gameObject === platform && isDragging) {
          angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y) - dragStartAngle;
          platform.setRotation(angle); // Only rotate the current platform
        }
      });
  
      this.scene.input.on('dragend', (pointer, gameObject) => {
        if (gameObject === platform) {
          isDragging = false;
          currentPlatform = null; // Clear the current platform
        }
      });
    
    }

    // Global area interactivity
    if (this.areaInteractive){
    this.scene.input.on('pointerdown', (pointer) => {
      if (!isDragging) {
        // Start dragging all platforms if no individual platform is being dragged
        isDragging = true;
      }
    });
  
    this.scene.input.on('pointerup', () => {
        isDragging = false;
        this.previousPointerAngle = undefined;
      currentPlatform = null; // Clear current platform
    });
  
    this.scene.input.on('pointermove', (pointer) => {
        if (isDragging && !currentPlatform) {
          // Center of the screen
          let centerX = this.scene.scale.width / 2;
          let centerY = this.scene.scale.height / 2;
      
          // Calculate the change in angle based on the pointer's movement
          let currentPointerAngle = Phaser.Math.Angle.Between(pointer.x, pointer.y, centerX, centerY);
      
          if (!this.previousPointerAngle) {
            this.previousPointerAngle = currentPointerAngle;
          }

    // Calculate the delta angle (how much the pointer moved)
    let deltaAngle = currentPointerAngle - this.previousPointerAngle;

    // Rotate all platforms around the center of the screen
    platforms.forEach((platform) => {
            // Calculate the platform's current distance from the center
            let radius = Phaser.Math.Distance.Between(centerX, centerY, platform.x, platform.y);
      
        // Calculate the current angle of the platform relative to the center
        let currentPlatformAngle = Phaser.Math.Angle.Between(centerX, centerY, platform.x, platform.y);

        // Add the delta angle to the platform's current angle
        let newPlatformAngle = currentPlatformAngle + deltaAngle;

        // Update the platform's position based on the new angle
        platform.x = centerX + Math.cos(newPlatformAngle) * radius;
        platform.y = centerY + Math.sin(newPlatformAngle) * radius;
      
            // Preserve the platform's local rotation by adding the delta angle
            platform.setRotation(platform.rotation + deltaAngle);
          });
      
          // Update the previous pointer angle for the next frame
          this.previousPointerAngle = currentPointerAngle;
        }
      });
    }
}
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
 


updatePlatform(){

    

}




}