 import Phaser3D from "../libs/Phaser3D.js";

 import * as THREE from 'three';


  export class ball extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, texture) {
     
      super(scene, 'ball');

      this.scene = scene;
      this.x = x;
      this.y = y;  
      this.createBall(scene);
    

    }

    createBall(scene) {
/*
    const thief = this.scene.add.sprite(this.x, this.y, 'thief');
    thief.setScale(0.3);

    this.scene.matter.add.gameObject(thief, {
      shape: { type: 'circle', radius: 25 }, 
      restitution: 0.5, 
    });

    thief.setVelocity(50, 20)

  */       
          this.centerX = 400;
          this.centerY = 300;
          const originalRadius = 100;
          const scaleFactor = 0.50;
          const radius = originalRadius * scaleFactor; // New radius
          const particleRadius = 10 * scaleFactor;
          const totalParticles = 10;
          const outwardForce = 0.0003;
          const restoringForce = 0.0003;
          const damping = 1;

          this.particles = [];

        // Create a central particle
        const center = this.scene.matter.add.circle(this.centerX, this.centerY,  5 * scaleFactor, { isStatic: false });
        this.particles.push(center); // Add the center to particles array

        // Generate edge particles in a circular arrangement
        for (let i = 0; i < totalParticles; i++) {
          const angle = (i / totalParticles) * Math.PI * 2;
          const x = center.position.x + radius * Math.cos(angle);
          const y = center.position.y + radius * Math.sin(angle);

          const particle = this.scene.matter.add.circle(x, y, particleRadius, {
              restitution: 1,
              friction: 1,
              frictionAir: damping
          });
          this.particles.push(particle);
        }

        // Add constraints to connect the particles
        for (let i = 1; i < this.particles.length; i++) {
          const particleA = this.particles[i];
          const particleB = this.particles[(i % totalParticles) + 1];
          this.scene.matter.add.constraint(particleA, particleB, 50* scaleFactor , 1); // Edge-to-edge
          this.scene.matter.add.constraint(center, particleA, radius, 0.2); // Center-to-edge
        }


          // Apply outward and restoring forces to stabilize the ball
          this.scene.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                this.particles.forEach((particle) => {
                    const dx = particle.position.x - this.centerX;
                    const dy = particle.position.y - this.centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const normalizedX = dx / distance || 0;
                    const normalizedY = dy / distance || 0;

                    const outwardX = normalizedX * outwardForce;
                    const outwardY = normalizedY * outwardForce;

                    const inwardX = -normalizedX * restoringForce;
                    const inwardY = -normalizedY * restoringForce;

                    const forceX = outwardX + inwardX;
                    const forceY = outwardY + inwardY;

                    this.scene.matter.body.applyForce(particle, { x: particle.position.x, y: particle.position.y }, { x: forceX, y: forceY });
                });
            }
        });




        // Set up Phaser3D and create the mesh
        const phaser3d = new Phaser3D(this.scene, { fov: 35, x: 0.5, y: 0.5, z: 8.5, anisotropy: 16 });
        const circleMesh = phaser3d.add.circle({
            segments: totalParticles,
            radius: radius / 100,
            texture: 'thief',
            material: { wireframe: false, side: THREE.DoubleSide }
        });

        this.geometry = circleMesh.geometry;
         this.positions = this.geometry.attributes.position.array;

        // Update the mesh vertices to follow particle this.positions
        this.scene.time.addEvent({
            delay: 5,
            loop: true,
            callback: () => {
                      this.updateThief();
            }
        });

        // Add lighting and mouse controls
        phaser3d.add.hemisphereLight({ skyColor: 0xddeeff, groundColor: 0x808080, intensity: 2 });
        phaser3d.add.directionalLight({ intensity: 1, x: 100, y: 100, z: 100 });
       // this.scene.matter.add.mouseSpring();




    }

    updateThief() {
      let totalParticles = 10;

    // Map center particle to the center vertex of the mesh
    this.positions[0] = (this.particles[0].position.x - this.centerX+50) / 100; // Center X
    this.positions[1] = (this.particles[0].position.y - this.centerY-60) / -100; // Center Y (inverted)
    this.positions[2] = 0; // Center Z

    // Map edge particles to the outer vertices of the mesh
    for (let i = 0; i < totalParticles; i++) {
        const particle = this.particles[i + 1]; // Edge particles start from index 1
        const vertexIndex = (i + 1) * 3; // Vertex index (+1 because 0 is center)

        this.positions[vertexIndex] = (particle.position.x - this.centerX+50) / 100; // X
        this.positions[vertexIndex + 1] = (particle.position.y - this.centerY-60) / -100; // Y (inverted)
        this.positions[vertexIndex + 2] = 0; // Z
    }

    // Explicitly handle the last vertex to close the loop
    const lastParticle = this.particles[1]; // First edge particle loops to close
    const lastIndex = (totalParticles + 1) * 3;
    this.positions[lastIndex] = (lastParticle.position.x - this.centerX+50) / 100; // X
    this.positions[lastIndex + 1] = (lastParticle.position.y - this.centerY-60) / -100; // Y (inverted)
    this.positions[lastIndex + 2] = 0; // Z

    this.geometry.attributes.position.needsUpdate = true; // Refresh mesh

  }


  }