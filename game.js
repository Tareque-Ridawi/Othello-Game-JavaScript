/**
 * game.js
 * Main game controller that manages game state and flow
 */

class ReversiGame {
    constructor() {
        this.board = new Board();
        this.ai = new AIPlayer(CONSTANTS.DIFFICULTY.MEDIUM);
        this.ui = new UI();
        this.currentPlayer = CONSTANTS.PLAYER;
        this.gameOver = false;
        this.animating = false;
        
        this.setupEventListeners();
        this.ui.update(this.board, this.currentPlayer, this.gameOver);
    }
    
    /**
     * Sets up event listeners for user interactions
     */
    setupEventListeners() {
        // Cell click handler using event delegation
        this.ui.boardElement.addEventListener('click', (event) => {
            const cell = event.target.closest('.cell');
            if (cell) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.handlePlayerMove(row, col);
            }
        });
    }
    
    /**
     * Handles a player's move attempt
     */
    async handlePlayerMove(row, col) {
        // Prevent moves during animation, when game is over, or when it's not player's turn
        if (this.animating || this.gameOver || this.currentPlayer !== CONSTANTS.PLAYER) {
            return;
        }
        
        // Check if move is valid
        if (!this.board.isValidMove(row, col, CONSTANTS.PLAYER)) {
            return;
        }
        
        this.animating = true;
        
        // Make the move and get flipped pieces
        const flippedPieces = this.board.makeMove(row, col, CONSTANTS.PLAYER);
        
        // Animate the move
        this.ui.animatePlacement(row, col, CONSTANTS.PLAYER);
        
        setTimeout(() => {
            this.ui.animateFlips(flippedPieces, CONSTANTS.PLAYER);
        }, CONSTANTS.ANIMATION.PIECE_PLACE);
        
        // Switch to AI's turn
        this.currentPlayer = CONSTANTS.AI;
        
        // Wait for animations to complete
        setTimeout(() => {
            this.ui.update(this.board, this.currentPlayer, this.gameOver);
            this.animating = false;
            
            // Check if game ended or continue with AI turn
            if (!this.checkGameEnd()) {
                setTimeout(() => this.handleAIMove(), CONSTANTS.ANIMATION.AI_DELAY);
            }
        }, CONSTANTS.ANIMATION.TOTAL_MOVE);
    }
    
    /**
     * Handles the AI's move
     */
    async handleAIMove() {
        if (this.animating || this.gameOver) return;
        
        this.animating = true;
        this.ui.updateStatus('AI is thinking...');
        
        // Get the best move from AI
        const move = await this.ai.makeMove(this.board);
        
        if (move === null) {
            // AI has no valid moves - pass turn back to player
            this.currentPlayer = CONSTANTS.PLAYER;
            this.animating = false;
            this.ui.update(this.board, this.currentPlayer, this.gameOver);
            this.checkGameEnd();
            return;
        }
        
        const [row, col] = move;
        
        // Make the move and get flipped pieces
        const flippedPieces = this.board.makeMove(row, col, CONSTANTS.AI);
        
        // Animate the move
        this.ui.animatePlacement(row, col, CONSTANTS.AI);
        
        setTimeout(() => {
            this.ui.animateFlips(flippedPieces, CONSTANTS.AI);
        }, CONSTANTS.ANIMATION.PIECE_PLACE);
        
        // Switch back to player's turn
        this.currentPlayer = CONSTANTS.PLAYER;
        
        // Wait for animations to complete
        setTimeout(() => {
            this.ui.update(this.board, this.currentPlayer, this.gameOver);
            this.animating = false;
            this.checkGameEnd();
        }, CONSTANTS.ANIMATION.TOTAL_MOVE);
    }
    
    /**
     * Checks if the game has ended
     */
    checkGameEnd() {
        const playerMoves = this.board.getValidMoves(CONSTANTS.PLAYER);
        const aiMoves = this.board.getValidMoves(CONSTANTS.AI);
        
        // Game ends when both players have no valid moves
        if (playerMoves.length === 0 && aiMoves.length === 0) {
            this.gameOver = true;
            this.ui.showGameOver(this.board);
            return true;
        }
        
        // Handle pass situations
        if (playerMoves.length === 0 && this.currentPlayer === CONSTANTS.PLAYER) {
            this.currentPlayer = CONSTANTS.AI;
            this.ui.updateStatus('No valid moves - AI\'s turn');
            setTimeout(() => this.handleAIMove(), CONSTANTS.ANIMATION.PASS_DELAY);
            return true;
        }
        
        if (aiMoves.length === 0 && this.currentPlayer === CONSTANTS.AI) {
            this.currentPlayer = CONSTANTS.PLAYER;
            this.ui.updateStatus('AI has no moves - Your turn');
            this.ui.update(this.board, this.currentPlayer, this.gameOver);
            return true;
        }
        
        return false;
    }
    
    /**
     * Starts a new game
     */
    newGame() {
        this.board.reset();
        this.currentPlayer = CONSTANTS.PLAYER;
        this.gameOver = false;
        this.animating = false;
        this.ui.update(this.board, this.currentPlayer, this.gameOver);
    }
    
    /**
     * Sets the AI difficulty
     */
    setDifficulty(level) {
        this.ai.setDifficulty(level);
        this.ui.updateDifficultyButtons(level);
    }
}
