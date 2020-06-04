class Piece {
  constructor(x, y, isWhite) {
    this.boardPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2)
    this.isWhite = isWhite;
    this.isDragging = false;
    this.isCastlingQueenside = false;
    this.isCastlingKingside = false;
    this.value = 0;
    this.pieceTable;
    // this.isCaptured = false;
  }

  show() {
    // if (!this.isCaptured) {
      imageMode(CENTER);
      if (this.isDragging) {
        image(this.pic, mouseX, mouseY, tileWidth * 1.3, tileWidth * 1.3);
      } else {
        image(this.pic, this.pixelPosition.x, this.pixelPosition.y, tileWidth, tileWidth);
      }
    // }
  }

  move(x, y, board) {
    let defendingPiece = board.getPieceAt(x, y);
    if (defendingPiece != null) {
      // defendingPiece.isCaptured = true;
      let index;
      if (this.isWhite) {
        index = board.blackPieces.indexOf(defendingPiece);
        board.blackPieces.splice(index, 1);
      } else {
        index = board.whitePieces.indexOf(defendingPiece);
        board.whitePieces.splice(index, 1);
      }
    }
    this.boardPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);

    board.isWhiteTurn = !board.isWhiteTurn;
    board.enPassantColumn = -1;
  }

  // TODO:Make specific function for each piece type to avoid having to iterate through
  // entire 8x8 board
  generatePossibleMoves(board) {
    let possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  generatePossibleBoards(board) {
    let moves = this.generatePossibleMoves(board);
    let possibleBoards = [];
    for (let i = 0; i < moves.length; i++) {
      possibleBoards[i] = board.clone();
      possibleBoards[i].getPieceAt(this.boardPosition.x, this.boardPosition.y)
        .move(moves[i].x, moves[i].y, possibleBoards[i]);
    }

    return possibleBoards;
  }

  canAttack(boardX, boardY, board) {
    if (!board.withinBounds(boardX, boardY)) {
      return false;
    }

    return true;
  }

  canMove(boardX, boardY, board) {
    if (!board.withinBounds(boardX, boardY)) {
      return false;
    }

    if (this.isOccupiedByAlly(boardX, boardY, board)) {
      return false;
    }

    if (boardX == this.boardPosition.x && boardY == this.boardPosition.y) {
      return false;
    }

    let testBoard = board.clone();
    testBoard.getPieceAt(this.boardPosition.x, this.boardPosition.y).move(boardX, boardY, testBoard);

    //move() function automatically switches turn, so must be reversed to check if legal move
    if (testBoard.isBeingChecked(!testBoard.isWhiteTurn)) {
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

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }
}



class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[5];
      this.pieceTable = pawnWhitePieceSquareTable;
    } else {
      this.pic = images[11];
      this.pieceTable = pawnBlackPieceSquareTable;
    }
    this.isFirstMove = true;
    this.relValue = 1;
  }

  move(x, y, board) {
    super.move(x, y, board);

    //Automatically promotes pawn to queen if reaches back rank
    //(technically not the rules but happens in like 99% of games)
    if (y == 0 || y == 7) {
      let index;
      if (this.isWhite) {
        index = board.whitePieces.indexOf(board.getPieceAt(x, y));
        board.whitePieces.splice(index, 1);
        board.whitePieces.push(new Queen(x, y, true));
      } else {
        index = board.blackPieces.indexOf(board.getPieceAt(x, y));
        board.blackPieces.splice(index, 1);
        board.blackPieces.push(new Queen(x, y, false));
      }
      return;
    }

    if (this.isFirstMove) {
      if (y == 3 || y == 4) {
        board.enPassantColumn = x;
      }
      this.isFirstMove = false;
    } else if (board.isEnPassant) {
      let defendingPiece;
      let index;
      if (this.isWhite) {
        defendingPiece = board.getPieceAt(x, 3);
        index = board.blackPieces.indexOf(defendingPiece);
        board.blackPieces.splice(index, 1);
      } else {
        defendingPiece = board.getPieceAt(x, 4);
        index = board.whitePieces.indexOf(defendingPiece);
        board.whitePieces.splice(index, 1);
      }
      board.isEnPassant = false;
    }
  }

  canMove(boardX, boardY, board) {
    // if (!board.withinBounds(boardX, boardY)) {
    //   return false;
    // }
    // if (this.isOccupiedByAlly(boardX, boardY, board)) {
    //   return false;
    // }
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    let xDiff = this.boardPosition.x - boardX;
    let yDiff = this.boardPosition.y - boardY;

    if (this.isWhite) {
      if (this.isFirstMove && yDiff == 2 && xDiff == 0 &&
          board.getPieceAt(this.boardPosition.x, this.boardPosition.y - 1) == null &&
          board.getPieceAt(boardX, boardY) == null) {
        // this.isFirstMove = false;
        return true;
      }
      if (abs(xDiff) == 1 && yDiff == 1) {
        if (board.getPieceAt(boardX, boardY, board) != null) {
          return true;
        }
        //Check if en passant is available
        if (board.enPassantColumn == boardX &&
          boardY == 2) {
          board.isEnPassant = true;
          return true;
        }
      }
      if (xDiff == 0 && yDiff == 1) {
        if (board.getPieceAt(boardX, boardY, board) == null) {
          return true;
        }
      }
    } else {
      if (this.isFirstMove && yDiff == -2 && xDiff == 0 &&
          board.getPieceAt(this.boardPosition.x, this.boardPosition.y + 1) == null &&
          board.getPieceAt(boardX, boardY) == null) {
        // this.isFirstMove = false;
        return true;
      }
      if (abs(xDiff) == 1 && yDiff == -1) {
        if (board.getPieceAt(boardX, boardY, board) != null) {
          return true;
        }
        //Check if en passant is available
        if (board.enPassantColumn == boardX &&
          boardY == 5) {
          board.isEnPassant = true;
          return true;
        }
      }
      if (xDiff == 0 && yDiff == -1) {
        if (board.getPieceAt(boardX, boardY, board) == null) {
          return true;
        }
      }
    }
    return false;
  }

  canAttack(boardX, boardY, board) {
    // if(!super.canAttack(boardX, boardY, board)) {
    //   return false;
    // }

    if (!board.withinBounds(boardX, boardY)) {
      return false;
    }

    let yDiff = this.boardPosition.y - boardY;

    if (this.isWhite) {
      if (abs(boardX - this.boardPosition.x) == 1 && yDiff == 1) {
        return true;
      }
    } else {
      if (abs(boardX - this.boardPosition.x) == 1 && yDiff == -1) {
        return true;
      }
    }

    return false;
  }

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new Pawn(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    clone.isFirstMove = this.isFirstMove;
    return clone;
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[3];
      this.pieceTable = knightWhitePieceSquareTable;
    } else {
      this.pic = images[9];
      this.pieceTable = knightBlackPieceSquareTable;
    }
    this.relValue = 3;
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

  canAttack(boardX, boardY, board) {
    if(!super.canAttack(boardX, boardY, board)) {
      return false;
    }

    let xChange = abs(boardX - this.boardPosition.x);
    let yChange = abs(boardY - this.boardPosition.y);

    if (xChange == 1 && yChange == 2 || xChange == 2 && yChange == 1) {
      return true;
    }

    return false;
  }

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new Knight(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    return clone;
  }
}

class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[2];
      this.pieceTable = bishopWhitePieceSquareTable;
    } else {
      this.pic = images[8];
      this.pieceTable = bishopBlackPieceSquareTable;
    }
    this.relValue = 3.1;
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

  canAttack(boardX, boardY, board) {
    if(!super.canAttack(boardX, boardY, board)) {
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

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new Bishop(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    return clone;
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[4];
      this.pieceTable = rookWhitePieceSquareTable;
    } else {
      this.pic = images[10];
      this.pieceTable = rookBlackPieceSquareTable;
    }
    this.relValue = 5;
  }

  move(x, y, board) {
    if (this.boardPosition.x == 0 && this.boardPosition.y == 7) {
      board.canWhiteCastleQueenside = false;
    }
    if (this.boardPosition.x == 7 && this.boardPosition.y == 7) {
      board.canWhiteCastleKingside = false;
    }
    if (this.boardPosition.x == 0 && this.boardPosition.y == 0) {
      board.canBlackCastleQueenside = false;
    }
    if (this.boardPosition.x == 7 && this.boardPosition.y == 0) {
      board.canBlackCastleKingside = false;
    }
    super.move(x, y, board);
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

  canAttack(boardX, boardY, board) {
    if(!super.canAttack(boardX, boardY, board)) {
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

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new Rook(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    return clone;
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[1];
      this.pieceTable = queenWhitePieceSquareTable;
    } else {
      this.pic = images[7];
      this.pieceTable = queenBlackPieceSquareTable;
    }
    this.relValue = 9;
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

  canAttack(boardX, boardY, board) {
    if(!super.canAttack(boardX, boardY, board)) {
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

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new Queen(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    return clone;
  }
}

class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    if (isWhite) {
      this.pic = images[0];
      this.pieceTable = kingWhitePieceSquareTable;
    } else {
      this.pic = images[6];
      this.pieceTable = kingBlackPieceSquareTable;
    }
    this.relValue = 1;
  }

  move(x, y, board) {
    if (this.isWhite) {
      board.canWhiteCastleKingside = false;
      board.canWhiteCastleQueenside = false;
    } else {
      board.canBlackCastleKingside = false;
      board.canBlackCastleQueenside = false;
    }

    if (this.boardPosition.x - x == 2) {
      let rook = board.getPieceAt(0, y);
      if (rook != null) {
        this.boardPosition = createVector(x, y);
        this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);

        rook.boardPosition = createVector(x + 1, y);
        rook.pixelPosition = createVector((x + 1) * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);

        this.isCastlingQueenside = false;
        board.isWhiteTurn = !board.isWhiteTurn;
        return;
      }
    }
    if (this.boardPosition.x - x == -2) {
      let rook = board.getPieceAt(7, y);
      if (rook != null) {
        this.boardPosition = createVector(x, y);
        this.pixelPosition = createVector(x * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);

        rook.boardPosition = createVector(x - 1, y);
        rook.pixelPosition = createVector((x - 1) * tileWidth + tileWidth/2, y * tileWidth + tileWidth/2);

        this.isCastlingKingside = false;
        board.isWhiteTurn = !board.isWhiteTurn;
        return;
      }
    }

    super.move(x, y, board);
  }

  canMove(boardX, boardY, board) {
    if(!super.canMove(boardX, boardY, board)) {
      return false;
    }

    if (abs(boardX - this.boardPosition.x) <= 1
        && abs(boardY - this.boardPosition.y) <= 1) {
      return true;
    }

    //castling logic very annoying >:(
    let kingY;
    if (this.isWhite && boardY == 7) {
      kingY = 7;
      if (boardX == 2 && board.canWhiteCastleQueenside) {
        for (let x = this.boardPosition.x; x >= 2; x--) {
          if (board.isBeingAttacked(this.isWhite, x, kingY)) {
            return false;
          }
        }
        for (let x = this.boardPosition.x - 1; x >= 1; x--) {
          if (board.getPieceAt(x, kingY) != null) {
            return false;
          }
        }
        this.isCastlingQueenside = true;
        return true;
      }
      if (boardX == 6 && board.canWhiteCastleKingside) {
        for (let x = this.boardPosition.x; x <= 6; x++) {
          if (board.isBeingAttacked(this.isWhite, x, kingY)) {
            return false;
          }
        }
        for (let x = this.boardPosition.x + 1; x <= 6; x++) {
          if (board.getPieceAt(x, kingY) != null) {
            return false;
          }
        }
        this.isCastlingKingside = true;
        return true;
      }
    } else if (!this.isWhite && boardY == 0) {
      kingY = 0;
      if (boardX == 2 && board.canBlackCastleQueenside) {
        for (let x = this.boardPosition.x; x >= 2; x--) {
          if (board.isBeingAttacked(this.isWhite, x, kingY)) {
            return false;
          }
        }
        for (let x = this.boardPosition.x - 1; x >= 1; x--) {
          if (board.getPieceAt(x, kingY) != null) {
            return false;
          }
        }
        this.isCastlingQueenside = true;
        return true;
      }
      if (boardX == 6 && board.canBlackCastleKingside) {
        for (let x = this.boardPosition.x; x <= 6; x++) {
          if (board.isBeingAttacked(this.isWhite, x, kingY)) {
            return false;
          }
        }
        for (let x = this.boardPosition.x + 1; x <= 6; x++) {
          if (board.getPieceAt(x, kingY) != null) {
            return false;
          }
        }
        this.isCastlingKingside = true;
        return true;
      }
    }
    return false;
  }


  canAttack(boardX, boardY, board) {
    if(!super.canAttack(boardX, boardY, board)) {
      return false;
    }
    if (abs(boardX - this.boardPosition.x) <= 1
    && abs(boardY - this.boardPosition.y) <= 1) {
      return true;
    }
    return false;
  }

  generatePossibleMoves(board) {
    var possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.canMove(x, y, board)) {
          possibleMoves.push(createVector(x, y));
        }
      }
    }

    return possibleMoves;
  }

  getValue() {
    let positionBonus = this.pieceTable[this.boardPosition.y][this.boardPosition.x];
    return (this.relValue) * (positionBonus/100 + 1);
  }

  clone() {
    let clone = new King(this.boardPosition.x, this.boardPosition.y, this.isWhite);
    return clone;
  }
}
