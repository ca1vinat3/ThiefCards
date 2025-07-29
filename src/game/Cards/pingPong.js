export default class pingPong {
    constructor(scene, x, y, playerPaddle, aiPaddle, ball) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.playerPaddle = playerPaddle; // Bottom paddle (player)
        this.aiPaddle = aiPaddle;         // Top paddle (AI)
        this.ball = ball; // Ball (Matter object)
        this.ball.setDepth(100);
        this.scorePlayer = 0;
        this.scoreAI = 0;
        this.isPlaying = false;
        this.ballSpeed = 9; // Constant speed for the ball
        this.aiMaxSpeed = 1.5; // Further reduced max speed for AI paddle
        this.aiLerp = 0.10; // Further reduced lerp factor for AI paddle
        this.lastPaddleHitTime = 0; // For paddle collision cooldown
        this.paddleHitCooldown = 150; // ms
        this.firstServe = true; // Track if it's the first serve for countdown

        this.createScoreText();
        this.makeDraggable(this.playerPaddle);
        this.setupCollisions();
        this.createTrailTexture();
        this.createTrailEmitter();
        this.resetBall();
        this.createTimer();
      
         this.scene.events.on('update', this.update, this);
    }

    createScoreText() {
        this.scoreTextPlayer = this.scene.add.text(300, 780, '0', { fontSize: '32px', color: '#fff' }).setOrigin(0.5, 1);
        this.scoreTextAI = this.scene.add.text(300, 20, '0', { fontSize: '32px', color: '#fff' }).setOrigin(0.5, 0);
    }

    updateScore() {
        this.scoreTextPlayer.setText(this.scorePlayer);
        this.scoreTextAI.setText(this.scoreAI);
    }

    makeDraggable(paddle) {
        paddle.setInteractive();
        this.scene.input.setDraggable(paddle);
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === paddle) {
                // Only allow horizontal movement
                gameObject.setPosition(Phaser.Math.Clamp(dragX, gameObject.displayWidth/2, this.scene.scale.width - gameObject.displayWidth/2), gameObject.y);
                // No setVelocityX, since paddle is static
            }
        });
    }

    setupCollisions() {
        // Set restitution (bounciness)
        this.ball.setBounce(1);
        this.playerPaddle.setBounce(1);
        this.aiPaddle.setBounce(1);
        this.ball.setFriction(0, 0, 0);
        this.ball.setFrictionAir(0);
        this.ball.setIgnoreGravity(true);
        this.playerPaddle.setIgnoreGravity(true);
        this.aiPaddle.setIgnoreGravity(true);

        // Ball bounces off paddles with fixed speed and random angle
        this.scene.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                const ballBody = this.ball.body;
                if ((bodyA === ballBody && (bodyB === this.playerPaddle.body || bodyB === this.aiPaddle.body)) ||
                    (bodyB === ballBody && (bodyA === this.playerPaddle.body || bodyA === this.aiPaddle.body))) {
                
                    const now = this.scene.time.now;
                    if (now - this.lastPaddleHitTime < this.paddleHitCooldown) return;
                    this.lastPaddleHitTime = now;
                
                    this.onPaddleHit();
               
                    const isPlayer = (bodyA === this.playerPaddle.body || bodyB === this.playerPaddle.body);
       
                    let angle = Phaser.Math.Between(-45, 45);
                    if (isPlayer) {
              
                        angle = Phaser.Math.DegToRad(angle - 90);
                    } else {
                    
                        angle = Phaser.Math.DegToRad(angle + 90);
                    }
              
                    const paddle = isPlayer ? this.playerPaddle : this.aiPaddle;
                    const influence = paddle.body.velocity.x * 0.25;
                    const vx = Math.sin(angle) * this.ballSpeed + influence;
                    const vy = Math.cos(angle) * this.ballSpeed * (isPlayer ? -1 : 1);
                    this.ball.setVelocityX(vx);
                    this.ball.setVelocityY(vy);
           
                    if (isPlayer) {
                        this.ball.setPosition(this.ball.x, this.playerPaddle.y - this.playerPaddle.displayHeight/2 - this.ball.displayHeight/2 - 2);
                    } else {
                        this.ball.setPosition(this.ball.x, this.aiPaddle.y + this.aiPaddle.displayHeight/2 + this.ball.displayHeight/2 + 2);
                    }
                }
            });
        });
    }

    resetBall() {
        this.isPlaying = false;
        this.ball.setPosition(this.x, this.y);
        this.ball.setVelocity(0, 0);
        this.randomBallColorLog();
        if (this.firstServe) {
            this.firstServe = false;
            this.showCountdown(() => {
                this.launchBall();
            });
        } else {
            this.scene.time.delayedCall(700, () => {
                this.launchBall();
            });
        }
    }

    launchBall() {
        this.isPlaying = true;
        // Launch in random up or down direction
        const angle = Phaser.Math.Between(-45, 45) + (Phaser.Math.Between(0, 1) ? 0 : 180);
        const rad = Phaser.Math.DegToRad(angle);
        const vx = Math.sin(rad) * this.ballSpeed;
        const vy = Math.cos(rad) * this.ballSpeed * (Phaser.Math.Between(0, 1) ? 1 : -1);
        this.ball.setVelocity(vx, vy);
    }

    update() {
        if (!this.isPlaying) return;
        // Update emitter position to match ball exactly
        if (this.trailEmitter) {
            this.trailEmitter.setPosition(this.ball.x, this.ball.y);
        }
        // --- AI Paddle follows ball.x smoothly ---
        const targetX = Phaser.Math.Clamp(this.ball.x, this.aiPaddle.displayWidth/2, this.scene.scale.width - this.aiPaddle.displayWidth/2);
        const newX = Phaser.Math.Linear(this.aiPaddle.x, targetX, this.aiLerp);
        // Clamp max speed
        let dx = newX - this.aiPaddle.x;
        dx = Phaser.Math.Clamp(dx, -this.aiMaxSpeed, this.aiMaxSpeed);
        // Move AI paddle by setPosition only (static body)
        this.aiPaddle.setPosition(this.aiPaddle.x + dx, this.aiPaddle.y);

        // --- Keep paddles within bounds (horizontal only) ---
        this.keepPaddleInBounds(this.playerPaddle);
        this.keepPaddleInBounds(this.aiPaddle);

        // --- Clamp ball speed to constant ---
        const v = this.ball.body.velocity;
        const speed = Math.sqrt(v.x * v.x + v.y * v.y);
        if (speed !== this.ballSpeed) {
            const scale = this.ballSpeed / (speed || 1);
            this.ball.setVelocity(v.x * scale, v.y * scale);
        }

        // --- Fix endless wall-to-wall bounce ---
        if (Math.abs(v.y) < 2) {
            // Nudge the ball with a small random vertical velocity
            const nudge = Phaser.Math.Between(2, 4) * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(v.x, nudge);
        }

        // --- Ball out of bounds (score) ---
        if (this.ball.y < 0) {
            this.scorePlayer++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.y > this.scene.scale.height) {
            this.scoreAI++;
            this.updateScore();
            this.resetBall();
        }


       // this.trailParticles.x = this.ball.x;
      //  this.trailParticles.y = this.ball.y;
    }

    keepPaddleInBounds(paddle) {
        const halfWidth = paddle.displayWidth / 2;
        if (paddle.x - halfWidth < 0) {
            paddle.setPosition(halfWidth, paddle.y);
            // No setVelocityX, since paddle is static
        } else if (paddle.x + halfWidth > this.scene.scale.width) {
            paddle.setPosition(this.scene.scale.width - halfWidth, paddle.y);
            // No setVelocityX, since paddle is static
        }
    }

    // Random color log function for ball respawn
    randomBallColorLog() {
        const colors = ['i am red', 'i am blue', 'i am green'];
        const choice = colors[Math.floor(Math.random() * colors.length)];
        console.log(choice);
    }

    // Log on paddle hit and emit particles
    onPaddleHit() {
        console.log('hit');
        // let textureKey = this.scene.textures.exists('thief') ? 'thief' : 'white';
        // const manager = this.scene.add.particles(this.ball.x, this.ball.y, textureKey, {
        //     lifespan: 500,
        //     speed: { min: 50, max: 100 },
        //     angle: { min: 0, max: 360 },
        //     scale: { start: 0.2, end: 0 },
        //     alpha: { start: 1, end: 0 },
        //     quantity: 5
        // });
        // this.scene.time.delayedCall(1000, () => manager.destroy());
    }

    showCountdown(callback) {
        let count = 3;
        const text = this.scene.add.text(this.scene.scale.width/2, this.scene.scale.height/2, count, {
            fontSize: '96px', color: '#000', fontStyle: 'bold'
        }).setOrigin(0.5);
        const timer = this.scene.time.addEvent({
            delay: 700,
            repeat: 4,
            callback: () => {
                if (count > 0) {
                    text.setText(count);
                    count--;
                } else if (count === 0) {
                    text.setText('Go!');
                    count--;
                } else {
                    text.destroy();
                    timer.remove();
                    if (callback) callback();
                }
            }
        });
    }

    createTrailTexture() {
        // Create a small white circle graphic and generate a texture
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(8, 8, 8); // x, y, radius
        graphics.generateTexture('ballTrail', 16, 16);
        graphics.destroy();
    }

    createTrailEmitter() {
        // Use the generated 'ballTrail' texture for the trail
        this.trailParticles = this.scene.add.particles(0,0,'ballTrail',{
            lifespan: 1500,
            speed: { min: 10, max: 30 },
            scale: { start: 2, end: 0 },
            angle: { min: 0, max: 180 },
            alpha: { start: 0, end: 0.3 },
            quantity: 5,
            frequency: 0
        });

        this.trailParticles.setDepth(-1)

        this.trailParticles.startFollow(this.ball);
    }

    createTimer() {
        this.timerValue = 0;
        this.timerText = this.scene.add.text(300, 400, '0', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            repeat: 29, // 0 to 30 seconds (30 ticks)
            callback: () => {
                this.timerValue++;
                this.timerText.setText(this.timerValue);
                if (this.timerValue === 27) {
                    this.stopGameAndShowResult();
                }
            }
        });
    }

    stopGameAndShowResult() {
        this.isPlaying = false;
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        let message = '';
        if (this.scorePlayer > this.scoreAI) {
            message = 'Great Tong! You Won';
        } else {
            message = 'loose tong You Lost';
        }
        this.resultText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 + 100,
            message,
            { fontSize: '48px', color: '#ff0', fontStyle: 'bold' }
        ).setOrigin(0.5);
    }
}


/*


// Write between the Comment lines
// ### Create: Active Start ###


class pingPong {
    constructor(scene, x, y, playerPaddle, aiPaddle, ball) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.playerPaddle = playerPaddle; // Bottom paddle (player)
        this.aiPaddle = aiPaddle;         // Top paddle (AI)
        this.ball = ball; // Ball (Matter object)
        this.ball.visible = false;
        this.scorePlayer = 0;
        this.scoreAI = 0;
        this.isPlaying = false;
        this.ballSpeed = 9; // Constant speed for the ball
        this.aiMaxSpeed = 1.5; // Further reduced max speed for AI paddle
        this.aiLerp = 0.10; // Further reduced lerp factor for AI paddle
        this.lastPaddleHitTime = 0; // For paddle collision cooldown
        this.paddleHitCooldown = 150; // ms
        this.firstServe = true; // Track if it's the first serve for countdown
        
        this.createScoreText();
        //this.makeDraggable(this.playerPaddle);
        this.setupCollisions();

        this.scene.events.on('update', this.update, this);
        this.resetBall();
        this.createTopFood();
        this.createTrailTexture();
        this.createTrailEmitter();
        this.createTimer();
    }

    createScoreText() {
        this.scoreTextPlayer = this.scene.add.text(this.aiPaddle.x - 250, this.aiPaddle.y + 450, '0', { fontSize: '96px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5, 1);
        this.scoreTextAI = this.scene.add.text(this.aiPaddle.x - 250, this.aiPaddle.y+150, '0', { fontSize: '96px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5, 0);
    }

    updateScore() {
        this.scoreTextPlayer.setText(this.scorePlayer);
        this.scoreTextAI.setText(this.scoreAI);
    }

    makeDraggable(paddle) {
        paddle.setInteractive();
        this.scene.input.setDraggable(paddle);
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === paddle) {
                // Only allow horizontal movement
                gameObject.setPosition(Phaser.Math.Clamp(dragX, gameObject.displayWidth / 2, this.scene.scale.width - gameObject.displayWidth / 2), gameObject.y);
                // No setVelocityX, since paddle is static
            }
        });
    }

    setupCollisions() {
        // Set restitution (bounciness)
        this.ball.setBounce(1);
        this.playerPaddle.setBounce(1);
        this.aiPaddle.setBounce(1);
        this.ball.setFriction(0, 0, 0);
        this.ball.setFrictionAir(0);
        this.ball.setIgnoreGravity(true);
        this.playerPaddle.setIgnoreGravity(true);
        this.aiPaddle.setIgnoreGravity(true);

        // Ball bounces off paddles with fixed speed and random angle
        this.scene.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                const ballBody = this.ball.body;
                if ((bodyA === ballBody && (bodyB === this.playerPaddle.body || bodyB === this.aiPaddle.body)) ||
                    (bodyB === ballBody && (bodyA === this.playerPaddle.body || bodyA === this.aiPaddle.body))) {
                    // Paddle collision cooldown
                    const now = this.scene.time.now;
                    if (now - this.lastPaddleHitTime < this.paddleHitCooldown) return;
                    this.lastPaddleHitTime = now;
                    // Log paddle hit
                    this.onPaddleHit();
                    // Determine which paddle
                    const isPlayer = (bodyA === this.playerPaddle.body || bodyB === this.playerPaddle.body);
                    // Add a small random angle to the bounce
                    let angle = Phaser.Math.Between(-45, 45);
                    if (isPlayer) {
                        // Bounce up
                        angle = Phaser.Math.DegToRad(angle - 90);
                    } else {
                        // Bounce down
                        angle = Phaser.Math.DegToRad(angle + 90);
                    }
                    // Add some influence from paddle movement
                    const paddle = isPlayer ? this.playerPaddle : this.aiPaddle;
                    const influence = paddle.body.velocity.x * 0.25;
                    const vx = Math.sin(angle) * this.ballSpeed + influence;
                    const vy = Math.cos(angle) * this.ballSpeed * (isPlayer ? -1 : 1);
                    this.ball.setVelocityY(vy);
                    this.ball.setVelocityX(vx)
                    // Nudge ball away from paddle to prevent overlap
                    if (isPlayer) {
                        this.ball.setPosition(this.ball.x, this.playerPaddle.y - this.playerPaddle.displayHeight / 2 - this.ball.displayHeight / 2 - 2);
                    } else {
                        this.ball.setPosition(this.ball.x, this.aiPaddle.y + this.aiPaddle.displayHeight / 2 + this.ball.displayHeight / 2 + 2);
                    }
                }
            });
        });
    }

    resetBall() {
        this.isPlaying = false;
        this.ball.setPosition(this.playerPaddle.x, this.playerPaddle.y-400);
        this.ball.setVelocityY(0);
        this.ball.setVelocityX(0)
        this.ball.setDepth(20);
        this.randomBallColorLog();
        if (this.firstServe) {
            this.firstServe = false;
            this.showCountdown(() => {
                this.launchBall();
            });
        } else {
            this.scene.time.delayedCall(700, () => {
                this.launchBall();
            });
        }
    }

    launchBall() {
        this.isPlaying = true;
        // Launch in random up or down direction
        const angle = Phaser.Math.Between(-45, 45) + (Phaser.Math.Between(0, 1) ? 0 : 180);
        const rad = Phaser.Math.DegToRad(angle);
        const vx = Math.sin(rad) * this.ballSpeed;
        const vy = Math.cos(rad) * this.ballSpeed * (Phaser.Math.Between(0, 1) ? 1 : -1);
        this.ball.setVelocityY(vy);
        this.ball.setVelocityX(vx)
    }

    createTopFood() {
        this.myTopFood = this.scene.add.image(this.ball.x, this.ball.y, this.scene.textures.get(data.animations[2][0]));
        this.myTopFood.setScale(0.22);
        this.myTopFood.setDepth(101);
    }

    update() {
        if (!this.isPlaying) return;
        // --- AI Paddle follows ball.x smoothly ---
        const targetX = Phaser.Math.Clamp(this.ball.x, this.aiPaddle.displayWidth / 2, this.scene.scale.width - this.aiPaddle.displayWidth / 2);
        const newX = Phaser.Math.Linear(this.aiPaddle.x, targetX, this.aiLerp);
        // Clamp max speed
        let dx = newX - this.aiPaddle.x;
        dx = Phaser.Math.Clamp(dx, -this.aiMaxSpeed, this.aiMaxSpeed);
        // Move AI paddle by setPosition only (static body)
        this.aiPaddle.setPosition(this.aiPaddle.x + dx, this.aiPaddle.y);

        // --- Keep paddles within bounds (horizontal only) ---
       // this.keepPaddleInBounds(this.playerPaddle);
        //this.keepPaddleInBounds(this.aiPaddle);

        // --- Clamp ball speed to constant ---
        const v = this.ball.body.velocity;
        const speed = Math.sqrt(v.x * v.x + v.y * v.y);
        if (speed !== this.ballSpeed) {
            const scale = this.ballSpeed / (speed || 1);
           // this.ball.setVelocity(v.x * scale, v.y * scale);
            this.ball.setVelocityY(v.y*scale);
            this.ball.setVelocityX(v.x*scale)
        }

        // --- Fix endless wall-to-wall bounce ---
        if (Math.abs(v.y) < 2) {
            // Nudge the ball with a small random vertical velocity
            const nudge = Phaser.Math.Between(2, 4) * (Phaser.Math.Between(0, 1) ? 1 : -1);
            //this.ball.setVelocity(v.x, nudge);
            this.ball.setVelocityY(nudge);
            this.ball.setVelocityX(v.x)
        }

        // --- Ball out of bounds (score) ---
        if (this.ball.y < -300) {
            this.scorePlayer++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.y > 1920) {
            this.scoreAI++;
            this.updateScore();
            this.resetBall();
        }

        this.myTopFood.x = this.ball.x;
        this.myTopFood.y = this.ball.y;
        this.myTopFood.angle = this.ball.angle;
    }

    keepPaddleInBounds(paddle) {
        const halfWidth = paddle.displayWidth / 2;
        if (paddle.x - halfWidth < -600) {
            paddle.setPosition(halfWidth, paddle.y);
            // No setVelocityX, since paddle is static
        } else if (paddle.x + halfWidth > this.scene.scale.width) {
            paddle.setPosition(this.scene.scale.width - halfWidth, paddle.y);
            // No setVelocityX, since paddle is static
        }
    }

    // Random color log function for ball respawn
    randomBallColorLog() {
        const colors = ['i am red', 'i am blue', 'i am green'];
        const choice = colors[Math.floor(Math.random() * colors.length)];
        console.log(choice);
    }

    // Log on paddle hit and emit particles
    onPaddleHit() {
        console.log('hit');
        // let textureKey = this.scene.textures.exists('thief') ? 'thief' : 'white';
        // const manager = this.scene.add.particles(this.ball.x, this.ball.y, textureKey, {
        //     lifespan: 500,
        //     speed: { min: 50, max: 100 },
        //     angle: { min: 0, max: 360 },
        //     scale: { start: 0.2, end: 0 },
        //     alpha: { start: 1, end: 0 },
        //     quantity: 5
        // });
        // this.scene.time.delayedCall(1000, () => manager.destroy());
    }

    showCountdown(callback) {
        let count = 3;
        const text = this.scene.add.text(this.playerPaddle.x, this.playerPaddle.y - 400, count, {
            fontSize: '96px', color: '#000', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(103);
        const timer = this.scene.time.addEvent({
            delay: 700,
            repeat: 4,
            callback: () => {
                if (count > 0) {
                    text.setText(count);
                    count--;
                } else if (count === 0) {
                    text.setText('Go!');
                    count--;
                } else {
                    text.destroy();
                    timer.remove();
                    if (callback) callback();
                }
            }
        });
    }



    createTrailTexture() {
        // Create a small white circle graphic and generate a texture
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(8, 8, 8); // x, y, radius
        graphics.generateTexture('ballTrail', 16, 16);
        graphics.destroy();
    }

    createTrailEmitter() {
        // Use the generated 'ballTrail' texture for the trail
        this.trailParticles = this.scene.add.particles(0, 0, 'ballTrail', {
            lifespan: 300,
            speed: { min: 10, max: 30 },
            scale: { start: 3, end: 0 },
            angle: { min: 0, max: 180 },
            alpha: { start: 1, end: 0 },
            quantity: 5,
            frequency: 0
        });

        this.trailParticles.setDepth(-100)
     //   this.trailParticles.blendMode = 'ADD';

        this.trailParticles.startFollow(this.ball);
    }

    createTimer() {
        this.timerValue = 0;
       // this.timerText = this.scene.add.text(300, 400, '0', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
     
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            repeat: 29, // 0 to 30 seconds (30 ticks)
            callback: () => {
                this.timerValue++;
              //this.timerText.setText(this.timerValue);
                if (this.timerValue === 27) {
                    this.stopGameAndShowResult();
                }
            }
        });
    }

    stopGameAndShowResult() {
        this.isPlaying = false;
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        let message = '';
        if (this.scorePlayer > this.scoreAI) {
            message = 'Great Tong! You Won';
            this.scene.klikGameOver("win", 3)
        } else {
            message = 'loose tong You Lost';
            this.scene.klikGameOver("lose", 3)
        }
        this.resultText = this.scene.add.text(
            this.playerPaddle.x,
            this.scene.scale.height /  2 + 100,
            message,
            { fontSize: '48px', color: '#ff0', fontStyle: 'bold' }
        ).setOrigin(0.5);
    }
}

data.targets[2].setDepth(16)

this.myPong = new pingPong(this, this.scale.width / 2, this.scale.height / 2, data.targets[1], data.targets[0], data.targets[2]);


// ### Create: Active End ###
// ### Create: Deactivate Start ###



// ### Create: Deactivate End ###
// ### Update: Active Start ###



// ### Update: Active End ###
// ### Update: Deactivate Start ###



// ### Update: Deactivate End ###






*/