/**
 * ai.js
 * Manages the AI player behavior and decision making
 */

class AIPlayer {
    constructor(difficulty = CONSTANTS.DIFFICULTY.MEDIUM) {
        this.difficulty = difficulty;
    }
    
    /**
     * Sets the AI difficulty level
     */
    setDifficulty(level) {
        this.difficulty = level;
    }
    
    /**
     * Gets the current difficulty level
     */
    getDifficulty() {
        return this.difficulty;
    }
    
    /**
     * Makes the AI's move using the minimax algorithm
     * Returns the best move as [row, col] or null if no moves available
     */
    async makeMove(board) {
        // Simulate thinking time for better UX
        await this.simulateThinking();
        
        // Use minimax algorithm to find the best move
        const bestMove = MinimaxAlgorithm.findBestMove(board, this.difficulty);
        
        return bestMove;
    }
    
    /**
     * Simulates AI thinking time
     */
    async simulateThinking() {
        return new Promise(resolve => {
            setTimeout(resolve, CONSTANTS.ANIMATION.AI_THINKING);
        });
    }
    
    /**
     * Checks if AI can make a move
     */
    canMove(board) {
        const validMoves = board.getValidMoves(CONSTANTS.AI);
        return validMoves.length > 0;
    }
}
