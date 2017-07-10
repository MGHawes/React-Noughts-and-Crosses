import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const boardSize = 3;


function Square(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        key={j}
        value={this.props.squares[i][j]}
        style={this.styling(i,j)}
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
  		rows.push(<div key={j} className="board-row">
          			{this.renderSingleRow(j)}
        		</div>
        		);
  	}
  	return rows;
  }
  styling(i,j) {
  	if (this.props.winningSquares) {
	  	for (let i=0;i<boardSize;i++){
	  		if ([i,j] === this.props.winningSquares) {
	  			return "brightsquare";
	  		}
	  	}
  	}
  return "square"
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
    
    if (calculateWinner(currentSquares).winner || currentSquares[i][j]) {
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
    const result = calculateWinner(currentSquares);

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
    if (result.winner) {
      status = "Winner: " + result.winner + result.winningSquares;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares} 
            winningSquares={result.winningSquares}
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
  		var winningSquares = [];
  		for (let k=0,k<boardSize;k++){
  			winningSquares.push([i,k]);
  	}
  	if (winningRow && firstInRow){
  		return {winner:firstInRow,
  				winningSquares:winningSquares
  				};
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
  		var winningSquares = [];
  		for (let k=0,k<boardSize;k++){
  			winningSquares.push([k,j]);
  	}
  	if (winningCol && firstInCol){
  		return {winner:firstInCol,
  				winningSquares:winningSquares
  				};
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
		var winningSquares = [];
  		for (let k=0,k<boardSize;k++){
  			winningSquares.push([k,j]);
  		}

		return {winner:firstInDiag,
  		winningSquares:winningSquares
  		};
	}

	let firstInRevDiag = squares[boardSize-1][0];
	let winningRevDiag = true;
	for (let i=1; i < boardSize; i++) {
		if (squares[boardSize-i-1][i] !== firstInRevDiag) {
			winningRevDiag = false;
			break;
		}
	}
	if (winningRevDiag && firstInRevDiag){
		winningSquares = Array(boardSize).map((_, idx) => [idx,idx]);
		return {winner:firstInRevDiag,
  		winningSquares:winningSquares
  		};
	}

 return {winner:null,
  		winningSquares:null
  		};
}
