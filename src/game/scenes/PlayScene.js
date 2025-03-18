import { Scene } from 'phaser'
import { ball } from '../Cards/ball'
import { rotatePlatform } from '../Cards/rotatePlatform';
import  actionSequence  from '../Cards/actionSequence';
import JoyStick from '../Cards/joyStick';
import spawnObject from '../Cards/spawnObject';
import  match  from '../Cards/match';
import { sRGBEncoding } from 'three';
import Uno from '../Cards/uno';
import
{
    AddSpriteToWorld,
    b2DefaultWorldDef,
    b2Vec2,
    pxmVec2,
    CreateWorld,
    SpriteToBox,
    UpdateWorldSprites,
    WorldStep,
    b2DefaultShapeDef,
    STATIC,
    pxm,
    KINEMATIC,
    b2Body_IsValid,
    b2Body_GetUserData,
    b2Shape_GetBody,
    b2Body_GetLinearVelocity,
    b2Body_SetLinearVelocity,
    b2World_GetContactEvents,
    b2Body_SetUserData,
    b2Body_GetLocalVector,
    b2Sub,
    b2Body_GetContactCapacity,
    b2ContactData,
    b2Body_GetContactData,
    B2_ID_EQUALS,
    RemoveSpriteFromWorld,
    SetWorldScale,
    GetWorldScale,
    b2World_Draw,
    b2Body_GetRotation,
    b2Body_SetTransform,
    b2MakeRot,
    b2Body_SetAngularVelocity,
    b2Body_GetPosition,
    CreateDebugDraw,
    ConvertScreenToWorld,
    b2World_CastRay,
    b2AABB,
    GetBodyFromSprite,
    b2DefaultBodyDef,
    CreateRevoluteJoint,
    b2CreateBody,
    DYNAMIC,
    b2NormalizeRot,
    b2Normalize

} from '../libs/PhaserBox2D.js';
import  PhaserDebugDraw  from '../libs/PhaserDebugDraw.js';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.platforms = [];
    this.platforms2 = [];
    this.spawn = false;
    this.enemies = [];
    this.bullets = [];
    this.Mycards = [];
  }



  create () {
    this.add.image(400, 300, 'background');
    SetWorldScale(10);
    // this.cardOne = this.add.sprite(0, 0, 'cardOne').setScale(0.3)
    // this.cardTwo = this.add.sprite(0, 0, 'cardTwo').setScale(0.3)
    // this.cardThree = this.add.sprite(0, 0, 'cardThree').setScale(0.3)
    // this.cardFour = this.add.sprite(0, 0, 'cardFour').setScale(0.3)

    
    const debug = this.add.graphics();
    const worldDef = b2DefaultWorldDef();
    worldDef.gravity = new b2Vec2(0, 0);
    const world = CreateWorld({ worldDef });
    const worldId = world.worldId;
    this.worldId = world.worldId;

    this.world = world;
    this.debug = debug;
    this.worldDraw = new PhaserDebugDraw(debug, 1280, 720, GetWorldScale());
    let isDragging = false;
    const m_drawScale = 10.0;
    //const m_draw = CreateDebugDraw(canvas, ctx, m_drawScale);
    const bodyDef = b2DefaultBodyDef();
    const groundId = b2CreateBody(worldId, bodyDef);

    let rows = 4; // Number of rows
    let cols = 4; // Number of columns
    let spacingX = 160; // Horizontal spacing between platforms
    let spacingY =100; // Vertical spacing between platforms
    let startX = 200; // Starting X position
    let startY = 200; // Starting Y position
    let index = 0;
    let bodyToRotate;
    let bodyStartAngle =0
    let currentPlatform = null;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
       index ++;
        // Calculate position for each platform
        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        // Create the platform sprite
        let platform = this.add.sprite(x, y, 'platform').setInteractive();
        
        platform.setDisplaySize(150, 50);

        let platformBody  = SpriteToBox(worldId, platform, {
          type:KINEMATIC,
          restitution: 0.2,
          friction: 0.5,
      });

      //platformBody.SetGravityScale(0);

      let platformBodyID = platformBody.bodyId;
        AddSpriteToWorld(worldId, platform, platformBody);
        b2Body_SetUserData(platformBodyID, { type: 'platform' });
      
        this.platforms.push(platformBody);
       this.platforms2.push(platform);

         const bodyAngle = b2Body_GetRotation(platformBody.bodyId).angle;
         const bodyPos = b2Body_GetPosition(platformBody.bodyId);
        

        
     let clickedPoint = new b2Vec2(0, 0);

     let mouseDown = false;
     platform.on("pointerdown", (pointer) => {
      mouseDown = true;
        
      const ps = new b2Vec2(pointer.x -this.worldDraw.positionOffset.x, pointer.y - this.worldDraw.positionOffset.y);
      // convert screen coordinates into physics world coordinates, taking into account the drawing scale factor
      const pw = ConvertScreenToWorld(this.sys.game.canvas, m_drawScale, ps);

     const clickedPoint = pw;

      const toTarget = new b2Vec2( clickedPoint.x - bodyPos.x,
      clickedPoint.y - bodyPos.y);
      const desiredAngle = Math.atan2(-toTarget.x, toTarget.y);


      bodyToRotate =  GetBodyFromSprite(this.worldId, platform);

      bodyStartAngle = desiredAngle - b2Body_GetRotation(bodyToRotate.bodyId).angle;

      console.log(bodyToRotate);

      currentPlatform = platform;
                
     });
     platform.on("dragStart", (pointer, gameObject) => {
      console.log("dragStart");
     });
     platform.on("pointermove", (pointer, gameObject, dragX, dragY) => {
      console.log("drag");
     });
     platform.on("dragEnd", (pointer, gameObject) => {
      console.log("dragEnd");
     });
      this.input.on("pointerup", (pointer) => {
        mouseDown = false;
      });
      this.input.on("pointermove", (pointer) => {

    
    

          // convert mouse click to screen coordinates taking into account any scrolling
          const ps = new b2Vec2(pointer.x -this.worldDraw.positionOffset.x, pointer.y - this.worldDraw.positionOffset.y);
          // convert screen coordinates into physics world coordinates, taking into account the drawing scale factor
          const pw = ConvertScreenToWorld(this.sys.game.canvas, m_drawScale, ps);
    if (mouseDown) {

   
     let bodyToRotate =  GetBodyFromSprite(this.worldId, platform);
      const bodyAngle = b2Body_GetRotation(bodyToRotate.bodyId).angle;
      //const bodyPos = b2Body_GetPosition(bodyToRotate.bodyId);
      console.log("myAngle:",bodyAngle)
              clickedPoint = pw;

              const toTarget = new b2Vec2( clickedPoint.x - bodyPos.x,
              clickedPoint.y - bodyPos.y);
              const desiredAngle = Math.atan2(toTarget.x, toTarget.y)
              let angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, platform.x, platform.y)
              console.log("myAngle:",desiredAngle)
              console.log("myAnglePhase:",angle)
                  b2Body_SetTransform(bodyToRotate.bodyId, bodyPos, b2MakeRot(-angle));
                  b2Body_SetAngularVelocity(bodyToRotate.bodyId, 0);
    }

      });




    ///// HERE HERE 

      //AREA INTERACTIVITY 
      let bodyToRotate =  GetBodyFromSprite(this.worldId, platform);
    //   CreateRevoluteJoint({
    //     bodyIdA: groundId, bodyIdB:bodyToRotate.bodyId,
    //     anchorA: new b2Vec2(10, 10), anchorB: new b2Vec2(0, 0),
    //     worldId: worldId,
    //     motorSpeed: 0.15 * Math.PI,
    //     maxMotorTorque: 1e8,
    //     enableMotor: false,
    // });

      this.input.on('pointerdown', (pointer) => {
        if (!isDragging) {
          // Start dragging all platforms if no individual platform is being dragged
          isDragging = true;
        }
      });
    
      this.input.on('pointerup', () => {
          isDragging = false;
          this.previousPointerAngle = undefined;
        currentPlatform = null; // Clear current platform
      });
    
      this.input.on('pointermove', (pointer) => {
          if (isDragging && !currentPlatform) {
            // Center of the screen
            let centerX = this.scale.width / 2;
            let centerY = this.scale.height / 2;
            
        
            // Calculate the change in angle based on the pointer's movement
            let currentPointerAngle = Phaser.Math.Angle.Between(pointer.x, pointer.y, centerX, centerY);
        
            if (!this.previousPointerAngle) {
              this.previousPointerAngle = currentPointerAngle;
            }
  
      // Calculate the delta angle (how much the pointer moved)
      let deltaAngle = currentPointerAngle - this.previousPointerAngle;
  
      // Rotate all platforms around the center of the screen
      this.platforms2.forEach((platform) => {
              // Calculate the platform's current distance from the center
              let radius = Phaser.Math.Distance.Between(centerX, centerY, platform.x, platform.y);
        
          // Calculate the current angle of the platform relative to the center
          let currentPlatformAngle = Phaser.Math.Angle.Between(centerX, centerY, platform.x, platform.y);
  
          // Add the delta angle to the platform's current angle
          let newPlatformAngle = currentPlatformAngle + deltaAngle;

          let bodyToRotate =  GetBodyFromSprite(this.worldId, platform);
          const bodyAngle = b2Body_GetRotation(bodyToRotate.bodyId) ;
          const bodyPos = b2Body_GetPosition(platformBody.bodyId);
             console.log("naljnaln",bodyAngle);
          // Update the platform's position based on the new angle
          let platformPosX = centerX + Math.cos(newPlatformAngle) * radius;
          let platformPosY = centerY + Math.sin(newPlatformAngle) * radius;
        
              // Preserve the platform's local rotation by adding the delta angle
             // platform.setRotation(platform.rotation + deltaAngle);
          
         
            b2Body_SetTransform(bodyToRotate.bodyId,( pxmVec2(platformPosX,platformPosY)), b2MakeRot(platform.rotation + deltaAngle));
             b2Body_SetAngularVelocity(bodyToRotate.bodyId,0);
             });
        
            // Update the previous pointer angle for the next frame
            this.previousPointerAngle = currentPointerAngle;
          }
        });






   
      }
    }


    



  }




  update (time, delta) {

    const worldId = this.world.worldId;
    UpdateWorldSprites(worldId);
    WorldStep({ worldId, deltaTime: delta });

  

    this.debug.clear();
    b2World_Draw(worldId, this.worldDraw);

  }
}