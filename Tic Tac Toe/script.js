let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  
  let ai = 'X';
  let human = 'O';
  let currentPlayer = human;
  let canvas, ctx;
  let w, h; // Define these variables
  
  document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("ticTacToeCanvas");
    ctx = canvas.getContext("2d");
    w = canvas.width / 3;
    h = canvas.height / 3;
    bestMove();
    canvas.addEventListener("click", mousePressed);
    draw();
  });
  
  function draw() {
    drawBoard();
    let result = checkWinner();
    if (result != null) {
      let resultMessage = result === 'tie' ? 'Tie!' : `${result} wins!`;
        document.getElementById("message").innerText = resultMessage;
    } else {
      requestAnimationFrame(draw);
    }
  }
  
  function drawBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let x = i * w;
        let y = j * h;
        ctx.strokeRect(x, y, w, h);
        let spot = board[i][j];
  
        // Adjust the font size and style
        ctx.font = "bold 48px Arial"; // You can adjust the size (e.g., 48px)
  
        // Set the text color
        ctx.fillStyle = "hsl(241, 90%, 19%)"; // You can set any color you like
  
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (spot == human) {
          ctx.fillText(human, x + w / 2, y + h / 2);
        } else if (spot == ai) {
          ctx.fillText(ai, x + w / 2, y + h / 2);
        }

      }
    }
  }
  function mousePressed(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    if (currentPlayer == human) {
      // Human makes a turn
      let i = Math.floor(mouseX / w);
      let j = Math.floor(mouseY / h);
      // If valid turn
      if (board[i][j] == '') {
        board[i][j] = human;
        currentPlayer = ai;
        bestMove();
      }
    }
  }

  function equals3(a, b, c) {
    return a == b && b == c && a != '';
  }

  function checkWinner() {
    let winner = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }

  function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, 0, false);
          board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;
  }

  let scores = {
    X: 10,
    O: -10,
    tie: 0
  };

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = ai;
            let score = minimax(board, depth + 1, false);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = human;
            let score = minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  