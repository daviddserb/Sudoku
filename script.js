const grid = document.getElementById("grid");
const gameStatus = document.getElementById("gameStatus")
const width = 9, height = width;
var squaresMatrix = Array(9).fill().map(() => Array(9).fill()); //will save the textarea html element and the number inside it

var cntExtremeCase = 0; //will refresh the page if an error appears when creating the board

var won = false; //will be true, when the player finished the game
var nrTries = 0; //will check if the player won the game after some tries

function generateBoard() {
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      var square = document.createElement("textarea"); //create HTML element with the "textarea" tag
      square.setAttribute("id", line + "" + col);
      squaresMatrix[line][col] = square;
      grid.appendChild(square); //add the square to the board

      if (line == 2 || line == 5) { //matrix delimitation (horizontal)
       square.style.borderBottom = "3px solid";
      }
      if (col != 0 && col % 3 == 0) { //matrix delimitation (vertical)
        square.style.borderLeft = "3px solid";
      }

      square.addEventListener("click", function() { //(! because function() => move over in the code and it's called only on click)
        clickInputSquares(line, col);
      })
    }
  }
  addNumbers();
  hideNumbers();
}

function addNumbers() {
  //build the entire sudoku board
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      let randomVal = Math.floor(Math.random() * 9) + 1;
      if (checkSudokuRules(line, col, randomVal)) {
        squaresMatrix[line][col].innerHTML = randomVal;
      } else { //when the random value is not good => check all posibilities from 1 to 9
        let valueNotGood = "yes", tryAllValues = 1;
        while (valueNotGood == "yes" && tryAllValues < 10) {
          if (checkSudokuRules(line, col, tryAllValues)) {
            valueNotGood = "no";
            squaresMatrix[line][col].innerHTML = tryAllValues;
          } else {
            ++tryAllValues;
          }
        }

        if (tryAllValues == 10 && valueNotGood == "yes") { //when no number between 1 to 9 is good in the square (extreme case)
          ++cntExtremeCase;
          //'delete' the entire line and repeat the process from the start of that line
          for (let colStart = 0; colStart <= col; ++colStart) {
            squaresMatrix[line][colStart].innerHTML = "";
          }
          col = -1;
        }
        if (cntExtremeCase == 2000) { //when enter the extreme case too many times
          location.reload(); //refresh page to don't encounter errors
          break;
        }
      }
    }
  }
}

function checkSudokuRules(lineNr, colNr, valNr) {
  if (!(1 <= valNr && valNr <= 9)) {
    return false;
  }

  //check the line from the big matrix
  for (let colMatrix = 0; colMatrix < width; ++colMatrix) {
    if (valNr == squaresMatrix[lineNr][colMatrix].innerHTML && colNr != colMatrix) { //
      return false;
    }
  }

  //check the column from the big matrix
  for (let lineMatrix = 0; lineMatrix < height; ++lineMatrix) {
    if (valNr == squaresMatrix[lineMatrix][colNr].innerHTML && lineNr != lineMatrix) { //
      return false;
    }
  }

  //check the 3x3 matrix
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
  //after the entire sudoku board has been built => 'hide' the numbers from random positions
  let numbersToHide = 30;
  while (numbersToHide != 0) {
    let line = Math.floor(Math.random() * 9);
    let column = Math.floor(Math.random() * 9);
    if (squaresMatrix[line][column].innerHTML != "") { //only different positions //
      squaresMatrix[line][column].innerHTML = "";
      --numbersToHide;
    }
  }
  createEditableSquares();
}

function createEditableSquares() {
  for (let line = 0; line < width; ++line) {
    for (let col = 0; col < height; ++col) {
      if (squaresMatrix[line][col].innerHTML != "") { //
        squaresMatrix[line][col].setAttribute("readonly", true);
      }
    }
  }
}

function clickInputSquares(line, col) {
  if (won) {
    return;
  }

  if (!squaresMatrix[line][col].readOnly) {
    ++nrTries;
    let inputDigit = squaresMatrix[line][col].value;
    if (checkSudokuRules(line, col, inputDigit)) {
      gameStatus.innerHTML = "Good number.";
      squaresMatrix[line][col].innerHTML = inputDigit;
    } else {
      if (inputDigit != "") {
        gameStatus.innerHTML = "Bad number.";
        squaresMatrix[line][col].innerHTML = "wrong";
      } else { //when you just click the square or you delete something
        squaresMatrix[line][col].innerHTML = "";
        gameStatus.innerHTML = "";
      }
    }
  }

  if (nrTries >= 30) {
    checkIfWin();
  }
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
    document.getElementById("gameStatus").innerHTML = "YOU WON!";
  }
}

generateBoard();
