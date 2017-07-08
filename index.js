import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const boardSize = 3;


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

  renderSingleRow(i) {
  	var cells = []; 
  	for (let j=0; j<boardSize; j++) {
  		cells.push(this.renderSquare(i,j));
  	}
  	return cells;
  }

  renderAllRows() {
  	var rows = []; 
  	for (let j=0; j<boardSize; j++) {
  		rows.push(<div className="board-row">
          			{this.renderSingleRow(j)}
        		</div>
        		);
  	}
  	return rows;
  }

  render() {
    return (
      <div>
        {this.renderAllRows()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    var emptyBoard  = [];
    for(let i = 0; i < boardSize; i++) {
        emptyBoard[i] = [];
        for(let j = 0; j < boardSize; j++) {
            emptyBoard[i][j] = null;
        }
    }
    this.state = {
      history: [
        {
          squares: emptyBoard,
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
    for(let i = 0; i < boardSize; i++) {
        currentSquares[i] = [];
        for(let j = 0; j < boardSize; j++) {
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
      if (moveNo === this.state.stepNumber) {
	      return (
	        <li key={moveNo}>
	          <a href="#" onClick={() => this.jumpTo(moveNo)}><b>{desc}</b></a>
	        </li>
	        );
      }
      else {
	      return (
	        <li key={moveNo}>
	          <a href="#" onClick={() => this.jumpTo(moveNo)}>{desc}</a>
	        </li>
      );
     }
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
  for (let i = 0; i < boardSize; i++) {
  	let firstInRow = squares[i][0];
  	let winningRow = true;
  	for (let j=1; j < boardSize; j++) {
  		if (squares[i][j] !== firstInRow) {
  			winningRow = false;
  			break;
  		}
  	}
  	if (winningRow && firstInRow){
  		return firstInRow;
  	}
   }
  for (let j = 0; j < boardSize; j++) {
  	let firstInCol = squares[0][j];
  	let winningCol = true;
  	for (let i=1; i < boardSize; i++) {
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
	for (let i=1; i < boardSize; i++) {
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
