// Tic Tac Toe

export const X: Player = "X";
export const O: Player = "O";
export const EMPTY: Player = null;

export function initializeBoardState(): Board {
  return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
}

export function determineCurrentPlayer(board: Board): Player {
  let countX = 0;
  let countO = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell === X) {
        countX++;
      } else if (cell === O) {
        countO++;
      }
    }
  }

  return countX > countO ? O : X;
}

export function actions(board: Board): Set<Action> {
  const possibleActions: Set<Action> = new Set();

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === EMPTY) {
        possibleActions.add([i, j]);
      }
    });
  });

  return possibleActions;
}

export function applyMove(board: Board, action: Action): Board {
  const [i, j] = action;

  if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
    throw new Error("Invalid action");
  }
  if (board[i][j] !== EMPTY) {
    throw new Error("Invalid action");
  }

  const newBoard = board.map((row) => [...row]);
  newBoard[i][j] = determineCurrentPlayer(board);
  return newBoard;
}

function winnerLine(line: Player[]): Player {
  if (line[0] !== EMPTY && line.every((cell) => cell === line[0])) {
    return line[0];
  }
  return null;
}

export function getWinningDetails(board: Board): [Player, Action[]] {
  // Check rows
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    const result = winnerLine(row);
    if (result) {
      return [result, row.map((_, j) => [i, j])];
    }
  }

  // Check columns
  for (let j = 0; j < board[0].length; j++) {
    const column = board.map((row) => row[j]);
    const result = winnerLine(column);
    if (result) {
      return [result, column.map((_, i) => [i, j])];
    }
  }

  // Check main diagonal
  const mainDiagonal = board.map((row, i) => row[i]);
  const resultMainDiagonal = winnerLine(mainDiagonal);
  if (resultMainDiagonal) {
    return [resultMainDiagonal, mainDiagonal.map((_, i) => [i, i])];
  }

  // Check anti-diagonal
  const antiDiagonal = board.map((row, i) => row[board.length - 1 - i]);
  const resultAntiDiagonal = winnerLine(antiDiagonal);
  if (resultAntiDiagonal) {
    return [
      resultAntiDiagonal,
      antiDiagonal.map((_, i) => [i, board.length - 1 - i]),
    ];
  }

  return [null, []];
}

export function checkGameOver(board: Board): boolean {
  if (getWinningDetails(board)[0]) {
    return true;
  }

  for (const row of board) {
    for (const cell of row) {
      if (cell === EMPTY) {
        return false;
      }
    }
  }

  return true;
}

export function utility(board: Board): number {
  const gameWinner = getWinningDetails(board);
  if (gameWinner[0] === X) {
    return 1;
  } else if (gameWinner[0] === O) {
    return -1;
  }
  return 0;
}

export function calculateBestMove(board: Board): Action | null {
  if (checkGameOver(board)) {
    return null;
  }

  const currentPlayer = determineCurrentPlayer(board);

  function maxValue(board: Board, alpha: number, beta: number): number {
    if (checkGameOver(board)) {
      return utility(board);
    }
    let value = -Infinity;
    for (const action of actions(board)) {
      value = Math.max(value, minValue(applyMove(board, action), alpha, beta));
      if (value >= beta) {
        return value;
      }
      alpha = Math.max(alpha, value);
    }
    return value;
  }

  function minValue(board: Board, alpha: number, beta: number): number {
    if (checkGameOver(board)) {
      return utility(board);
    }
    let value = Infinity;
    for (const action of actions(board)) {
      value = Math.min(value, maxValue(applyMove(board, action), alpha, beta));
      if (value <= alpha) {
        return value;
      }
      beta = Math.min(beta, value);
    }
    return value;
  }

  let optimalAction: Action | null = null;
  if (currentPlayer === X) {
    let bestValue = -Infinity;
    for (const action of actions(board)) {
      const actionValue = minValue(
        applyMove(board, action),
        -Infinity,
        Infinity
      );
      if (actionValue > bestValue) {
        bestValue = actionValue;
        optimalAction = action;
      }
    }
  } else {
    let bestValue = Infinity;
    for (const action of actions(board)) {
      const actionValue = maxValue(
        applyMove(board, action),
        -Infinity,
        Infinity
      );
      if (actionValue < bestValue) {
        bestValue = actionValue;
        optimalAction = action;
      }
    }
  }

  return optimalAction;
}
