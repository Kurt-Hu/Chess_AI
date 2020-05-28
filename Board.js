class Board {
  constructor() {
    this.whitePieces = []
    this.blackPieces = []
    this.setupInitialBoard()
  }

  setupInitialBoard() {
    this.whitePieces.push(new Rook(0, 7, true))
    this.whitePieces.push(new Knight(1, 7, true))
    this.whitePieces.push(new Bishop(2, 7, true))
    this.whitePieces.push(new Queen(3, 7, true))
    this.whitePieces.push(new King(4, 7, true))
    this.whitePieces.push(new Bishop(5, 7, true))
    this.whitePieces.push(new Knight(6, 7, true))
    this.whitePieces.push(new Rook(7, 7, true))
    this.whitePieces.push(new Pawn(0, 6, true))
    this.whitePieces.push(new Pawn(1, 6, true))
    this.whitePieces.push(new Pawn(2, 6, true))
    this.whitePieces.push(new Pawn(3, 6, true))
    this.whitePieces.push(new Pawn(4, 6, true))
    this.whitePieces.push(new Pawn(5, 6, true))
    this.whitePieces.push(new Pawn(6, 6, true))
    this.whitePieces.push(new Pawn(7, 6, true))

    this.blackPieces.push(new Rook(0, 0, false))
    this.blackPieces.push(new Knight(1, 0, false))
    this.blackPieces.push(new Bishop(2, 0, false))
    this.blackPieces.push(new Queen(3, 0, false))
    this.blackPieces.push(new King(4, 0, false))
    this.blackPieces.push(new Bishop(5, 0, false))
    this.blackPieces.push(new Knight(6, 0, false))
    this.blackPieces.push(new Rook(7, 0, false))
    this.blackPieces.push(new Pawn(0, 1, false))
    this.blackPieces.push(new Pawn(1, 1, false))
    this.blackPieces.push(new Pawn(2, 1, false))
    this.blackPieces.push(new Pawn(3, 1, false))
    this.blackPieces.push(new Pawn(4, 1, false))
    this.blackPieces.push(new Pawn(5, 1, false))
    this.blackPieces.push(new Pawn(6, 1, false))
    this.blackPieces.push(new Pawn(7, 1, false))
  }

  show() {
    this.whitePieces.forEach(piece => piece.show());
    this.blackPieces.forEach(piece => piece.show());
  }

  isInCheck() {
    //make array of each piece's movable position
  }

  getPieceAt(x, y) {
    for (let i = 0; i < this.whitePieces.length; i++) {
      if (this.whitePieces[i].boardPosition.x == x &&
          this.whitePieces[i].boardPosition.y == y &&
          !this.whitePieces[i].isCaptured) {
            return this.whitePieces[i];
          }
    }
    for (let j = 0; j < this.blackPieces.length; j++) {
      if (this.blackPieces[j].boardPosition.x == x &&
          this.blackPieces[j].boardPosition.y == y &&
          !this.blackPieces[j].isCaptured) {
            return this.blackPieces[j];
          }
    }

    return null;
  }

  withinBounds(boardX, boardY) {
    return (boardX >= 0 && boardX < 8 && boardY >= 0 && boardY < 8);
  }

  piecesInBetween(x, y, finalX, finalY) {
    let xDir = 0;
    if (x < finalX) {
      xDir = 1;
    }
    if (x > finalX) {
      xDir = -1;
    }
    let yDir = 0;
    if (y < finalY) {
      yDir = 1;
    }
    if (y > finalY) {
      yDir = -1;
    }
    x += xDir;
    y += yDir;
    while (x != finalX || y != finalY) {
      if (this.getPieceAt(x, y) != null) {
        return true;
      }
      x += xDir;
      y += yDir;
    }
    return false;
  }


}
