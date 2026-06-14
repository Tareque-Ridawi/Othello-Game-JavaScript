/**
 * board.js
 * Handles board state, move validation, and game rules
 */

class Board {
    constructor() {
        this.grid = this.createEmptyBoard();
        this.initializeStartingPosition();
    }
    
    /**
     * Creates an empty 8x8 board
     */
    createEmptyBoard() {
        return Array(CONSTANTS.BOARD_SIZE)
            .fill(null)
            .map(() => Array(CONSTANTS.BOARD_SIZE).fill(null));
    }
    
    /**
     * Sets up the initial 4 pieces in the center
     */
    initializeStartingPosition() {
        const mid = CONSTANTS.BOARD_SIZE / 2;
        this.grid[mid - 1][mid - 1] = CONSTANTS.AI;
        this.grid[mid - 1][mid] = CONSTANTS.PLAYER;
        this.grid[mid][mid - 1] = CONSTANTS.PLAYER;
        this.grid[mid][mid] = CONSTANTS.AI;
    }
    
    /**
     * Checks if a position is within board boundaries
     */
    isValidPosition(row, col) {
        return row >= 0 && row < CONSTANTS.BOARD_SIZE && 
               col >= 0 && col < CONSTANTS.BOARD_SIZE;
    }
    
    /**
     * Gets the piece at a specific position
     */
    getPiece(row, col) {
        if (!this.isValidPosition(row, col)) return null;
        return this.grid[row][col];
    }
    
    /**
     * Sets a piece at a specific position
     */
    setPiece(row, col, player) {
        if (this.isValidPosition(row, col)) {
            this.grid[row][col] = player;
        }
    }
    
    /**
     * Checks if a move is valid for a given player
     */
    isValidMove(row, col, player) {
        // Cell must be empty
        if (this.grid[row][col] !== null) return false;
        
        const opponent = this.getOpponent(player);
        let hasFlip = false;
        
        // Check all 8 directions
        for (let [dx, dy] of CONSTANTS.DIRECTIONS) {
            let x = row + dx;
            let y = col + dy;
            let foundOpponent = false;
            
            // Move in this direction
            while (this.isValidPosition(x, y)) {
                const piece = this.grid[x][y];
                
                if (piece === null) break;
                
                if (piece === opponent) {
                    foundOpponent = true;
                } else if (piece === player) {
                    if (foundOpponent) {
                        hasFlip = true;
                        break;
                    }
                    break;
                }
                
                x += dx;
                y += dy;
            }
            
            if (hasFlip) break;
        }
        
        return hasFlip;
    }
    
    /**
     * Gets all valid moves for a player
     */
    getValidMoves(player) {
        const moves = [];
        
        for (let row = 0; row < CONSTANTS.BOARD_SIZE; row++) {
            for (let col = 0; col < CONSTANTS.BOARD_SIZE; col++) {
                if (this.isValidMove(row, col, player)) {
                    moves.push([row, col]);
                }
            }
        }
        
        return moves;
    }
    
    /**
     * Makes a move and flips the appropriate pieces
     * Returns an array of flipped positions
     */
    makeMove(row, col, player) {
        if (!this.isValidMove(row, col, player)) {
            return [];
        }
        
        const opponent = this.getOpponent(player);
        const toFlip = [];
        
        // Check all 8 directions for pieces to flip
        for (let [dx, dy] of CONSTANTS.DIRECTIONS) {
            let x = row + dx;
            let y = col + dy;
            const path = [];
            
            while (this.isValidPosition(x, y)) {
                const piece = this.grid[x][y];
                
                if (piece === null) break;
                
                if (piece === opponent) {
                    path.push([x, y]);
                } else if (piece === player) {
                    // Found our piece - flip all in path
                    toFlip.push(...path);
                    break;
                }
                
                x += dx;
                y += dy;
            }
        }
        
        // Place the new piece
        this.grid[row][col] = player;
        
        // Flip all captured pieces
        for (let [r, c] of toFlip) {
            this.grid[r][c] = player;
        }
        
        return toFlip;
    }
    
    /**
     * Counts pieces for each player
     */
    getScore() {
        let black = 0;
        let white = 0;
        
        for (let row = 0; row < CONSTANTS.BOARD_SIZE; row++) {
            for (let col = 0; col < CONSTANTS.BOARD_SIZE; col++) {
                if (this.grid[row][col] === CONSTANTS.PLAYER) {
                    black++;
                } else if (this.grid[row][col] === CONSTANTS.AI) {
                    white++;
                }
            }
        }
        
        return { black, white };
    }
    
    /**
     * Creates a deep copy of the board
     */
    copy() {
        const newBoard = new Board();
        newBoard.grid = this.grid.map(row => [...row]);
        return newBoard;
    }
    
    /**
     * Gets the opponent of a player
     */
    getOpponent(player) {
        return player === CONSTANTS.PLAYER ? CONSTANTS.AI : CONSTANTS.PLAYER;
    }
    
    /**
     * Resets the board to initial state
     */
    reset() {
        this.grid = this.createEmptyBoard();
        this.initializeStartingPosition();
    }
}
