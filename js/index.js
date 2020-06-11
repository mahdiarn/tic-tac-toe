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

  rerender() {
    this.printGrid();
    let boardSize = this.board.length;
    $('#o-win').text(this.oScore);
    $('#x-win').text(this.xScore);
    $('#game').empty();
    $('#game').css('max-width', (window.innerHeight * 0.75));
    $('#game').css('margin-left', Math.max(
      (window.innerWidth - (window.innerHeight * 0.75)) / 2,
      0
    ));
    for (let i=0; i<boardSize; i++) {
      let id = `button-${i+1}`
      switch (this.board[i]) {
        case true:
          $('#game').append(`<li id="${id}" class="btn btn-primary span1"><div id="square-${id}" class="square-label">o</div></li>`);
          break;
        case false:
          $('#game').append(`<li id="${id}" class="btn btn-info span1"><div id="square-${id}" class="square-label">x</div></li>`);
          break;
        default:
          $('#game').append(`<li id="${id}" class="btn span1"><div id="square-${id}" class="square-label">+</div></li>`);
      }
      $(`#${id}`).width(this.squareLength);
      $(`#${id}`).height(this.squareLength);
      $(`#${id} .square-label`).position('relative');
      $(`#${id} .square-label`).css({
        fontSize: this.squareLength,
        height: this.squareLength,
        lineHeight: `min(100% - 1vw, 80px)`,
        overflow: 'hidden'
      });
    }
    
    $('#game li').click((e) => {
      let index = Number(e.target.id.split("-")[2]) - 1;
      if (this.getGrid(index) !== null) return alert("Already selected")
      this.setGrid(
        index,
        (this.roundCount % 2 == 0) ? true : false
      );
      this.rerender();
      this.roundCount++;
      let winner = this.decideWinner();
      if (
        (this.roundCount === 25) &&
        (winner === null)
      ) {
        this.announceWinner();
      } else if (winner !== null) {
        this.announceWinner(winner ? 'O' : 'X');
        this.setScore(winner);
      } else {
        return true
      }
      return this.restartGame();
    });
  }

  setScore(winner) {
    winner ? this.oScore++ : this.xScore++;
  }

  restartGame() {
    this.roundCount = 0;
    this.board = this.generateBoard(this.boardLength);
    console.log(this.board)
    this.rerender();
  }

  resetSquareLength() {
    this.squareLength = (window.innerWidth > (window.innerHeight * 0.75)) ? (window.innerHeight * 0.75) : window.innerWidth;
    this.squareLength = ((this.squareLength * 10) / (Math.sqrt(this.board.length) * 10)) - 2;
    this.rerender();
  }
}

$(document).ready(function() {
  let tictactoe = new Game(5);
  tictactoe.rerender();
  $(window).resize(function(){
    tictactoe.resetSquareLength();
    tictactoe.rerender();
  });
  $('#reset').click(function() {
    tictactoe.restartGame();
  });
});
    
    