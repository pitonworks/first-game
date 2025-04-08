import * as THREE from 'three';

export class Airplane {
    constructor(scene) {
        this.scene = scene;
        this.speed = 0.1;
        this.rotationSpeed = 0.02;
        this.position = new THREE.Vector3(0, 2, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        
        this.createModel();
        this.setupControls();
    }

    createModel() {
        // Create a simple airplane model (temporary)
        const geometry = new THREE.BoxGeometry(1, 0.5, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x3498db });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.scene.add(this.mesh);
    }

    setupControls() {
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        if (this.keys.hasOwnProperty(event.key.toLowerCase())) {
            this.keys[event.key.toLowerCase()] = true;
        }
    }

    onKeyUp(event) {
        if (this.keys.hasOwnProperty(event.key.toLowerCase())) {
            this.keys[event.key.toLowerCase()] = false;
        }
    }

    update() {
        // Handle movement
        if (this.keys.w) {
            this.position.z -= this.speed;
        }
        if (this.keys.s) {
            this.position.z += this.speed;
        }
        if (this.keys.a) {
            this.rotation.y += this.rotationSpeed;
        }
        if (this.keys.d) {
            this.rotation.y -= this.rotationSpeed;
        }

        // Update mesh position and rotation
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
    }
} 