export default class Explode {
    /**
     * @param {Phaser.Scene} scene - The scene to add the explosion to.
     * @param {Phaser.GameObjects.Image|Phaser.GameObjects.Sprite} image - The image whose texture will be used for the explosion.
     */
    constructor(scene, image) {
        this.scene = scene;
        this.image = image;
        this.textureKey = image.texture.key;
        this.canExplode = true;
        this.particles = null;
        this.emitter = null;
    }

    /**
     * Triggers the explosion effect if allowed. Disables further explosions until 1.5s have passed.
     * @param {number} [x] - Optional x position for the explosion (defaults to image.x)
     * @param {number} [y] - Optional y position for the explosion (defaults to image.y)
     */
    explode(x, y) {
        if (!this.canExplode) return;
        this.canExplode = false;
        const posX = x !== undefined ? x : this.image.x;
        const posY = y !== undefined ? y : this.image.y;

        // Create particles using the image's texture
        this.particles = this.scene.add.particles(this.textureKey);
        this.emitter = this.particles.createEmitter({
            x: posX,
            y: posY,
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 30,
            blendMode: 'ADD',
        });

        // Destroy the emitter and particles after 1.5 seconds
        this.scene.time.delayedCall(1500, () => {
            if (this.particles) {
                this.particles.destroy();
                this.particles = null;
                this.emitter = null;
            }
            this.canExplode = true; // Re-enable explosion after 1.5s
        });
    }

    /**
     * Returns whether the explosion can currently be triggered.
     */
    isReady() {
        return this.canExplode;
    }
}


