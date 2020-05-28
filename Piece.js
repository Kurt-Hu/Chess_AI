class Piece {
  constructor(x, y, isWhite) {
    this.boardPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2)
    this.isWhite = isWhite;
    this.isDragging = false;
    this.isCaptured = false;
  }

  show() {
    if (!this.isCaptured) {
      imageMode(CENTER);
      if (this.isDragging) {
        image(this.pic, mouseX, mouseY, tileWidth * 1.3, tileWidth * 1.3);
      } else {
        image(this.pic, this.pixelPosition.x, this.pixelPosition.y, tileWidth, tileWidth);
      }
    }
  }

  move(x, y, board) {
    let defendingPiece = board.getPieceAt(x, y);
    if (defendingPiece != null) {
      defendingPiece.isCaptured = true;
    }
    this.boardPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);
  }


  getMovablePositions() {

  }

  getAttackablePostitions() {
    return getMovablePositions();
  }

  canMove(boardX, boardY, board) {
    if (!board.withinBounds(boardX, boardY)) {
      return false;
    }
    if (this.isOccupiedByAlly(boardX, boardY, board)) {
      return false;
    }
    return true;
  }

  isOccupiedByAlly(boardX, boardY, board) {
    let occupiedPiece = board.getPieceAt(boardX, boardY);
    if (occupiedPiece == null) {
      return false;
    }
    if (this.isWhite == occupiedPiece.isWhite) {
      return true;
    }
    return false;
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[5];
    } else {
      this.pic = images[11];
    }
    this.isFirstMove = true;
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    let yDiff = this.boardPosition.y - boardY;

    if (this.isWhite) {
      if (this.isFirstMove && yDiff == 2 &&
          board.getPieceAt(this.boardPosition.x, this.boardPosition.y - 1) == null) {
        this.isFirstMove = false;
        return true;
      }
      if (abs(boardX - this.boardPosition.x) == 1 && yDiff == 1) {
        if (board.getPieceAt(boardX, boardY, board) != null) {
          return true;
        }
      }
      if (boardX == this.boardPosition.x && yDiff == 1) {
        if (board.getPieceAt(boardX, boardY, board) == null) {
          return true;
        }
      }
    } else {
      if (this.isFirstMove && yDiff == -2 &&
          board.getPieceAt(this.boardPosition.x, this.boardPosition.y + 1) == null) {
        this.isFirstMove = false;
        return true;
      }
      if (abs(boardX - this.boardPosition.x) == 1 && yDiff == -1) {
        if (board.getPieceAt(boardX, boardY, board) != null) {
          return true;
        }
      }
      if (boardX == this.boardPosition.x && yDiff == -1) {
        if (board.getPieceAt(boardX, boardY, board) == null) {
          return true;
        }
      }
    }
    return false;
  }
}
class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[3];
    } else {
      this.pic = images[9];
    }
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    let xChange = abs(boardX - this.boardPosition.x);
    let yChange = abs(boardY - this.boardPosition.y);

    if (xChange == 1 && yChange == 2 || xChange == 2 && yChange == 1) {
      return true;
    }

    return false;
  }
}
class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[2];
    } else {
      this.pic = images[8];
    }
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }
    let xChange = abs(boardX - this.boardPosition.x);
    let yChange = abs(boardY - this.boardPosition.y);

    if (xChange != yChange) {
      return false;
    }

    if (board.piecesInBetween(this.boardPosition.x, this.boardPosition.y, boardX, boardY)) {
      return false;
    }

    return true;
  }
}
class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[4];
    } else {
      this.pic = images[10];
    }
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    if (boardX != this.boardPosition.x
        && boardY != this.boardPosition.y) {
      return false;
    }

    if (board.piecesInBetween(this.boardPosition.x, this.boardPosition.y, boardX, boardY)) {
      return false;
    }

    return true;
  }
}
class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[1];
    } else {
      this.pic = images[7];
    }
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    let xChange = abs(boardX - this.boardPosition.x);
    let yChange = abs(boardY - this.boardPosition.y);

    if (xChange != yChange && boardX != this.boardPosition.x
        && boardY != this.boardPosition.y) {
      return false;
    }

    if (board.piecesInBetween(this.boardPosition.x, this.boardPosition.y, boardX, boardY)) {
      return false;
    }

    return true;
  }
}
class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[0];
    } else {
      this.pic = images[6];
    }
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }
    if (abs(boardX - this.boardPosition.x) <= 1
        && abs(boardY - this.boardPosition.y) <= 1) {
      return true;
    }
    return false;
  }
}
