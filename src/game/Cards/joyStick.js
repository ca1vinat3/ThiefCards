export default class JoyStick {
    constructor(scene, x, y, radius, gameObject) {
      this.scene = scene; 
      this.x = x; 
      this.y = y; 
      this.radius = radius; 
      this.gameObject = gameObject || null;
  
      this.pointer = { x: 0, y: 0 };
      this.angle = 0; 
      this.magnitude = 0; 
      this.vector = { x: 0, y: 0 };
  
      this.createJoystick();
      this.createEvents();

    }
  
    // Create the joystick
    createJoystick() {
      // Create the outer ring
      this.outerRing = this.scene.add.circle(this.x, this.y, this.radius, 0x888888, 0.5);
      this.outerRing.alpha=0;
  
      // Create the joystick (inner circle)
      this.joystick = this.scene.add.circle(this.x, this.y, this.radius / 2, 0x555555, 0.8);
      this.joystick.alpha=0;
  
      // Add the gameObject if provided
      if (this.gameObject) {
        this.gameObject.setPosition(this.x + 200, this.y);
      }
  
      // Enable dragging functionality for the joystick
      this.joystick.setInteractive();
      this.scene.input.setDraggable(this.joystick);
  
      // Drag events
      this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
       
          const dx = dragX - this.outerRing.x;
          const dy = dragY - this.outerRing.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          // Constrain joystick within the outer ring
          if (distance > this.radius) {
            const angle = Math.atan2(dy, dx);
            dragX = this.outerRing.x + Math.cos(angle) * this.radius;
            dragY = this.outerRing.y + Math.sin(angle) * this.radius;
          }
  
          this.joystick.setPosition(dragX, dragY);
  
          // Calculate pointer data
          this.pointer.x = dragX - this.outerRing.x;
          this.pointer.y = dragY - this.outerRing.y;
          this.angle = Phaser.Math.RadToDeg(Math.atan2(this.pointer.y, this.pointer.x));
          this.magnitude = Phaser.Math.Clamp(distance / this.radius, 0, 1);
  
          // Update movement vector
          this.vector.x = this.pointer.x / this.radius;
          this.vector.y = this.pointer.y / this.radius;
        
      });
  
      // Reset on drag end
      this.scene.input.on('dragend', (pointer, gameObject) => {
        if (gameObject === this.joystick) {
          this.joystick.setPosition(this.outerRing.x, this.outerRing.y);
          this.pointer = { x: 0, y: 0 };
          this.angle = 0;
          this.magnitude = 0;
          this.vector = { x: 0, y: 0 }; // Stop movement
        }
      });
    }

    createEvents()
    {
        this.scene.input.on('pointerdown', (pointer) => {
            // Move to pointer
            this.outerRing.setPosition(pointer.x, pointer.y).setAlpha(0.5);
            this.joystick.setPosition(pointer.x, pointer.y).setAlpha(0.8);
        
            // Start dragging 
            const dx = pointer.x - this.outerRing.x;
            const dy = pointer.y - this.outerRing.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
        
            // initial drag state
            if (distance > this.radius) {
              const angle = Math.atan2(dy, dx);
              pointer.x = this.outerRing.x + Math.cos(angle) * this.radius;
              pointer.y = this.outerRing.y + Math.sin(angle) * this.radius;
            }
        
            this.joystick.setPosition(pointer.x, pointer.y);
        
            // Update joystick data
            this.pointer.x = pointer.x - this.outerRing.x;
            this.pointer.y = pointer.y - this.outerRing.y;
            this.angle = Phaser.Math.RadToDeg(Math.atan2(this.pointer.y, this.pointer.x));
            this.magnitude = Phaser.Math.Clamp(distance / this.radius, 0, 1);
            this.vector.x = this.pointer.x / this.radius;
            this.vector.y = this.pointer.y / this.radius;
          });
        
          this.scene.input.on('pointermove', (pointer) => {
            if (this.outerRing.alpha > 0) {
              const dx = pointer.x - this.outerRing.x;
              const dy = pointer.y - this.outerRing.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
        
              // Constrain within the outer ring
              let dragX = pointer.x;
              let dragY = pointer.y;
        
              if (distance > this.radius) {
                const angle = Math.atan2(dy, dx);
                dragX = this.outerRing.x + Math.cos(angle) * this.radius;
                dragY = this.outerRing.y + Math.sin(angle) * this.radius;
              }
        
              this.joystick.setPosition(dragX, dragY);
        
              // Update joystick data
              this.pointer.x = dragX - this.outerRing.x;
              this.pointer.y = dragY - this.outerRing.y;
              this.angle = Phaser.Math.RadToDeg(Math.atan2(this.pointer.y, this.pointer.x));
              this.magnitude = Phaser.Math.Clamp(distance / this.radius, 0, 1);
              this.vector.x = this.pointer.x / this.radius;
              this.vector.y = this.pointer.y / this.radius;
            }
          });
        
    
        this.scene.input.on('pointerup', () => {

            this.outerRing.alpha=0;
            this.joystick.alpha=0;
            this.vector.x = 0;
            this.vector.y = 0;
         
        });
    
 

    }

      // get directional input
      getDirection() {
        return {
          angle: this.angle, 
          magnitude: this.magnitude, 
          normalized: {
            x: this.vector.x,
            y: this.vector.y,
          },
        };
      }
    
  
      destroy() {
        this.outerRing.destroy();
        this.joystick.destroy();
        if (this.gameObject) this.gameObject.destroy();
      }
  
    // Update the gameObject position 
   update() {
  if (this.gameObject) {
    const moveSpeed = this.magnitude * 200; // Scale speed by magnitude

    // Define 8-directional snapping
    const directions = [
      { min: -22.5, max: 22.5, angle: 0 },    // Right
      { min: 22.5, max: 67.5, angle: 45 },    // Up-Right
      { min: 67.5, max: 112.5, angle: 90 },   // Up
      { min: 112.5, max: 157.5, angle: 135 }, // Up-Left
      { min: 157.5, max: 180, angle: 180 },   // Left
      { min: -180, max: -157.5, angle: 180 }, // Left (negative range)
      { min: -157.5, max: -112.5, angle: -135 }, // Down-Left
      { min: -112.5, max: -67.5, angle: -90 }, // Down
      { min: -67.5, max: -22.5, angle: -45 }, // Down-Right
    ];

    // Determine the closest predefined direction
    let snappedAngle = 0;
    for (const dir of directions) {
      if (this.angle >= dir.min && this.angle < dir.max) {
        snappedAngle = dir.angle;
        break;
      }
    }

    // Convert angle to movement vector
    const rad = Phaser.Math.DegToRad(snappedAngle);
    const moveX = Math.cos(rad) * moveSpeed * this.scene.game.loop.delta / 1000;
    const moveY = Math.sin(rad) * moveSpeed * this.scene.game.loop.delta / 1000;

   
        const newX = this.gameObject.x + this.vector.x * moveSpeed * this.scene.game.loop.delta / 1000;
        const newY = this.gameObject.y + this.vector.y * moveSpeed * this.scene.game.loop.delta / 1000;
  
       
       

    // Move and rotate the gameObject
    this.gameObject.setPosition(newX, newY);
    this.gameObject.setAngle(snappedAngle);
  }
}

  
  
  }
  