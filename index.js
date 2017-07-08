import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i,j)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0,0)}
          {this.renderSquare(0,1)}
          {this.renderSquare(0,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1,0)}
          {this.renderSquare(1,1)}
          {this.renderSquare(1,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2,0)}
          {this.renderSquare(2,1)}
          {this.renderSquare(2,2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: [ 
					  [null,null,null],
					  [null,null,null],
					  [null,null,null]
					],
		  newMove: [null, null]
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var currentSquares  = [];
    for(let i = 0; i < 3; i++) {
        currentSquares[i] = [];
        for(let j = 0; j < 3; j++) {
            currentSquares[i][j] = squares[i][j];
        }
    }
    
    if (calculateWinner(currentSquares) || currentSquares[i][j]) {
      return;
    }
    currentSquares[i][j] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: currentSquares,
          newMove: [i, j]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history.slice();
    const currentSquares = history[this.state.stepNumber].squares.slice();
    const winner = calculateWinner(currentSquares);

    const moves = history.map((currentVal, moveNo) => {
      const desc = moveNo ? "Move #"+moveNo+ " "+ currentVal.newMove : "Game start";
      return (
        <li key={moveNo}>
          <a href="#" onClick={() => this.jumpTo(moveNo)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            onClick={(i,j) => this.handleClick(i,j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  for (let i = 0; i < squares[0].length; i++) {
  	let firstInRow = squares[i][0];
  	let winningRow = true;
  	for (let j=1; j < squares[0].length; j++) {
  		if (squares[i][j] !== firstInRow) {
  			winningRow = false;
  			break;
  		}
  	}
  	if (winningRow && firstInRow){
  		return firstInRow;
  	}
   }
  for (let j = 0; j < squares[0].length; j++) {
  	let firstInCol = squares[0][j];
  	let winningCol = true;
  	for (let i=1; i < squares[0].length; i++) {
  		if (squares[i][j] !== firstInCol) {
  			winningCol = false;
  			break;
  		}
  	}
  	if (winningCol && firstInCol){
  		return firstInCol;
  	}
   }

	let firstInDiag = squares[0][0];
	let winningDiag = true;
	for (let i=1; i < squares[0].length; i++) {
		if (squares[i][i] !== firstInDiag) {
			winningDiag = false;
			break;
		}
	}
	if (winningDiag && firstInDiag){
		return firstInDiag;
	}

 return null;
}
