var visionDepth = 3;

function minimize(board, depth) {
  if (depth >= visionDepth) {
    return board.updateEvaluation();
  }

  let futureBoards = board.generateAllPossibleBoards(false);
  let tempScore;
  let lowestScore = 100000; //arbitrarily high, so the lowest score will be lower
  let lowestBoardIndex = 0;

  for (let i = 0; i < futureBoards.length; i++) {
    if (futureBoards[i].gameResult == "") {
      tempScore = maximize(futureBoards[i], depth + 1);
      if (tempScore < lowestScore) {
        lowestScore = tempScore;
        lowestBoardIndex = i;
      }
    }
  }

  if (depth == 0) {
    return futureBoards[lowestBoardIndex];
  }

  return lowestScore;
}

function maximize(board, depth) {
  if (depth >= visionDepth) {
    return board.updateEvaluation();
  }

  let futureBoards = board.generateAllPossibleBoards(true);
  let tempScore;
  let highestScore = -100000; //arbitrarily low, so the highest score will be higher
  let highestBoardIndex = 0;

  for (let i = 0; i < futureBoards.length; i++) {
    if (futureBoards[i].gameResult == "") {
      tempScore = minimize(futureBoards[i], depth + 1);
      if (tempScore > highestScore) {
        highestScore = tempScore;
        highestBoardIndex = i;
      }
    }
  }

  if (depth == 0) {
    return futureBoards[highestBoardIndex];
  }

  return highestScore;
}

function minimizeAlphaBeta(board, alpha, beta, depth) {
  if (depth >= visionDepth || board.gameResult != '') {
    return board.updateEvaluation();
  }

  let futureBoards = board.generateAllPossibleBoards(false);
  let tempScore;
  let lowestScore = 100000; //arbitrarily high, so the lowest score will be lower
  let lowestBoardIndex = 0;

  for (let i = 0; i < futureBoards.length; i++) {
    if (futureBoards[i].gameResult == "") {
      tempScore = maximizeAlphaBeta(futureBoards[i], alpha, beta, depth + 1);
      if (tempScore < lowestScore) {
        lowestScore = tempScore;
        lowestBoardIndex = i;
      } else if (depth == 0 && tempScore == lowestScore) {
          if (random(1) < 0.3) {
            lowestBoardIndex = i;
          }
      }
    }

    if (tempScore < alpha) {
      return lowestScore;
    }
    if (tempScore < beta) {
      beta = tempScore;
    }
  }

  if (depth == 0) {
    return futureBoards[lowestBoardIndex];
  }

  return lowestScore;
}


function maximizeAlphaBeta(board, alpha, beta, depth) {
  if (depth >= visionDepth || board.gameResult != '') {
    return board.updateEvaluation();
  }

  let futureBoards = board.generateAllPossibleBoards(true);
  let tempScore;
  let highestScore = -100000; //arbitrarily low, so the highest score will be higher
  let highestBoardIndex = 0;

  for (let i = 0; i < futureBoards.length; i++) {
    if (futureBoards[i].gameResult == "") {
      tempScore = minimizeAlphaBeta(futureBoards[i], alpha, beta, depth + 1);
      if (tempScore > highestScore) {
        highestScore = tempScore;
        highestBoardIndex = i;
      } else if (depth == 0 && tempScore == highestScore) {
        if (random(1) < 0.3) {
          highestBoardIndex = i;
        }
      }
    }

    if (tempScore > beta) {
      return tempScore;
    }
    if (tempScore > alpha) {
      alpha = tempScore;
    }
  }

  if (depth == 0) {
    return futureBoards[highestBoardIndex];
  }

  return highestScore;
}
