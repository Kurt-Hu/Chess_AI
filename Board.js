class Board {
  constructor(fillInitialPieces) {
    this.whitePieces = [];
    this.blackPieces = [];
    // this.inCheck = false;
    this.isWhiteTurn = true;
    this.canWhiteCastleKingside = true;
    this.canWhiteCastleQueenside = true;
    this.canBlackCastleKingside = true;
    this.canBlackCastleQueenside = true;

    //represents the x value of the correstponding pawn that can be taken
    this.enPassantColumn = -1;
    this.isEnPassant = false;

    this.gameResult = "";

    this.evaluation = 0;

    if (fillInitialPieces) {
      this.setupInitialBoard();
    }
  }

  setupInitialBoard() {
    this.whitePieces.push(new King(4, 7, true));
    this.whitePieces.push(new Rook(0, 7, true));
    this.whitePieces.push(new Knight(1, 7, true));
    this.whitePieces.push(new Bishop(2, 7, true));
    this.whitePieces.push(new Queen(3, 7, true));
    this.whitePieces.push(new Bishop(5, 7, true));
    this.whitePieces.push(new Knight(6, 7, true));
    this.whitePieces.push(new Rook(7, 7, true));
    this.whitePieces.push(new Pawn(0, 6, true));
    this.whitePieces.push(new Pawn(1, 6, true));
    this.whitePieces.push(new Pawn(2, 6, true));
    this.whitePieces.push(new Pawn(3, 6, true));
    this.whitePieces.push(new Pawn(4, 6, true));
    this.whitePieces.push(new Pawn(5, 6, true));
    this.whitePieces.push(new Pawn(6, 6, true));
    this.whitePieces.push(new Pawn(7, 6, true));

    this.blackPieces.push(new King(4, 0, false));
    this.blackPieces.push(new Rook(0, 0, false));
    this.blackPieces.push(new Knight(1, 0, false));
    this.blackPieces.push(new Bishop(2, 0, false));
    this.blackPieces.push(new Queen(3, 0, false));
    this.blackPieces.push(new Bishop(5, 0, false));
    this.blackPieces.push(new Knight(6, 0, false));
    this.blackPieces.push(new Rook(7, 0, false));
    this.blackPieces.push(new Pawn(0, 1, false));
    this.blackPieces.push(new Pawn(1, 1, false));
    this.blackPieces.push(new Pawn(2, 1, false));
    this.blackPieces.push(new Pawn(3, 1, false));
    this.blackPieces.push(new Pawn(4, 1, false));
    this.blackPieces.push(new Pawn(5, 1, false));
    this.blackPieces.push(new Pawn(6, 1, false));
    this.blackPieces.push(new Pawn(7, 1, false));
  }

  show() {
    this.whitePieces.forEach(piece => piece.show());
    this.blackPieces.forEach(piece => piece.show());
  }

  updateEvaluation() {
    if (this.gameResult == "checkmate") {
      if (this.isWhiteTurn) {
        this.evaluation = -999;
        return this.evaluation;
      } else {
        this.evaluation = 999;
        return this.evaluation;
      }
    }

    this.evaluation = 0;

    if (this.gameResult == "stalemate") {
      return this.evaluation;
    }

    for (let i = 0; i < this.whitePieces.length; i++) {
      this.evaluation += this.whitePieces[i].getValue();
    }
    for (let j = 0; j < this.blackPieces.length; j++) {
      this.evaluation -= this.blackPieces[j].getValue();
    }

    return this.evaluation;
  }

  clone() {
    let clone = new Board(false);
    for (let i = 0; i < this.whitePieces.length; i++) {
      clone.whitePieces.push(this.whitePieces[i].clone());
    }
    for (let j = 0; j < this.blackPieces.length; j++) {
      clone.blackPieces.push(this.blackPieces[j].clone());
    }
    clone.isWhiteTurn = this.isWhiteTurn;
    clone.canWhiteCastleKingside = this.canWhiteCastleKingside;
    clone.canWhiteCastleQueenside = this.canWhiteCastleQueenside;
    clone.canBlackCastleKingside = this.canBlackCastleKingside;
    clone.canBlackCastleQueenside = this.canBlackCastleQueenside;

    //represents the x value of the correstponding pawn that can be taken
    clone.enPassantColumn = this.enPassantColumn;
    clone.isEnPassant = this.isEnPassant;

    clone.gameResult = this.gameResult;

    clone.evaluation = this.evaluation;

    return clone;
  }

  //This doesn't check if the move is legal, just moves pieces. Be careful!
  // forceMove(initialX, initialY, finalX, finalY) {
  //   let pieceToMove = this.getPieceAt(initalX, initialY);
  //   if (pieceToMove != null) {
  //     pieceToMove.move()
  //   }
  // }
  isBeingAttacked(isWhite, x, y) {
    if (isWhite) {
      for (let i = 0; i < this.blackPieces.length; i++) {
        if (this.blackPieces[i].canAttack(x, y, this)) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this.whitePieces.length; i++) {
        if (this.whitePieces[i].canAttack(x, y, this)) {
          return true;
        }
      }
    }
    return false;
  }


  isBeingChecked(isWhite) {
    //This assumes that the king is always in index 0 of the array, so be careful
    if (isWhite) {
      return this.isBeingAttacked(isWhite, this.whitePieces[0].boardPosition.x,
        this.whitePieces[0].boardPosition.y);
    } else {
      return this.isBeingAttacked(isWhite, this.blackPieces[0].boardPosition.x,
        this.blackPieces[0].boardPosition.y);
    }
    return false;
  }

  generateAllPossibleBoards(isWhite) {
    let allPossibleBoards = [];
    if (isWhite) {
      for (let i = 0; i < this.whitePieces.length; i++) {
        allPossibleBoards = allPossibleBoards.concat(this.whitePieces[i].generatePossibleBoards(this));
      }
    } else {
      for (let i = 0; i < this.blackPieces.length; i++) {
        allPossibleBoards = allPossibleBoards.concat(this.blackPieces[i].generatePossibleBoards(this));
      }
    }
    return allPossibleBoards;
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
