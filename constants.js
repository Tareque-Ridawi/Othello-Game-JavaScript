/**
 * constants.js
 * Contains all game constants and configuration values
 */

const CONSTANTS = {
    // Board dimensions
    BOARD_SIZE: 8,
    
    // Players
    PLAYER: 'black',
    AI: 'white',
    
    // Directions for checking valid moves (8 directions)
    DIRECTIONS: [
        [-1, -1], [-1, 0], [-1, 1],  // Top-left, Top, Top-right
        [0, -1],           [0, 1],    // Left, Right
        [1, -1],  [1, 0],  [1, 1]     // Bottom-left, Bottom, Bottom-right
    ],
    
    // Position weights for board evaluation (used in minimax)
    // Corners are most valuable, edges are good, positions next to corners are bad
    POSITION_WEIGHTS: [
        [100, -20, 10, 5, 5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10, 5, 5, 10, -20, 100]
    ],
    
    // AI difficulty levels (minimax depth)
    DIFFICULTY: {
        EASY: 2,
        MEDIUM: 4,
        HARD: 6,
        EXPERT: 8
    },
    
    // Animation delays (in milliseconds)
    ANIMATION: {
        PIECE_PLACE: 100,
        PIECE_FLIP: 50,
        TOTAL_MOVE: 700,
        AI_THINKING: 300,
        AI_DELAY: 500,
        PASS_DELAY: 1000
    },
    
    // Scoring weights for evaluation
    EVALUATION: {
        MOBILITY_WEIGHT: 5,  // Weight for number of valid moves
    }
};

// Freeze the object to prevent modifications
Object.freeze(CONSTANTS);
Object.freeze(CONSTANTS.DIRECTIONS);
Object.freeze(CONSTANTS.POSITION_WEIGHTS);
Object.freeze(CONSTANTS.DIFFICULTY);
Object.freeze(CONSTANTS.ANIMATION);
Object.freeze(CONSTANTS.EVALUATION);
