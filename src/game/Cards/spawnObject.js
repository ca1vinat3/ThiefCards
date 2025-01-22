export default class SpawnObjects {
    constructor(scene, source, texture, objectCount, isPhysicsEnabled, speed, targetObject, type, spawnDirection) {
        this.scene = scene;
        this.x = source.x;
        this.y = source.y;
        this.closeEnemy;
        this.mySource = source;
        this.texture = texture;
        this.isPhysicsEnabled = isPhysicsEnabled;
        this.speed = speed;
        this.targetObject = targetObject;
        this.objectCount = objectCount;
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
        for (let i = 0; i < this.objectCount; i++) {
            let object;

            if (this.isPhysicsEnabled) {
                object = this.scene.matter.add.sprite(this.x, this.y, this.texture).setScale(0.1);
                object.setActive(false).setVisible(false);
                object.world.remove(object.body);
            } else {
                object = this.scene.add.sprite(this.x, this.y, this.texture).setScale(0.1);
                object.setActive(false).setVisible(false);
            }

            this.objectsGroup.add(object);
        }
    }

    spawn() {
        const object = this.objectsGroup.getFirstDead();

        if (object) {
            object.setActive(true).setVisible(true);

            if (this.type === "enemy") {
                // Set position based on spawnDirection
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
                // Bullets spawn from the source
                object.setPosition(this.x, this.y);
            }

            if (this.isPhysicsEnabled) {
                object.world.add(object.body);
            }
        }
    }

    updateObjects() {
        this.x = this.mySource.x;
        this.y = this.mySource.y;

        this.objectsGroup.children.iterate((object) => {
            if (object.active && this.targetObject) {
                const angle = Phaser.Math.Angle.Between(object.x, object.y, this.targetObject.x, this.targetObject.y);
                const velocityX = Math.cos(angle) * this.speed;
                const velocityY = Math.sin(angle) * this.speed;

                if (this.isPhysicsEnabled) {
                    object.setVelocity(velocityX, velocityY);
                } else {
                    object.x += velocityX;
                    object.y += velocityY;
                }

                // Deactivate the object if it reaches the target
                const distance = Phaser.Math.Distance.Between(object.x, object.y, this.targetObject.x, this.targetObject.y);
                if (distance < 20) { // Adjust threshold as needed
                    this.deactivateObject(object);
                   // this.targetObject.destroy();
                }
                if (distance < 50) { // Adjust threshold as needed
                
                    this.closeEnemy = object
                }
            }
        });
    }

    deactivateObject(object) {
        object.setActive(false).setVisible(false);
        if (this.isPhysicsEnabled) {
            object.setVelocity(0, 0); // Reset physics velocity
            object.world.remove(object.body);
        }
    }

    update() {
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
