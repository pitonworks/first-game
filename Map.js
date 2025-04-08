import * as THREE from 'three';

export class Map {
    constructor(scene) {
        this.scene = scene;
        this.createGround();
        this.createSky();
    }

    createGround() {
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2ecc71,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        
        this.scene.add(ground);
    }

    createSky() {
        // Create sky
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        
        this.scene.add(sky);
    }
} 