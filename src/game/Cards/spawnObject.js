export default class SpawnObjects {
    constructor(scene, source, texture, objectCount, isPhysicsEnabled, speed, targetObject, type, spawnDirection,ShootStraight) {
        this.scene = scene;
        this.x = source.x;
        this.y = source.y;
        this.mySource = source;
        this.texture = texture;
        this.isPhysicsEnabled = isPhysicsEnabled;
        this.speed = speed;
        this.ShootStraight = ShootStraight;

        this.targetObject = targetObject; // Target can be another SpawnObjects instance
        this.objectCount = this.texture.length;
        this.type = type; // 'bullet' or 'enemy'
        this.spawnDirection = spawnDirection; // 'fromAround', 'fromBelow', etc.

        this.objectsGroup = this.scene.add.group({
            maxSize: this.objectCount,
            runChildUpdate: true,
        });

        this.initializePool();
        this.scene.events.on('update', this.updateObjects, this);
    }

    // Initialize the object pool using Phaser groups
    initializePool() {
        this.texture.forEach((object) => {
            object.setActive(false).setVisible(false);
            if (this.isPhysicsEnabled && object.body) {
               object.world.remove(object.body);
            }
            this.objectsGroup.add(object);
        });

        // for (let i = 0; i < this.objectCount; i++) {
        //     let object;

        //     if (this.isPhysicsEnabled) {
        //         object = this.scene.matter.add.sprite(this.x, this.y, this.texture).setScale(0.1);
        //         object.setActive(false).setVisible(false);
        //         object.world.remove(object.body);
        //     } else {
        //         object = this.scene.add.sprite(this.x, this.y, this.texture).setScale(0.1);
        //         object.setActive(false).setVisible(false);
        //     }

        //     this.objectsGroup.add(object);
        // }
    }

    // Spawn a new object from the pool
    spawn() {
        const object = this.objectsGroup.getFirstDead();
        this.angle = this.mySource.rotation;

        if (object) {
            object.setActive(true).setVisible(true);

            if (this.type === "enemy") {
                switch (this.spawnDirection) {
                    case "fromAround":
                        const angle = Phaser.Math.Between(0, 360);
                        const radius = 300; // Spawn radius
                        object.setPosition(
                            this.targetObject.x + radius * Math.cos(Phaser.Math.DegToRad(angle)),
                            this.targetObject.y + radius * Math.sin(Phaser.Math.DegToRad(angle))
                        );
                        break;

                    case "fromBelow":
                        object.setPosition(
                            Phaser.Math.Between(0, this.scene.sys.canvas.width),
                            this.scene.sys.canvas.height + 50
                        );
                        break;

                    case "fromAbove":
                        object.setPosition(
                            Phaser.Math.Between(0, this.scene.sys.canvas.width),
                            -50
                        );
                        break;

                    case "fromLeft":
                        object.setPosition(
                            -50,
                            Phaser.Math.Between(0, this.scene.sys.canvas.height)
                        );
                        break;

                    case "fromRight":
                        object.setPosition(
                            this.scene.sys.canvas.width + 50,
                            Phaser.Math.Between(0, this.scene.sys.canvas.height)
                        );
                        break;

                    default:
                        console.warn("Unknown spawn direction:", this.spawnDirection);
                        break;
                }
            } else if (this.type === "bullet") {
                object.setPosition(this.x, this.y);
                object.initialAngle = this.angle;
            }

            if (this.isPhysicsEnabled && object.body) {
                object.world.add(object.body);
            }

            if (this.type === "bullet") {
                // const angle = Phaser.Math.RadToDeg(this.mySource.rotation);
                // const velocityX = Math.cos(angle) * this.speed;
                // const velocityY = Math.sin(angle) * this.speed;

                    // object.x += velocityX;
                    // object.y += velocityY;

                //     const oppositeAngle = this.angle + Math.PI; // Fire in the opposite direction
                //    let velocityX = Math.cos(oppositeAngle) * this.speed;
                //   let  velocityY = Math.sin(oppositeAngle) * this.speed;

                //     object.setVelocity(velocityX, velocityY)
            }
        }
    }

    // Find the closest active enemy
    findClosestEnemy() {
        let closestEnemy = null;
        let closestDistance = Infinity;
        this.objectsGroup.children.iterate((myobject) => {
            if (myobject.active) {
        if (this.targetObject && this.targetObject.objectsGroup) {
            this.targetObject.objectsGroup.children.iterate((object) => {
                if (object.active) {
                    const distance = Phaser.Math.Distance.Between(myobject.x, myobject.y, object.x, object.y);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEnemy = object;
                    }
                }
            });
        }
    }});
        return closestEnemy;
    }

    // Update the objects
    updateObjects() {
        this.update();
        this.x = this.mySource.x;
        this.y = this.mySource.y;
      

        this.objectsGroup.children.iterate((object) => {
            if (object.active) {
                let currentTarget;

                // For bullets, dynamically find the closest enemy
                if (this.type === "bullet") {
                    currentTarget = this.findClosestEnemy();
                }

                // For enemies, use the static target
                if (this.type === "enemy") {
                    currentTarget = this.targetObject;
                }

                if (currentTarget && !this.ShootStraight) {
                    const angle = Phaser.Math.Angle.Between(object.x, object.y, currentTarget.x, currentTarget.y);
                    const velocityX = Math.cos(angle) * this.speed;
                    const velocityY = Math.sin(angle) * this.speed;

                    if (this.isPhysicsEnabled && object.body) {
                        if(object.body){ 
                        object.setStatic(false); // Ensure the body is dynamic
                        object.setAwake(); 
                        object.setVelocity(velocityX, velocityY);}else{console.log("no body");}
                      
                    } else {
                        object.x += velocityX;
                        object.y += velocityY;
                    }

                    // Deactivate the object if it reaches the target
                    const distance = Phaser.Math.Distance.Between(object.x, object.y, currentTarget.x, currentTarget.y);
                    if (distance < 60) {
                        this.deactivateObject(object);
                      

                        if(this.targetObject.objectsGroup){
                            this.targetObject.deactivateObject(currentTarget);
                        }else{
                            currentTarget.destroy();
                        }
                    }
                }

                if (this.type === "bullet" && this.ShootStraight) {
                    // const angle = Phaser.Math.RadToDeg(this.mySource.rotation);
                    // const velocityX = Math.cos(angle) * this.speed;
                    // const velocityY = Math.sin(angle) * this.speed;
    
                     
    
                        const oppositeAngle = object.initialAngle; // Fire in the opposite direction
                      //  console.log(oppositeAngle);
                        console.log(Phaser.Math.RadToDeg(oppositeAngle));
                       let velocityX = Math.cos(oppositeAngle) * this.speed;
                      let  velocityY = Math.sin(oppositeAngle) * this.speed;
    
                      //  object.setVelocity(velocityX, velocityY)
                           object.x += velocityX;
                        object.y += velocityY;
                }
                if (this.type === "bullet" && this.targetObject && this.targetObject.objectsGroup) {
                    this.targetObject.objectsGroup.children.iterate((enemy) => {
                        if (enemy.active && Phaser.Math.Distance.Between(object.x, object.y, enemy.x, enemy.y) < 40) {
                            this.deactivateObject(object);
                            this.deactivateObject(enemy);
                        }
                    });
                }
               


            }
        });
    }

    // Deactivate an object
    deactivateObject(object) {
        object.setActive(false).setVisible(false);
        if (this.isPhysicsEnabled && object.body) {
            object.setVelocity(0, 0); // Reset physics velocity
            object.world.remove(object.body);
        }
    }

    // Clean up objects that leave the screen bounds
    update() {
        if(this.type === "bullet"){
        
       
        this.objectsGroup.children.iterate((object) => {
            if (object.active) {
                if (
                    object.x < 0 ||
                    object.x > this.scene.sys.canvas.width ||
                    object.y < 0 ||
                    object.y > this.scene.sys.canvas.height
                ) {
                    this.deactivateObject(object);
                }
            }
        });

    }
    }
}
