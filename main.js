/**
 * main.js
 * Entry point - Initializes the game when the page loads
 */

// Global game instance
let game;

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    game = new ReversiGame();
    console.log('Reversi game initialized successfully!');
    console.log('Player: Cyan (Black) | AI: Magenta (White)');
});
