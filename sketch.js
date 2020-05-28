var tileWidth = 100;
var images = [];
var pieceDragging = false;
var draggingPiece;

function setup() {
  // put setup code here
  createCanvas(800, 800);

  for (var i = 1; i < 10; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"))
  }
  for (var i = 10; i < 13; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"))
  }

  initialBoard = new Board();
}

function draw() {
  // put drawing code here
  background(100);
  drawGrid();

  initialBoard.show();
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

function mousePressed() {
  let boardX = floor(mouseX / tileWidth);
  let boardY = floor(mouseY / tileWidth);

  print(boardX + ", " + boardY);

  if (!pieceDragging) {
    draggingPiece = initialBoard.getPieceAt(boardX, boardY);
    if (draggingPiece != null) {
      draggingPiece.isDragging = true;
      pieceDragging = true;
    }
  } else {
    if (draggingPiece.canMove(boardX, boardY, initialBoard)) {
      if (boardX != draggingPiece.boardPosition.x || boardY != draggingPiece.boardPosition.y) {
        draggingPiece.move(boardX, boardY, initialBoard);
      }
    }
    draggingPiece.isDragging = false;
    pieceDragging = false;
  }
}
