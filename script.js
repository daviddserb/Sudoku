const grid = document.getElementById("grid");
const gameStatus = document.getElementById("gameStatus")
const width = 9, height = width;

var squaresMatrix = Array(9).fill().map(() => Array(9).fill());
var cntTableBuildError = 0;
var won = false; // Will be true when the player finished/won the game
var nrTries = 0; // Will check if the player won the game only after some input tries

function generateBoard() {
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      var square = document.createElement("textarea");
      square.setAttribute("id", line + "" + col);

      squaresMatrix[line][col] = square;
      grid.appendChild(square); // Add the square to the board

      if (line == 2 || line == 5) { // Matrix delimitation (horizontal)
       square.style.borderBottom = "3px solid";
      }
      if (col != 0 && col % 3 == 0) { // Matrix delimitation (vertical)
        square.style.borderLeft = "3px solid";
      }

      square.addEventListener("input", function() {
        validateNumericInput(square);
      });

      square.addEventListener("click", function() {
        clickInputSquare(line, col);
      });
    }
  }
  addNumbers();
  hideNumbers();
}

function addNumbers() {
  // Build entire Sudoku table following Sudoku's rules
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      let randomVal = Math.floor(Math.random() * 9) + 1;
      if (checkSudokuRules(line, col, randomVal)) {
        squaresMatrix[line][col].innerHTML = randomVal;
      } else { // When the random value for the square is not good => check all posibilities from 1 to 9
        let valueNotGood = "yes", tryAllValues = 1;
        while (valueNotGood == "yes" && tryAllValues < 10) {
          if (checkSudokuRules(line, col, tryAllValues)) {
            valueNotGood = "no";
            squaresMatrix[line][col].innerHTML = tryAllValues;
          } else {
            ++tryAllValues;
          }
        }

        // When no number [1, 9] is good in the square (extreme case) => delete the entire line and repeat the process from the start of that line
        if (tryAllValues == 10 && valueNotGood == "yes") {
          ++cntTableBuildError;
          for (let colStart = 0; colStart <= col; ++colStart) {
            squaresMatrix[line][colStart].innerHTML = "";
          }
          col = -1;
        }
        // When the table doesn't properly generate (extreme case) => refresh page to don't encounter bugs
        if (cntTableBuildError == 2000) {
          location.reload();
          break;
        }
      }
    }
  }
}

function checkSudokuRules(lineNr, colNr, valNr) {
  if (!(1 <= valNr && valNr <= 9)) return false;

  // Check the 9x9 matrix line
  for (let colMatrix = 0; colMatrix < width; ++colMatrix) {
    if (valNr == squaresMatrix[lineNr][colMatrix].innerHTML && colNr != colMatrix) { //
      return false;
    }
  }

  // Check the 9x9 matrix column
  for (let lineMatrix = 0; lineMatrix < height; ++lineMatrix) {
    if (valNr == squaresMatrix[lineMatrix][colNr].innerHTML && lineNr != lineMatrix) { //
      return false;
    }
  }

  // Check the 3x3 matrix
  let startLine3x3Matrix = Math.floor(lineNr / 3) * 3;
  let startCol3x3Matrix = Math.floor(colNr / 3) * 3;
  for (let i = startLine3x3Matrix; i < startLine3x3Matrix + 3; ++i) {
    for (let j = startCol3x3Matrix; j < startCol3x3Matrix + 3; ++j) {
      if (valNr == squaresMatrix[i][j].innerHTML && lineNr != i && colNr != j) { //
        return false;
      }
    }
  }
  return true;
}

function hideNumbers() {
  // After the entire sudoku board has been built, then must 'hide' X numbers from random and different positions
  let numbersToHide = 30;
  while (numbersToHide != 0) {
    let line = Math.floor(Math.random() * 9);
    let column = Math.floor(Math.random() * 9);
    if (squaresMatrix[line][column].innerHTML != "") {
      squaresMatrix[line][column].innerHTML = "";
      --numbersToHide;
    }
  }
  createEditableSquares();
}

function createEditableSquares() {
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      if (squaresMatrix[line][col].innerHTML != "") {
        squaresMatrix[line][col].setAttribute("readonly", true);
      }
    }
  }
}

function clickInputSquare(line, col) {
  if (won) return;

  if (!squaresMatrix[line][col].readOnly) {
    ++nrTries;
    let inputDigit = squaresMatrix[line][col].value;

    if (checkSudokuRules(line, col, inputDigit)) {
      gameStatus.innerHTML = "Good number.";
      gameStatus.style.color = "green";
      squaresMatrix[line][col].innerHTML = inputDigit;
    } else {
      if (inputDigit != "") {
        gameStatus.innerHTML = "Bad number.";
        gameStatus.style.color = "red";
        squaresMatrix[line][col].innerHTML = "wrong"; // Mark the user's input value as 'wrong' if it doesn't respect Sudoku rules
      } else { // When user clicks the square or deletes value from square
        squaresMatrix[line][col].innerHTML = "";
        gameStatus.innerHTML = "";
      }
    }
  }

  if (nrTries >= 30) checkIfWin();
}

function checkIfWin() {
  let cnt = 0;
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      if (squaresMatrix[i][j].innerHTML != "wrong" && squaresMatrix[i][j].innerHTML != "") {
        ++cnt;
      }
    }
  }
  if (cnt == 81) {
    won = true;
    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        squaresMatrix[i][j].setAttribute("readonly", true);
      }
    }
    document.getElementById("gameStatus").innerHTML = "CONGRATULATIONS! YOU WON!";
  }
}

generateBoard();
