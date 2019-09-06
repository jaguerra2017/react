import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className= {props.winClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function highLightWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

class Board extends React.Component {
  renderSquare(i) {
    const winClass = this.props.winnerLine.includes(i) ? 'square winner' : 'square'
    return <Square winClass = {winClass}
    key = {i} value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    const rows =  [0, 1, 2]
    const columns = [0, 1, 2]
    let index  = 0

    const rowsRender = rows.map((row) => {
      const columnsRender = columns.map((column) => {
        return this.renderSquare(index++)
      })
      return <div className="board-row" key = {row}>
      {columnsRender}
      </div>
    })
    return (
      <div>
        {rowsRender}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      locations: [],
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locations = this.state.locations.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let row = 3;
    if (i < 3) {
      row = 1
    } else if (i < 6) {
      row = 2
    }
    locations.push(' (' + parseInt(i+1) + ',' + row + ')')
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      locations: locations
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winnerLine = highLightWinner(current.squares)

    const moves = history.map((step, move) => {
    const classBold = this.state.stepNumber === (move) ? 'bold-txt' : '';
    const desc = move ?
        'Go to move #' + move + this.state.locations[move-1]:
        'Go to game start';
      return (
        <li key={move}>
          <button className = {classBold} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if(history.length === 10) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
        <Board
          winnerLine = {winnerLine}
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
