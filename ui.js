/**
 * ui.js
 * Handles all UI rendering, animations, and DOM manipulation
 */

class UI {
    constructor() {
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.playerScoreElement = document.getElementById('playerScore');
        this.aiScoreElement = document.getElementById('aiScore');
        this.playerPanelElement = document.getElementById('playerPanel');
        this.aiPanelElement = document.getElementById('aiPanel');
    }
    
    /**
     * Renders the entire game board
     */
    renderBoard(board, currentPlayer, validMoves) {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < CONSTANTS.BOARD_SIZE; row++) {
            for (let col = 0; col < CONSTANTS.BOARD_SIZE; col++) {
                const cell = this.createCell(row, col, board, currentPlayer, validMoves);
                this.boardElement.appendChild(cell);
            }
        }
    }
    
    /**
     * Creates a single cell element
     */
    createCell(row, col, board, currentPlayer, validMoves) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Add piece if present
        const piece = board.getPiece(row, col);
        if (piece) {
            const disc = this.createDisc(piece);
            cell.appendChild(disc);
        }
        
        // Highlight valid moves for player
        if (currentPlayer === CONSTANTS.PLAYER) {
            const isValid = validMoves.some(([r, c]) => r === row && c === col);
            if (isValid) {
                cell.classList.add('valid');
            }
        }
        
        return cell;
    }
    
    /**
     * Creates a disc element
     */
    createDisc(player, animate = false) {
        const disc = document.createElement('div');
        disc.className = `disc ${player}`;
        if (animate) {
            disc.classList.add('placing');
        }
        return disc;
    }
    
    /**
     * Animates placing a new piece
     */
    animatePlacement(row, col, player) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        const disc = this.createDisc(player, true);
        cell.appendChild(disc);
    }
    
    /**
     * Animates flipping pieces
     */
    animateFlips(flippedPositions, player) {
        flippedPositions.forEach(([row, col], index) => {
            setTimeout(() => {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (!cell) return;
                
                const disc = cell.querySelector('.disc');
                if (!disc) return;
                
                // Add flipping animation
                disc.classList.add('flipping');
                
                // After animation, update the disc class
                setTimeout(() => {
                    disc.className = `disc ${player}`;
                }, 600);
                
            }, index * CONSTANTS.ANIMATION.PIECE_FLIP);
        });
    }
    
    /**
     * Updates the score display
     */
    updateScore(board) {
        const scores = board.getScore();
        this.playerScoreElement.textContent = scores.black;
        this.aiScoreElement.textContent = scores.white;
    }
    
    /**
     * Updates the status message
     */
    updateStatus(message) {
        this.statusElement.textContent = message;
    }
    
    /**
     * Highlights the current player's panel
     */
    highlightCurrentPlayer(player) {
        if (player === CONSTANTS.PLAYER) {
            this.playerPanelElement.classList.add('active');
            this.aiPanelElement.classList.remove('active');
        } else {
            this.playerPanelElement.classList.remove('active');
            this.aiPanelElement.classList.add('active');
        }
    }
    
    /**
     * Updates the entire UI
     */
    update(board, currentPlayer, gameOver) {
        this.updateScore(board);
        this.highlightCurrentPlayer(currentPlayer);
        
        if (!gameOver) {
            const statusMessage = currentPlayer === CONSTANTS.PLAYER ? 'Your Turn' : 'AI\'s Turn';
            this.updateStatus(statusMessage);
        }
        
        const validMoves = board.getValidMoves(currentPlayer);
        this.renderBoard(board, currentPlayer, validMoves);
    }
    
    /**
     * Shows the game over message
     */
    showGameOver(board) {
        const scores = board.getScore();
        let message;
        
        if (scores.black > scores.white) {
            message = '🎉 You Win! 🎉';
        } else if (scores.white > scores.black) {
            message = '🤖 AI Wins! 🤖';
        } else {
            message = '🤝 Draw! 🤝';
        }
        
        this.updateStatus(message);
    }
    
    /**
     * Updates difficulty button active state
     */
    updateDifficultyButtons(activeLevel) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            const level = parseInt(btn.dataset.level);
            if (level === activeLevel) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}
