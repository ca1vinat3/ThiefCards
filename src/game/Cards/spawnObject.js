export default class SpawnObjects {
    constructor(scene, source, texture, objectCount, isPhysicsEnabled, speed, targetObject) {
        this.scene = scene;
        this.x = source.x;
        this.y = source.y;
        this.mySource = source;
        this.texture = texture;
        this.isPhysicsEnabled = isPhysicsEnabled;
        this.speed = speed;
        this.targetObject = targetObject;
        this.objectCount = objectCount;

        this.objectsGroup = this.scene.add.group({
            maxSize: this.objectCount,
            runChildUpdate: true
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
            object.setPosition(this.x, this.y);

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
                if (distance < 5) { // Adjust threshold as needed
                    this.deactivateObject(object);
                }
            }
        });
    }

    // Spawn an object from the pool
    // spawn() {
    //     const object = this.objectsGroup.getFirstDead();

    //     if (object) {
    //         object.setActive(true).setVisible(true);
    //         object.setPosition(this.x, this.y);

    //         if (this.isPhysicsEnabled) {
    //             object.world.add(object.body);
    //         }

    //         // Continuously update the object's position to follow the target
    //         this.scene.events.on('update', () => {
    //             if (object.active && this.targetObject) {
    //                 const angle = Phaser.Math.Angle.Between(object.x, object.y, this.targetObject.x, this.targetObject.y);
    //                 let  velocityX = Math.cos(angle) * this.speed;
    //                 let  velocityY = Math.sin(angle) * this.speed;

    //                 if (this.isPhysicsEnabled) {
    //                     object.setVelocity(velocityX, velocityY);
    //                 } else {
    //                     object.x += velocityX;
    //                     object.y += velocityY;
    //                 }

    //                 // Check if the object has reached the target
    //                 const distance = Phaser.Math.Distance.Between(object.x, object.y, this.targetObject.x, this.targetObject.y);
    //                 if (distance < 5) { // Adjust threshold as needed
    //                     this.deactivateObject(object);
    //                     velocityX = 0;
    //                     velocityY = 0;
    //                     object.x = 0;
    //                     object.y = 0;
    //                 }
    //             }
    //         });
    //     }
    // }

    // Deactivate an object and return it to the pool
    deactivateObject(object) {
        object.setActive(false).setVisible(false);
        if (this.isPhysicsEnabled) {
            object.setVelocity(0, 0); // Reset physics velocity
            object.world.remove(object.body);
        }
    }

    // Update logic to handle inactive objects (e.g., out-of-bounds objects)
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
