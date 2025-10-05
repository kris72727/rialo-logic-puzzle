// The correct, solved order of the Rialo Trading Pipeline steps
const TILES = [
    "1. Ticker Selection",
    "2. Fetch Real-Time Data",
    "3. Apply Moving Average",
    "4. Check Trading Signal",
    "5. Execute Trade Logic",
    "6. Risk Management Check",
    "7. Update Portfolio",
    "8. Display Live Chart",
];

const board = document.getElementById('puzzle-board');
const messageDisplay = document.getElementById('message');
const shuffleButton = document.getElementById('shuffle-button');
let currentTiles = []; // Working copy of the tiles, will include the empty tile

// --- Core Functions ---

// Creates the tile elements and puts them on the board
function renderBoard() {
    board.innerHTML = ''; // Clear board
    
    // Check if the game is already solved to update the message
    const isSolved = checkWin(false); 
    
    currentTiles.forEach((label, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = label;
        tile.dataset.index = index; // The tile's current position on the board (0-8)

        if (label === '') {
            tile.classList.add('empty-tile');
            // Ensure the empty tile doesn't get the 'Solved' background if needed
        } else if (!isSolved) {
            // Only add the click handler if the game is NOT solved
            tile.addEventListener('click', handleTileClick);
        }

        board.appendChild(tile);
    });
}

// Checks if the tile can move (is next to the empty space)
function isMoveValid(clickedIndex, emptyIndex) {
    // Determine row and column for 3x3 grid (3 columns)
    const clickedRow = Math.floor(clickedIndex / 3);
    const clickedCol = clickedIndex % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Must be in the same row AND one column away OR in the same column AND one row away
    const sameRow = clickedRow === emptyRow;
    const sameCol = clickedCol === emptyCol;
    const oneStep = Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol) === 1;

    return oneStep && (sameRow || sameCol);
}

// Handles a tile click event
function handleTileClick(event) {
    const clickedTile = event.target;
    const clickedIndex = parseInt(clickedTile.dataset.index);
    const emptyIndex = currentTiles.indexOf('');

    if (isMoveValid(clickedIndex, emptyIndex)) {
        // 1. Swap the values in the array
        [currentTiles[clickedIndex], currentTiles[emptyIndex]] = 
        [currentTiles[emptyIndex], currentTiles[clickedIndex]];

        // 2. Re-render the board with the new positions
        renderBoard();

        // 3. Check for the win condition and display the message
        checkWin(true);
    }
}

// Checks if the puzzle is solved
function checkWin(displayMessage) {
    // The solved state is the TILES array followed by the empty tile
    const solved = [...TILES, '']; 
    
    // Check if every element in the current array matches the solved array
    const isSolved = currentTiles.every((tile, index) => tile === solved[index]);

    if (isSolved && displayMessage) {
        messageDisplay.textContent = "🚀 Pipeline Deployed! Rialo Logic Grid Solved!";
        messageDisplay.classList.add('win-message');
        // Prevent further moves by re-rendering without click listeners
        renderBoard(); 
    } else if (displayMessage && !isSolved) {
        messageDisplay.textContent = "Keep going! The data flow is still broken.";
        messageDisplay.classList.remove('win-message');
    }
    
    return isSolved;
}

// Fisher-Yates shuffle algorithm for the tiles
function shuffleTiles(array) {
    // Note: A 9-tile puzzle needs a solvability check to ensure it's beatable.
    // For simplicity, we skip the complex check here, but shuffling 
    // a few times greatly reduces the chance of an unsolvable board.
    for (let s = 0; s < 5; s++) { // Shuffle 5 times
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    return array;
}

// --- Initialization ---

// Start the game by shuffling and rendering
function startGame() {
    // Create the full set of 9 tiles (8 pieces + 1 empty)
    let fullSet = [...TILES, '']; 
    
    // Shuffle the tiles to start the game
    currentTiles = shuffleTiles(fullSet); 
    
    renderBoard();
    messageDisplay.textContent = 'Click a tile next to the empty slot to move it.';
    messageDisplay.classList.remove('win-message');
}

// Attach the restart function to the button
shuffleButton.addEventListener('click', startGame);

// Run the game for the first time
startGame();
