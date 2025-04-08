import * as THREE from 'three';
import { Airplane } from './Airplane.js';
import { Map } from './Map.js';
import { Network } from './Network.js';

export class GameExperience {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.setupLoadingScreen();
        
        // Initialize Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        
        // Initialize game components
        this.airplane = new Airplane(this.scene);
        this.map = new Map(this.scene);
        
        // Initialize network (will handle missing credentials gracefully)
        this.network = new Network();
        
        this.setupEventListeners();
        
        // Start the game loop
        this.animate();
        
        // Hide loading screen after everything is initialized
        this.hideLoadingScreen();
    }

    setupLoadingScreen() {
        this.loadingScreen.innerHTML = '<h1>Loading Game...</h1>';
    }

    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('game-container').appendChild(this.renderer.domElement);
    }

    setupCamera() {
        // Set initial camera position
        this.cameraOffset = new THREE.Vector3(0, 5, 10);
        this.camera.position.copy(this.airplane.position).add(this.cameraOffset);
        this.camera.lookAt(this.airplane.position);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateCamera() {
        // Calculate camera position based on airplane's position and rotation
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(this.airplane.position);
        
        // Add offset based on airplane's rotation
        const offset = this.cameraOffset.clone();
        offset.applyEuler(this.airplane.rotation);
        cameraPosition.add(offset);
        
        // Smoothly move camera to new position
        this.camera.position.lerp(cameraPosition, 0.1);
        this.camera.lookAt(this.airplane.position);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.airplane.update();
        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
    }
} 