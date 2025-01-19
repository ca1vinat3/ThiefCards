export default class SpawnObjects {
    constructor(scene, sourceX, sourceY, texture, objectCount, isPhysicsEnabled, speed, targetObject) {
        this.scene = scene;
        this.x = sourceX;
        this.y = sourceY;
        this.texture = texture;
        this.isPhysicsEnabled = isPhysicsEnabled;
        this.speed = speed;
        this.targetObject = targetObject;
        this.objectCount = objectCount;

        this.objectPool = []; // Pool of reusable objects
        this.activeObjects = []; // Currently active objects

        this.initializePool();
    }

    // Initialize pool
    initializePool() {
        for (let i = 0; i < this.objectCount; i++) {
            let object;

            if (this.isPhysicsEnabled) {
                object = this.scene.matter.add.sprite(this.x, this.y, this.texture);
                object.setActive(false).setVisible(false); // Initially inactive
            } else {
                object = this.scene.add.sprite(this.x, this.y, this.texture);
                object.setActive(false).setVisible(false); // Initially inactive
            }

            this.objectPool.push(object);
        }
    }

    // Get from the pool or return null if none available
    getObjectFromPool() {
        if (this.objectPool.length > 0) {
            return this.objectPool.pop();
        }
        return null; 
    }

    // Return to the pool
    returnObjectToPool(object) {
        object.setActive(false).setVisible(false);
        if (this.isPhysicsEnabled) {
            object.setPosition(this.x, this.y); // Reset position
            object.setVelocity(0, 0); // Reset physics velocity
        } else {
            object.setPosition(this.x, this.y); // Reset position
        }
        this.objectPool.push(object);
    }

    // Spawn  and optionally make it follow a target
    spawn() {
        const object = this.getObjectFromPool();

        if (object) {
            object.setActive(true).setVisible(true);

            if (this.targetObject) {
                this.scene.tweens.add({
                    targets: object,
                    x: this.targetObject.x,
                    y: this.targetObject.y,
                    duration: this.speed,
                    onComplete: () => {
                        this.returnObjectToPool(object);
                    },
                });
            } else {
                // Move the object in a default direction (e.g., straight up)
                if (this.isPhysicsEnabled) {
                    object.setVelocity(0, -this.speed);
                } else {
                    this.scene.tweens.add({
                        targets: object,
                        y: object.y - this.speed * 100,
                        duration: 1000,
                        onComplete: () => {
                            this.returnObjectToPool(object);
                        },
                    });
                }
            }

            this.activeObjects.push(object);
        }
    }

    //  handle inactive objects out-of-bounds 
    update() {
        this.activeObjects = this.activeObjects.filter((object) => {
            if (object.active) {
                // Check if the object is out of bounds
                if (
                    object.x < 0 ||
                    object.x > this.scene.sys.canvas.width ||
                    object.y < 0 ||
                    object.y > this.scene.sys.canvas.height
                ) {
                    this.returnObjectToPool(object);
                    return false; // Remove from active objects list
                }
                return true; // Keep active
            } else {
                this.returnObjectToPool(object);
                return false;
            }
        });
    }
}
