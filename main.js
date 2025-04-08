import * as THREE from 'three';
import { GameExperience } from './GameExperience.js';

class Game {
    constructor() {
        // Show loading screen
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        
        // Initialize game
        this.gameExperience = new GameExperience();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 