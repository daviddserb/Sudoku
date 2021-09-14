const grid = document.getElementById("grid");
const width = 9, height = width;
var divs = []; //will save the html elements, divs (the squares)
var squaresArray = new Array(81).fill(0); //will save the numbers from the squares
var textareas = []; //will save the html elements, textarea (the input in some squares)

var cntAddNumbers = 0; //will refresh page if an error appears when creating the table

var sudokuTable = "loading";

var won = false; //will be true, when the player won
var nrTries = 0; //will check if player won the game after some tries

function generateBoard() {
  //create squares and add them to the table
  for (let i = 0; i < width * height; ++i) {
    var square = document.createElement("div"); //create HTML element with the 'div' tag
    square.setAttribute("id", i);
    divs[i] = square;
    grid.appendChild(square); //we add the square to the table

    if ((18 <= square.id && square.id <= 26) || (45 <= square.id && square.id <= 53)) { //matrix delimitation
      square.style.borderBottom = "4px solid";
    }
    if ((square.id + 7) % 9 == 0 || (square.id + 4) % 9 == 0) { //matrix delimitation
      square.style.borderRight = "4px solid";
    }

    square.addEventListener("click", function() { //left click (! and because I did add function(), we move over in the code)
      clickSquare(i);
    })
  }
  addNumbers();
  hideNumbers();
}

function addNumbers() {
  ++cntAddNumbers;
  if (cntAddNumbers == 3000) {
    location.reload(); //refresh page to don't encounter errors
  }

  //add random values in the big matrix
  for (let i = 0; i < width * height; ++i) {
    let value = Math.floor(Math.random() * 9) + 1; //1 <= nr. random <= 9
    if (checkWhichMatrix3x3(i) == 0 || checkWhichMatrix3x3(i) == 3 || checkWhichMatrix3x3(i) == 6 ||
      checkWhichMatrix3x3(i) == 27 || checkWhichMatrix3x3(i) == 30 || checkWhichMatrix3x3(i) == 33 ||
      checkWhichMatrix3x3(i) == 54 || checkWhichMatrix3x3(i) == 57 || checkWhichMatrix3x3(i) == 60) {
        let posStartMatrix3x3 = checkWhichMatrix3x3(i);
        checkSudokuRules(value, i, posStartMatrix3x3);
    }
  }
}

function checkWhichMatrix3x3(pos) {
  //find the start position of the 3x3 matrix
  if (pos == 0 || pos == 1 || pos == 2 || pos == 9 || pos == 10 || pos == 11 || pos == 18 || pos == 19 || pos == 20) {
    return 0;
  } else if (pos == 3 || pos == 4 || pos == 5 || pos == 12 || pos == 13 || pos == 14 || pos == 21 || pos == 22 || pos == 23) {
    return 3;
  } else if (pos == 6 || pos == 7 || pos == 8 || pos == 15 || pos == 16 || pos == 17 || pos == 24 || pos == 25 || pos == 26) {
    return 6;
  } else if (pos == 27 || pos == 28 || pos == 29 || pos == 36 || pos == 37 || pos == 38 || pos == 45 || pos == 46 || pos == 47) {
    return 27;
  } else if (pos == 30 || pos == 31 || pos == 32 || pos == 39 || pos == 40 || pos == 41 || pos == 48 || pos == 49 || pos == 50) {
    return 30;
  } else if (pos == 33 || pos == 34 || pos == 35 || pos == 42 || pos == 43 || pos == 44 || pos == 51 || pos == 52 || pos == 53) {
    return 33;
  } else if (pos == 54 || pos == 55 || pos == 56 || pos == 63 || pos == 64 || pos == 65 || pos == 72 || pos == 73 || pos == 74) {
    return 54;
  } else if (pos == 57 || pos == 58 || pos == 59 || pos == 66 || pos == 67 || pos == 68 || pos == 75 || pos == 76 || pos == 77) {
    return 57;
  } else {
    return 60;
  }
}

function checkSudokuRules(value, pos, posStartMatrix3x3) {
  let goodNr = false; //suppose the nr. isn't good a.t.m.
  let startAgain = 1;
  const copyPosStartMatrix3x3 = posStartMatrix3x3;

  while (goodNr == false && value < 10) {
    let copyPos = pos;
    let validNr = 0;

    //check big line
    while ((pos + 1) % 9 != 0) { //move right
      ++pos;
      if (value != squaresArray[pos]) {
        ++validNr; //8
      }
    }
    pos = copyPos;
    while (pos % 9 != 0) { //move left
      --pos;
      if (value != squaresArray[pos]) {
        ++validNr; //8
      }
    }
    pos = copyPos;

    //check big column
    while (pos + 9 <= 80) { //move down
      pos += 9;
      if (value != squaresArray[pos]) {
        ++validNr;
      }
    }
    pos = copyPos;
    while (pos - 9 >= 0) { //move up
      pos -= 9;
      if (value != squaresArray[pos]) {
        ++validNr;
      }
    }
    pos = copyPos;

    //check 3x3 matrix
    let lineMatrix3x3 = 0;
    while (lineMatrix3x3 < 3) {
      for (let i = posStartMatrix3x3; i < posStartMatrix3x3 + 3; ++i) {
        if (value != squaresArray[i] && i != pos) {
          ++validNr;
        }
      }
      ++lineMatrix3x3;
      posStartMatrix3x3 += 9;
    }

    if (sudokuTable == "loading") { //when we build the matrix (add the numbers)
      if (validNr == 24) {
        goodNr = true; //nr. respects sudoku rules =>
        divs[pos].innerHTML = value; //write it down in the square (in the table)
        squaresArray[pos] = value; //save the value in the array
      } else {
        goodNr = false; //nr. isn't good => repeat algorithm and check all numbers from 1 to 9
        posStartMatrix3x3 = copyPosStartMatrix3x3;
        value = startAgain++;
      }
      if (startAgain == 11 && goodNr == false && squaresArray[pos] == 0) { //extreme case
        addNumbers();
      }
    } else { //when we input the numbers in a textarea square
      goodNr = true;
      if (validNr == 24) {
        alert("Good nr.");
        squaresArray[pos] = value; //save the value in the array
      } else {
        alert("Bad nr.");
      }
    }
  }
}

function hideNumbers() {
  sudokuTable = "finish";
  let numbersToHide = 30; //how many nrs. we hide
  while (numbersToHide != 0) {
    let pos = Math.floor(Math.random() * 81) + 0;
    if (squaresArray[pos] != 0) { //only different positions
      divs[pos].innerHTML = '';
      divs[pos].classList.add("guessNumber");
      squaresArray[pos] = 0;
      --numbersToHide;
    }
  }
  createEditableSquares();
}

function createEditableSquares() {
  for (let i = 0; i < width * height; ++i) {
    if (squaresArray[i] == 0) {
      let inputSquare = document.createElement("textarea");
      textareas[i] = inputSquare;
      divs[i].appendChild(inputSquare);
    }
  }
}

function clickSquare(pos) {
  if (won == true) {
    return;
  }

  ++nrTries;
  if (divs[pos].classList.contains("guessNumber")) {
    let inputDigit = textareas[pos].value;
    checkSudokuRules(inputDigit, pos, checkWhichMatrix3x3(pos));
  }
  if (nrTries >= 30) {
    checkIfWin();
  }
}

function checkIfWin() {
  let cnt = 0;
  for (let i = 0; i < height * width; ++i) {
    if (squaresArray[i] != 0) {
      ++cnt;
    }
  }
  if (cnt == 81) {
    alert("YOU WON");
    won = true;
  }
}

generateBoard();
