import React from 'react';
import ReactDOM from 'react-dom';
import './boardStyle.css';

class GameTile extends React.Component {
  render() {
    return (
      <div className="gameTile" id={this.props.id}> {
      }
      </div>
    );
  }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.tileList = [];
    for (let col = 0; col <= 8; col++) {
      let colDiff = Math.abs(4-col); // This will go 4..0..4
      let rowStart = Math.floor(colDiff/2);
      let rowEnd = rowStart + (4-colDiff);
      for (let row = rowStart; row <= rowEnd; row++) {
        this.tileList.push({"row": row, "col": col});
      }
    }
  }

  renderTile(row, col) {
    return <GameTile id={"box"+col+row}/>;
  }

  render() {
    return (
      <div>
        <div className="gameBoard">
          {
            this.tileList.map(el => 
            this.renderTile(el.row, el.col))
          }
        </div>
      </div>
    );
  }
}

class AvailableTiles extends React.Component {
  renderTile(idx) {
    return <GameTile id={"tile"+idx}/>;
  }

  render() {
    return (
      <div>
        <div className="availableTiles">
          {this.renderTile(0)}
          {this.renderTile(1)}
          {this.renderTile(2)}
          {this.renderTile(3)}
          {this.renderTile(4)}
          {this.renderTile(5)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <GameBoard />
        <div className="boardTilesGutter" />
        <AvailableTiles />
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
