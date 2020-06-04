var tileWidth = 100;
var images = [];
var pieceDragging = false;
var draggingPiece;
var blackAI = false;
var whiteAI = false;
var moveDelayFramesWhite = 10;
var moveDelayFramesBlack = 10;

var pawnPieceSquareTableStr;
var pawnWhitePieceSquareTable;
var pawnBlackPieceSquareTable;
var knightPieceSquareTableStr;
var knightWhitePieceSquareTable;
var knightBlackPieceSquareTable;
var bishopPieceSquareTableStr;
var bishopWhitePieceSquareTable;
var bishopBlackPieceSquareTable;
var rookPieceSquareTableStr;
var rookWhitePieceSquareTable;
var rookBlackPieceSquareTable;
var queenPieceSquareTableStr;
var queenWhitePieceSquareTable;
var queenBlackPieceSquareTable;
var kingPieceSquareTableStr;
var kingWhitePieceSquareTable;
var kingBlackPieceSquareTable;

function setup() {
  // put setup code here
  createCanvas(800, 800);

  for (var i = 1; i < 10; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"))
  }
  for (var i = 10; i < 13; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"))
  }

  runPieceEvaluation();

  initialBoard = new Board(true);
}

function draw() {
  // put drawing code here
  background(100);
  drawGrid();
  initialBoard.show();
  AI_Turn();
}

function AI_Turn() {
  if (initialBoard.gameResult == "") {
    if (initialBoard.isWhiteTurn && whiteAI == true) {
      if (moveDelayFramesWhite > 10) {
        print("white AI moving")
        print("Evaluation: " + initialBoard.updateEvaluation());
        initialBoard = maximizeAlphaBeta(initialBoard, -2000, 2000, 0);
        moveDelayFramesWhite = 0;
        isGameOver(initialBoard, initialBoard.isWhiteTurn);
      } else {
        moveDelayFramesWhite++;
      }
    } else if (!initialBoard.isWhiteTurn && blackAI == true) {
      if (moveDelayFramesBlack > 10) {
        print("black AI moving")
        print("Evaluation: " + initialBoard.updateEvaluation());
        initialBoard = minimizeAlphaBeta(initialBoard, -2000, 2000, 0);
        moveDelayFramesBlack = 0;
        isGameOver(initialBoard, initialBoard.isWhiteTurn);
      } else {
        moveDelayFramesBlack++;
      }
    }
  }
}

function drawGrid() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if ((i + j) % 2 == 0) {
        fill(0);
      } else {
        fill(255);
      }

      noStroke();
      rect(i * tileWidth, j * tileWidth, tileWidth, tileWidth);
    }
  }
}

function doMove(piece, board, x, y) {
  piece.move(x, y, board);
  isGameOver(board, board.isWhiteTurn);
  print("Evaluation: " + initialBoard.updateEvaluation());
}

function isGameOver(board, checkWhiteWin) {
  if (!(board instanceof Board)) {
    print("this is bad")
    return;
  }
  if (board.generateAllPossibleBoards(board.isWhiteTurn).length == 0) {
    if (board.isBeingChecked(checkWhiteWin)) {
      //TODO: Checkmate
      board.gameResult = "checkmate";
      print("Checkmate");
    } else {
      //TODO: Stalemate
      board.gameResult = "stalemate";
      print("Stalemate");
    }
  }
}

function runPieceEvaluation() {
  pawnPieceSquareTableStr = " 0,  0,  0,  0,  0,  0,  0,  0_100, 100, 100, 100, 100, 100, 100, 100_60, 60, 60, 60, 60, 60, 60, 60_10,  10, 20, 50, 50, 20,  10,  10_0,  0,  10, 30, 30,  10,  0,  0_5, 0,-5,  15,  15,-5, 0,  5_-30, -30, -30,-30,-30, -30, -30,  -30_0,  0,  0,  0,  0,  0,  0,  0"
  pawnWhitePieceSquareTable = pawnPieceSquareTableStr.split('_');
  for (let i = 0; i < pawnWhitePieceSquareTable.length; i++) {
    pawnWhitePieceSquareTable[i] = pawnWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < pawnWhitePieceSquareTable[i].length; j++) {
      pawnWhitePieceSquareTable[i][j] = int(pawnWhitePieceSquareTable[i][j].trim());
    }
  }
  pawnBlackPieceSquareTable = pawnWhitePieceSquareTable.slice().reverse();

  print("pawn");
  print(pawnWhitePieceSquareTable);
  print(pawnBlackPieceSquareTable);

  knightPieceSquareTableStr = "-20,-15,-10,-10,-10,-10,-15,-20_-15,-5,  0,  0,  0,  0,-5,-15_-10,  0, 5, 5, 5, 5,  0,-10_-10,  0, 5, 10, 10, 5,  0,-10_-10,  0, 5, 10, 10, 5,  0,-10_-10,  0, 5, 5, 5, 5,  0,-10_-15,-5,  0,  0,  0,  0,-5,-15_-20,-15,-10,-10,-10,-10,-15,-20";
  knightWhitePieceSquareTable = knightPieceSquareTableStr.split('_');
  for (let i = 0; i < knightWhitePieceSquareTable.length; i++) {
    knightWhitePieceSquareTable[i] = knightWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < knightWhitePieceSquareTable[i].length; j++) {
      knightWhitePieceSquareTable[i][j] = int(knightWhitePieceSquareTable[i][j].trim())/2;
    }
  }
  knightBlackPieceSquareTable = knightWhitePieceSquareTable.slice().reverse();
  print("knight");
  print(knightWhitePieceSquareTable);

  bishopPieceSquareTableStr = "-20,-10,-10,-10,-10,-10,-10,-20_-10,  0,  0,  0,  0,  0,  0,-10_-10,  0,  5, 10, 10,  5,  0,-10_-10,  5,  5, 10, 10,  5,  5,-10_-10,  0, 10, 10, 10, 10,  0,-10_-10, 10, 10, 10, 10, 10, 10,-10_-10,  5,  0,  0,  0,  0,  5,-10_-20,-10,-10,-10,-10,-10,-10,-20";
  bishopWhitePieceSquareTable = bishopPieceSquareTableStr.split('_');
  for (let i = 0; i < bishopWhitePieceSquareTable.length; i++) {
    bishopWhitePieceSquareTable[i] = bishopWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < bishopWhitePieceSquareTable[i].length; j++) {
      bishopWhitePieceSquareTable[i][j] = int(bishopWhitePieceSquareTable[i][j].trim());
    }
  }
  bishopBlackPieceSquareTable = bishopWhitePieceSquareTable.slice().reverse();
  print("bishop");
  print(bishopWhitePieceSquareTable);

  rookPieceSquareTableStr = "  0,  0,  0,  0,  0,  0,  0,  0_  5, 10, 10, 10, 10, 10, 10,  5_ -5,  0,  0,  0,  0,  0,  0, -5_ -5,  0,  0,  0,  0,  0,  0, -5_ -5,  0,  0,  0,  0,  0,  0, -5_ -5,  0,  0,  0,  0,  0,  0, -5_ -5,  0,  0,  0,  0,  0,  0, -5_  0,  0,  0,  5,  5,  0,  0,  0";
  rookWhitePieceSquareTable = rookPieceSquareTableStr.split('_');
  for (let i = 0; i < rookWhitePieceSquareTable.length; i++) {
    rookWhitePieceSquareTable[i] = rookWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < rookWhitePieceSquareTable[i].length; j++) {
      rookWhitePieceSquareTable[i][j] = int(rookWhitePieceSquareTable[i][j].trim());
    }
  }
  rookBlackPieceSquareTable = rookWhitePieceSquareTable.slice().reverse();
  print("rook")
  print(rookWhitePieceSquareTable);

  queenPieceSquareTableStr = "-5,-3,-3, -1, -1,-3,-3,-5_-3,  0,  0,  0,  0,  0,  0,-3_-2,  0,  1,  1,  1,  1,  0,-2_ -1,  0,  1,  1,  1,  1,  0, -1_  -1,  0,  1,  1,  1,  1,  0, -1_-2,  0,  1,  1,  1,  1,  0,-2_-3,  0,  0,  0,  0,  0,  0,-3_-5,-3,-3, -1, -1,-3,-3,-5";
  queenWhitePieceSquareTable = queenPieceSquareTableStr.split('_');
  for (let i = 0; i < queenWhitePieceSquareTable.length; i++) {
    queenWhitePieceSquareTable[i] = queenWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < queenWhitePieceSquareTable[i].length; j++) {
      queenWhitePieceSquareTable[i][j] = int(queenWhitePieceSquareTable[i][j].trim())/5;
    }
  }
  queenBlackPieceSquareTable = queenWhitePieceSquareTable.slice().reverse();
  print("queen");
  print(queenWhitePieceSquareTable);

  kingPieceSquareTableStr = "-30,-40,-40,-50,-50,-40,-40,-30_-30,-40,-40,-50,-50,-40,-40,-30_-30,-40,-40,-50,-50,-40,-40,-30_-30,-40,-40,-50,-50,-40,-40,-30_-20,-30,-30,-40,-40,-30,-30,-20_-10,-20,-20,-20,-20,-20,-20,-10_ 20, 20,  0,  0,  0,  0, 20, 20_ 20, 30, 10,  0,  0, 10, 30, 20";
  kingWhitePieceSquareTable = kingPieceSquareTableStr.split('_');
  for (let i = 0; i < kingWhitePieceSquareTable.length; i++) {
    kingWhitePieceSquareTable[i] = kingWhitePieceSquareTable[i].split(',');
    for (let j = 0; j < kingWhitePieceSquareTable[i].length; j++) {
      kingWhitePieceSquareTable[i][j] = int(kingWhitePieceSquareTable[i][j].trim());
    }
  }
  kingBlackPieceSquareTable = kingWhitePieceSquareTable.slice().reverse();
  print("king");
  print(kingWhitePieceSquareTable);
}

function keyPressed() {
  if (key == 'r') {
    initialBoard = new Board(true);
  }
  if (key == 'e') {
    print("Evaluation: " + initialBoard.updateEvaluation());
  }
}

function mousePressed() {
  let boardX = floor(mouseX / tileWidth);
  let boardY = floor(mouseY / tileWidth);

  if (!pieceDragging && !initialBoard.isGameOver) {
    if ((initialBoard.isWhiteTurn == true && whiteAI == false) ||
        (initialBoard.isWhiteTurn == false && blackAI == false))
    draggingPiece = initialBoard.getPieceAt(boardX, boardY);
    if (draggingPiece != null) {
      if (initialBoard.isWhiteTurn == draggingPiece.isWhite) {
        draggingPiece.isDragging = true;
        pieceDragging = true;
      }
    }
  } else {
    if (draggingPiece.canMove(boardX, boardY, initialBoard)) {
      // if (boardX != draggingPiece.boardPosition.x || boardY != draggingPiece.boardPosition.y) {
      doMove(draggingPiece, initialBoard, boardX, boardY);
      // }
    }
    draggingPiece.isDragging = false;
    pieceDragging = false;
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function optionsDropdown() {
  let dropdown = document.getElementById("optionsDropdown");
  dropdown.classList.toggle("show");
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function difficultyDropdown() {
  let dropdown = document.getElementById("difficultyDropdown");
  dropdown.classList.toggle("show");
}

function noAIClick() {
  document.getElementById("optionsBtn").innerText = "No AI";
  blackAI = false;
  whiteAI = false;
}

function blackAIClick() {
  document.getElementById("optionsBtn").innerText = "Black AI";
  blackAI = true;
  whiteAI = false;
}

function whiteAIClick() {
  document.getElementById("optionsBtn").innerText = "White AI";
  blackAI = false;
  whiteAI = true;
}

function bothAIClick() {
  document.getElementById("optionsBtn").innerText = "Both AI";
  blackAI = true;
  whiteAI = true;
}

function oneMoveAheadClick() {
  document.getElementById("difficultyBtn").innerText = "Looking 1 Move Ahead";
  visionDepth = 1;
}

function twoMovesAheadClick() {
  document.getElementById("difficultyBtn").innerText = "Looking 2 Moves Ahead";
  visionDepth = 2;
}

function threeMovesAheadClick() {
  document.getElementById("difficultyBtn").innerText = "Looking 3 Moves Ahead";
  visionDepth = 3;
}

function fourMovesAheadClick() {
  document.getElementById("difficultyBtn").innerText = "Looking 4 Moves Ahead";
  visionDepth = 4;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
