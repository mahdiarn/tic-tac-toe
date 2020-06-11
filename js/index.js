// JavaScript Document
"use strict";

class Game {
  // true o
  // false x
  constructor(boardLength = 5) {
    this.board = this.generateBoard(boardLength);
    this.boardLength = boardLength;
    this.boardSize = Math.pow(boardLength,2);
    this.round = true;
    this.oScore = 0;
    this.xScore = 0;
    this.roundCount = 0;
    this.resetSquareLength();
  }

  generateBoard(boardLength) {
    let out = [];
    let boardSize = Math.pow(boardLength,2);
    for (let i = 0; i < boardSize; i++) {
        out.push(null);
    }
    return out;
  }

  setGrid(i,value) {
    this.board[i] = value;
  }
  getGrid(i) {
    return this.board[i];
  }

  printGrid() {
    let tempBoard = []
    let temp = []
    for (let i = 0; i<this.boardSize; i++) {
      temp.push(this.getGrid(i))
      if (
        (i >= (this.boardLength-1)) &&
        ((i+1) % this.boardLength == 0)
      ) {
        tempBoard.push(temp)
        temp = [];
      }
    }
    console.table(tempBoard)
  }

  decideWinner() {
    const win = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];
    let winLength = win.length;
    for (let i = 0; i < winLength; i++) {
      const [a, b, c, d, e] = win[i];
      if (
        (this.board[a] !== null) &&
        (this.board[a] === this.board[b]) &&
        (this.board[a] === this.board[c]) &&
        (this.board[a] === this.board[d]) &&
        (this.board[a] === this.board[e])
      ) {
        return this.board[a];
      }
    }
    return null;
  }

  announceWinner(winner = '', restart = true) {
    if (winner.length == 0) return alert('Its a tie. It will restart.');

    if (restart) {
      return alert(`${winner} has won the game. Start a new game`)
    } else {
      return alert(`${winner} wins`)
    }
  }

  render() {
    for (let i = 0; i<25; i++) {
      $(`${i}`).empty();
      let value = this.getGrid(i);
      if (value !== null) $(`#${i}`).html(value ? '<div class="o"></div>' : '<div class="x"></div>');
    }
    $('#o-score').text(this.oScore);
    $('#x-score').text(this.xScore);
  }

  setScore(winner) {
    winner ? this.oScore++ : this.xScore++;
  }

  restartGame() {
    this.roundCount = 0;
    this.board = this.generateBoard(this.boardLength);
    this.render();
  }

  resetSquareLength() {
    this.squareLength = (window.innerWidth > (window.innerHeight * 0.75)) ? (window.innerHeight * 0.75) : window.innerWidth;
    this.squareLength = ((this.squareLength * 10) / (Math.sqrt(this.board.length) * 10)) - 2;
    $(".title").css({ fontSize: (window.innerWidth > (window.innerHeight * 0.75)) ? 'calc(12px + 1vh)' : 'calc(12px + 5vw)' });
    $("#reset").css({
      fontSize: (window.innerWidth > (window.innerHeight * 0.75)) ? 'calc(12px + 1vh)' : 'calc(12px + 5vw)',
    });

    
    this.render();
  }
}

$(document).ready(function() {
  let tictactoe = new Game(5);
  tictactoe.resetSquareLength();
  tictactoe.printGrid();
  $('.cell').click((e) => {
    let idx = Number(e.target.id);
    if (tictactoe.getGrid(idx) !== null) return alert("Already selected")
    tictactoe.setGrid(
      idx,
      (tictactoe.roundCount % 2 == 0) ? true : false
    );
    tictactoe.render();
    tictactoe.roundCount++;
    tictactoe.printGrid();
    let winner = tictactoe.decideWinner();
    if (
      (tictactoe.roundCount === 25) &&
      (winner === null)
    ) {
      tictactoe.announceWinner();
    } else if (winner !== null) {
      tictactoe.announceWinner(winner ? 'O' : 'X');
      tictactoe.setScore(winner);
    } else {
      return true
    }
    return tictactoe.restartGame();
  });
  $('#reset').click(function() {
    tictactoe.restartGame();
  });
});