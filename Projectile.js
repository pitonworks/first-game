import * as THREE from 'three';

export class Projectile {
    constructor(scene, position, direction) {
        this.scene = scene;
        this.speed = 1;
        this.lifespan = 2000; // 2 seconds
        this.createdAt = Date.now();
        this.isExpired = false;

        // Create projectile geometry
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.direction = direction.normalize();

        // Add to scene
        this.scene.add(this.mesh);

        // Add trail effect
        this.createTrail();
    }

    createTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0xff6666,
            transparent: true,
            opacity: 0.5
        });

        const points = [
            this.mesh.position.clone(),
            this.mesh.position.clone().sub(this.direction.clone().multiplyScalar(0.5))
        ];

        trailGeometry.setFromPoints(points);
        this.trail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(this.trail);
    }

    update() {
        // Check if projectile has expired
        if (Date.now() - this.createdAt > this.lifespan) {
            this.isExpired = true;
            return;
        }

        // Update position
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));

        // Update trail
        const trailPoints = [
            this.mesh.position.clone(),
            this.mesh.position.clone().sub(this.direction.clone().multiplyScalar(0.5))
        ];
        this.trail.geometry.setFromPoints(trailPoints);
    }

    remove() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.trail);
    }

    getPosition() {
        return this.mesh.position;
    }
} 