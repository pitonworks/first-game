import * as THREE from 'three';
import { Projectile } from './Projectile.js';

export class Airplane {
    constructor(scene) {
        this.scene = scene;
        this.speed = 0.2;
        this.rotationSpeed = 0.03;
        this.maxSpeed = 1.0;
        this.minSpeed = 0.1;
        this.acceleration = 0.01;
        this.deceleration = 0.005;
        this.currentSpeed = 0.1;
        this.position = new THREE.Vector3(0, 2, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.health = 100;
        this.score = 0;
        
        // Projectile properties
        this.projectiles = [];
        this.lastShotTime = 0;
        this.shootingCooldown = 250; // milliseconds between shots
        
        this.createModel();
        this.setupControls();
    }

    createModel() {
        // Create airplane body
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3498db });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.rotation.x = Math.PI / 2;
        
        // Create wings
        const wingGeometry = new THREE.BoxGeometry(3, 0.1, 0.5);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x2980b9 });
        this.wings = new THREE.Mesh(wingGeometry, wingMaterial);
        
        // Create tail
        const tailGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const tailMaterial = new THREE.MeshPhongMaterial({ color: 0x2980b9 });
        this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
        this.tail.position.set(0, 0, -1);

        // Create gun positions
        this.gunOffsets = [
            new THREE.Vector3(-1, 0, 1), // Left wing
            new THREE.Vector3(1, 0, 1)   // Right wing
        ];
        
        // Group all parts
        this.mesh = new THREE.Group();
        this.mesh.add(this.body);
        this.mesh.add(this.wings);
        this.mesh.add(this.tail);
        
        this.scene.add(this.mesh);
    }

    setupControls() {
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            q: false, // Roll left
            e: false, // Roll right
            shift: false, // Speed up
            ctrl: false, // Slow down
            space: false // Shoot
        };

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key === ' ') {
            this.keys.space = true;
        } else if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = true;
        }
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();
        if (key === ' ') {
            this.keys.space = false;
        } else if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = false;
        }
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < this.shootingCooldown) {
            return;
        }

        // Get shooting direction based on airplane's rotation
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(this.rotation);

        // Create projectiles from both wings
        this.gunOffsets.forEach(offset => {
            const gunPosition = this.position.clone();
            const offsetRotated = offset.clone().applyEuler(this.rotation);
            gunPosition.add(offsetRotated);
            
            const projectile = new Projectile(this.scene, gunPosition, direction);
            this.projectiles.push(projectile);
        });

        this.lastShotTime = currentTime;
    }

    update() {
        // Handle speed changes
        if (this.keys.shift) {
            this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);
        } else if (this.keys.ctrl) {
            this.currentSpeed = Math.max(this.currentSpeed - this.deceleration, this.minSpeed);
        } else {
            // Gradually return to normal speed
            if (this.currentSpeed > this.speed) {
                this.currentSpeed -= this.deceleration;
            } else if (this.currentSpeed < this.speed) {
                this.currentSpeed += this.acceleration;
            }
        }

        // Calculate movement direction based on rotation
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(this.rotation);

        // Update position based on current speed and direction
        this.velocity.copy(direction).multiplyScalar(this.currentSpeed);
        this.position.add(this.velocity);

        // Handle rotation
        if (this.keys.a) {
            this.rotation.y += this.rotationSpeed;
        }
        if (this.keys.d) {
            this.rotation.y -= this.rotationSpeed;
        }
        if (this.keys.q) {
            this.rotation.z += this.rotationSpeed;
        }
        if (this.keys.e) {
            this.rotation.z -= this.rotationSpeed;
        }

        // Handle shooting
        if (this.keys.space) {
            this.shoot();
        }

        // Update projectiles
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            if (projectile.isExpired) {
                projectile.remove();
                return false;
            }
            return true;
        });

        // Apply gravity and lift
        this.position.y -= 0.01; // Gravity
        if (this.currentSpeed > this.speed) {
            this.position.y += 0.005; // Lift when moving fast
        }

        // Keep airplane above ground
        if (this.position.y < 1) {
            this.position.y = 1;
        }

        // Update mesh position and rotation
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }

    addScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
} 