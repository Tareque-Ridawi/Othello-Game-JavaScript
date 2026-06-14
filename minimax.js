/**
 * minimax.js
 * Implements the Minimax algorithm with Alpha-Beta pruning
 * This is the AI's decision-making algorithm
 */

class MinimaxAlgorithm {
    /**
     * Evaluates the board position for the AI player
     * Higher scores are better for AI (white), lower scores are better for player (black)
     */
    static evaluateBoard(board, player) {
        let score = 0;
        const opponent = board.getOpponent(player);
        
        // 1. Position-based evaluation
        // Corners and edges are valuable, positions next to corners are bad
        for (let row = 0; row < CONSTANTS.BOARD_SIZE; row++) {
            for (let col = 0; col < CONSTANTS.BOARD_SIZE; col++) {
                const piece = board.getPiece(row, col);
                const weight = CONSTANTS.POSITION_WEIGHTS[row][col];
                
                if (piece === player) {
                    score += weight;
                } else if (piece === opponent) {
                    score -= weight;
                }
            }
        }
        
        // 2. Mobility evaluation
        // Having more valid moves is advantageous
        const playerMoves = board.getValidMoves(player).length;
        const opponentMoves = board.getValidMoves(opponent).length;
        score += (playerMoves - opponentMoves) * CONSTANTS.EVALUATION.MOBILITY_WEIGHT;
        
        return score;
    }
    
    /**
     * Minimax algorithm with Alpha-Beta pruning
     * 
     * @param {Board} board - Current board state
     * @param {number} depth - How many moves ahead to look
     * @param {boolean} isMaximizing - True if maximizing (AI's turn), false if minimizing (player's turn)
     * @param {number} alpha - Alpha value for pruning
     * @param {number} beta - Beta value for pruning
     * @returns {number} - Evaluation score for this position
     */
    static minimax(board, depth, isMaximizing, alpha, beta) {
        // Determine current player
        const player = isMaximizing ? CONSTANTS.AI : CONSTANTS.PLAYER;
        const validMoves = board.getValidMoves(player);
        
        // Base case: reached depth limit or no valid moves
        if (depth === 0 || validMoves.length === 0) {
            return this.evaluateBoard(board, CONSTANTS.AI);
        }
        
        if (isMaximizing) {
            // AI's turn - maximize the score
            let maxEval = -Infinity;
            
            for (let [row, col] of validMoves) {
                // Create a copy of the board and make the move
                const boardCopy = board.copy();
                boardCopy.makeMove(row, col, player);
                
                // Recursively evaluate this move
                const evaluation = this.minimax(boardCopy, depth - 1, false, alpha, beta);
                
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                
                // Alpha-Beta pruning
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
            
            return maxEval;
            
        } else {
            // Player's turn - minimize the score
            let minEval = Infinity;
            
            for (let [row, col] of validMoves) {
                // Create a copy of the board and make the move
                const boardCopy = board.copy();
                boardCopy.makeMove(row, col, player);
                
                // Recursively evaluate this move
                const evaluation = this.minimax(boardCopy, depth - 1, true, alpha, beta);
                
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                
                // Alpha-Beta pruning
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
            
            return minEval;
        }
    }
    
    /**
     * Finds the best move for the AI using minimax
     * 
     * @param {Board} board - Current board state
     * @param {number} depth - Search depth (difficulty level)
     * @returns {Array|null} - Best move as [row, col] or null if no moves available
     */
    static findBestMove(board, depth) {
        const validMoves = board.getValidMoves(CONSTANTS.AI);
        
        if (validMoves.length === 0) {
            return null;
        }
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Evaluate each possible move
        for (let [row, col] of validMoves) {
            // Create a copy of the board and make the move
            const boardCopy = board.copy();
            boardCopy.makeMove(row, col, CONSTANTS.AI);
            
            // Run minimax from this position
            const score = this.minimax(
                boardCopy, 
                depth - 1, 
                false,          // Next turn is player's (minimizing)
                -Infinity,      // Alpha
                Infinity        // Beta
            );
            
            // Update best move if this is better
            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }
        
        return bestMove;
    }
}
