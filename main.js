import * as THREE from 'three';
import { GameExperience } from './GameExperience.js';

class Game {
    constructor() {
        this.gameExperience = new GameExperience();
        this.init();
    }

    init() {
        // Hide loading screen when game is ready
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 