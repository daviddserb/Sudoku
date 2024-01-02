const GRID = document.getElementById("grid");
const GRID_SIZE = 9;
const GAME_STATUS = document.getElementById("gameStatus")
const SUDOKU_GRID = Array(9).fill().map(() => Array(9).fill());

var isGameWon = false;
var cntSudokuGridBuildError = 0;

function startGame() {
    generateSudokuBoard();
    addNumbersInSudokuBoard();
    hideNumbersInSudokuBoard();
    createEditableSquares();
}

function generateSudokuBoard() {
    for (let row = 0; row < GRID_SIZE; ++row) {
        for (let col = 0; col < GRID_SIZE; ++col) {
            var square = document.createElement("textarea");
            square.setAttribute("id", row + "" + col);
            SUDOKU_GRID[row][col] = square;
            GRID.appendChild(square); // Add the square to the board

            // Matrix delimitation (horizontal)
            if (row != 0 && row % 3 == 0) square.style.borderTop = "3px solid";

            // Matrix delimitation (vertical)
            if (col != 0 && col % (GRID_SIZE / 3) == 0) square.style.borderLeft = "3px solid";

            square.addEventListener("click", function() {
                clickInputSquare(row, col);
            });
        }
    }
}

// Add the numbers in Sudoku board following Sudoku's rules
function addNumbersInSudokuBoard() {
    for (let row = 0; row < GRID_SIZE; ++row) {
        for (let col = 0; col < GRID_SIZE; ++col) {
            let randomDigit = Math.floor(Math.random() * 9) + 1;

            // If the digit respects Sudoku's rules => save it
            if (isDigitValidForSudoku(row, col, randomDigit)) {
                SUDOKU_GRID[row][col].innerHTML = randomDigit;
            } else { // If not, check all digits from [1, 9]
                let firstDigit = 1;
                const INVALID_NUMBER = 10;

                while (firstDigit < 10) {
                    if (isDigitValidForSudoku(row, col, firstDigit)) {
                        SUDOKU_GRID[row][col].innerHTML = firstDigit;
                        break;
                    } else {
                        ++firstDigit;
                    }
                }

                // When no digit between [1, 9] is good in the square (extreme case) => delete the entire row and repeat the process from the start of that row
                if (firstDigit == INVALID_NUMBER) {
                    for (let c = 0; c <= col; ++c) {
                        SUDOKU_GRID[row][c].innerHTML = "";
                    }
                    col = -1;
                    ++cntSudokuGridBuildError;
                }

                // When the table doesn't properly generate (extreme case) => refresh page to don't encounter bugs
                // 2000 represents how many times all the digits between [1, 9] didn't fit the square so we restored the entire row
                if (cntSudokuGridBuildError == 2000) {
                    location.reload();
                    break;
                }
            }
        }
    }
}

function isDigitValidForSudoku(row, col, digit) {
    if (!(1 <= digit && digit <= 9)) return false;

    // Check the 9x9 matrix's line excluding the position of the new digit
    for (let bigCol = 0; bigCol < GRID_SIZE; ++bigCol) {
        if (digit == SUDOKU_GRID[row][bigCol].innerHTML && col != bigCol) return false;
    }

    // Check the 9x9 matrix's column excluding the position of the new digit
    for (let bigRow = 0; bigRow < GRID_SIZE; ++bigRow) {
        if (digit == SUDOKU_GRID[bigRow][col].innerHTML && row != bigRow) return false;
    }

    // Check the 3x3 matrix excluding the position of the new digit
    let smallRow = Math.floor(row / 3) * 3;
    let smallCol = Math.floor(col / 3) * 3;
    for (let r = smallRow; r < smallRow + 3; ++r) {
        for (let c = smallCol; c < smallCol + 3; ++c) {
            if (digit == SUDOKU_GRID[r][c].innerHTML && row != r && col != c) return false;
        }
    }

    return true;
}

// After the entire Sudoku grid has been built, then we must 'hide' CNT_NUMBERS_TO_HIDE amount of numbers from random and different positions
function hideNumbersInSudokuBoard() {
    const SUDOKU_GRID_POSITIONS = [];
    const CNT_NUMBERS_TO_HIDE = 15;

    // Create an array of all possible positions in the grid
    for (let row = 0; row < GRID_SIZE; ++row) {
        for (let col = 0; col < GRID_SIZE; ++col) {
            SUDOKU_GRID_POSITIONS.push({ row, col });
        }
    }

    const SUDOKU_GRID_POSITIONS_SHUFFLED = SUDOKU_GRID_POSITIONS.sort(() => Math.random() - 0.5);

    // Hide the first CNT_NUMBERS_TO_HIDE positions
    for (let pos = 0; pos < CNT_NUMBERS_TO_HIDE; ++pos) {
        const { row, col } = SUDOKU_GRID_POSITIONS_SHUFFLED[pos];
        SUDOKU_GRID[row][col].innerHTML = "";
    }
}

function createEditableSquares() {
    for (let row = 0; row < GRID_SIZE; ++row) {
        for (let col = 0; col < GRID_SIZE; ++col) {
            if (SUDOKU_GRID[row][col].innerHTML != "") SUDOKU_GRID[row][col].setAttribute("readonly", true);
        }
    }
}

function clickInputSquare(row, col) {
    if (isGameWon || SUDOKU_GRID[row][col].readOnly) return;

    let inputDigit = SUDOKU_GRID[row][col].value;

    if (isDigitValidForSudoku(row, col, inputDigit)) {
        GAME_STATUS.innerHTML = "Good number.";
        GAME_STATUS.style.color = "green";
        SUDOKU_GRID[row][col].innerHTML = inputDigit;
    } else {
        if (inputDigit != "") {
            GAME_STATUS.innerHTML = "Bad number.";
            GAME_STATUS.style.color = "red";
            SUDOKU_GRID[row][col].innerHTML = "wrong"; // Mark the user's input value as 'wrong' if it doesn't respect Sudoku rules
        } else { // When user first time left-clicks the square or deletes the value from a square
            SUDOKU_GRID[row][col].innerHTML = "";
            GAME_STATUS.innerHTML = "";
        }
    }

    checkIfGameWon();
}

function checkIfGameWon() {
    let cntGoodDigits = 0;

    for (let row = 0; row < GRID_SIZE; ++row) {
        for (let col = 0; col < GRID_SIZE; ++col) {
            if (SUDOKU_GRID[row][col].innerHTML != "wrong" && SUDOKU_GRID[row][col].innerHTML != "") {
                ++cntGoodDigits;
            }
        }
    }

    if (cntGoodDigits == GRID_SIZE * GRID_SIZE) {
        for (let row = 0; row < GRID_SIZE; ++row) {
            for (let col = 0; col < GRID_SIZE; ++col) {
                SUDOKU_GRID[row][col].setAttribute("readonly", true);
            }
        }
        isGameWon = true;
        GAME_STATUS.innerHTML = "CONGRATULATIONS! YOU WON!";
    }
}

startGame();
