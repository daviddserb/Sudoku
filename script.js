const grid = document.getElementById("grid");
const gameStatus = document.getElementById("gameStatus")
const width = 9, height = width;
var squaresArray = Array(9).fill().map(() => Array(9).fill()); //divs
var nrInSquaresArray = Array(9).fill().map(() => Array(9).fill(0)); //numbers in divs

var inputSquaresArray = Array(9).fill().map(() => Array(9).fill()); //textareas

var cntExtremeCase = 0; //will refresh page if an error appears when creating the table

var won = false; //will be true, when the player finished the game
var nrTries = 0; //will check if the player won the game after some tries

function generateBoard() {
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      var square = document.createElement("div"); //create HTML element with the "div" tag
      square.setAttribute("id", i + "" + j);
      squaresArray[i][j] = square;
      grid.appendChild(square); //we add the square to the table

      if (i == 2 || i == 5) { //matrix delimitation
       square.style.borderBottom = "3px solid";
      }
      if (j != 0 && j % 3 == 0) { //matrix delimitation
        square.style.borderLeft = "3px solid";
      }

      square.addEventListener("click", function() { //! because I add function(), we move over in the code
        clickInputSquares(i, j);
      })
    }
  }
  addNumbers();
  hideNumbers();
}

function addNumbers() {
  //build the entire sudoku table
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      let randomVal = Math.floor(Math.random() * 9) + 1;
      if (checkSudokuRules(i, j, randomVal)) {
        nrInSquaresArray[i][j] = randomVal;
        squaresArray[i][j].innerHTML = randomVal;
      } else {
        let valueNotGood = "yes", tryAllValues = 1;
        while (valueNotGood == "yes" && tryAllValues < 10) {
          if (checkSudokuRules(i, j, tryAllValues)) {
            valueNotGood = "no";
            nrInSquaresArray[i][j] = tryAllValues;
            squaresArray[i][j].innerHTML = tryAllValues;
          } else {
            ++tryAllValues;
          }
        }

        if (tryAllValues == 10 && valueNotGood == "yes") { //extreme case (when no number between 1 and 9 is good in the square)
          console.log("###");
          ++cntExtremeCase;
          for (let k = 0; k <= j; ++k) {
            nrInSquaresArray[i][k] = 0;
            squaresArray[i][k].innerHTML = "";
          }
          j = -1;
        }
        if (cntExtremeCase == 2000) { // !!! NU MERGE
          console.log("ddd");
          location.reload(); //refresh page to don't encounter errors
        }
      }
    }
  }
}

function checkSudokuRules(lineNr, colNr, valNr) {
  //console.log(lineNr + " " + colNr + " " + valNr);
  //check the line from the big matrix
  //console.log("linia:");
  for (let colMatrix = 0; colMatrix < width; ++colMatrix) {
    //console.log(lineNr + " " + colMatrix + " cu val= " + nrInSquaresArray[lineNr][colMatrix]);
    if (valNr == nrInSquaresArray[lineNr][colMatrix] && colNr != colMatrix) {
      return false;
    }
  }

  //check the column from the big matrix
  //console.log("coloana:");
  for (let lineMatrix = 0; lineMatrix < height; ++lineMatrix) {
    //console.log(lineMatrix + " " + colNr + " cu val= " + nrInSquaresArray[lineMatrix][colNr]);
    if (valNr == nrInSquaresArray[lineMatrix][colNr] && lineNr != lineMatrix) {
      return false;
    }
  }

  //check the 3x3 matrix
  //console.log("matricea3x3:");
  let startLine3x3Matrix = Math.floor(lineNr / 3) * 3;
  let startCol3x3Matrix = Math.floor(colNr / 3) * 3;
  for (let i = startLine3x3Matrix; i < startLine3x3Matrix + 3; ++i) {
    for (let j = startCol3x3Matrix; j < startCol3x3Matrix + 3; ++j) {
      //console.log(i + " " + j + " cu val= " + nrInSquaresArray[i][j]);
      if (valNr == nrInSquaresArray[i][j] && lineNr != i && colNr != j) { 
        return false;
      }
    }
  }
  return true;
}

function hideNumbers() {
  let numbersToHide = 30;
  while (numbersToHide != 0) {
    let line = Math.floor(Math.random() * 9);
    let column = Math.floor(Math.random() * 9);
    if (nrInSquaresArray[line][column] != 0) { //only different positions
      nrInSquaresArray[line][column] = 0;
      squaresArray[line][column].innerHTML = "";
      squaresArray[line][column].classList.add("guessNr");
      --numbersToHide;
    }
  }
  createEditableSquares();
}

function createEditableSquares() {
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      if (nrInSquaresArray[i][j] == 0) {
        let inputSquare = document.createElement("textarea");
        inputSquaresArray[i][j] = inputSquare;
        squaresArray[i][j].appendChild(inputSquare);
      }
    }
  }
}

function clickInputSquares(line, col) {
  if (won == true || !(squaresArray[line][col].classList.contains("guessNr"))) {
    return;
  }

  ++nrTries;
  if (squaresArray[line][col].classList.contains("guessNr")) {
    let inputDigit = inputSquaresArray[line][col].value;
    if (!(1 <= inputDigit && inputDigit <= 9)) {
      alert("The number must be in the range [1, 9].")
      return;
    }
    if (checkSudokuRules(line, col, inputDigit)) {
      gameStatus.innerHTML = "Good number.";
      nrInSquaresArray[line][col] = inputDigit;
    } else {
      gameStatus.innerHTML = "Bad number.";
      nrInSquaresArray[line][col] = "wrong";
    }
    console.log(nrInSquaresArray);
  }
  if (nrTries >= 30) {
    checkIfWin();
  }
}

function checkIfWin() {
  let cnt = 0;
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      if (nrInSquaresArray[i][j] != "wrong") {
        ++cnt;
      }
    }
  }
  if (cnt == 81) {
    won = true;
    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        if (squaresArray[i][j].classList.contains("guessNr")) {
          inputSquaresArray[i][j].setAttribute("readonly", true);
        }
      }
    }
    document.getElementById("gameStatus").innerHTML = "YOU WON!";
  }
}

generateBoard();
