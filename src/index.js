import React from 'react';
import ReactDOM from 'react-dom';
import './boardStyle.css';

class GameTile extends React.Component {
  render() {
    return (
      <div className="gameTile" id={this.props.id}> {
        this.props.value
      } </div>
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
        this.tileList.push({"row": row, "col": col, "value":null});
      }
    }
  }

  renderTile(row, col, val) {
    return <GameTile id={"box"+col+row} value={val}/>;
  }

  render() {
    return (
      <div>
        <div className="gameBoard">
          {
            this.tileList.map(el => 
            this.renderTile(el.row, el.col, el.value))
          }
        </div>
      </div>
    );
  }
}

class AvailableTiles extends React.Component {
  constructor(props) {
    super(props);
    this.tileArr = [];
    for (let idx = 0; idx < 6; idx++) {
      this.tileArr.push({"idx": idx, "value": idx});
    }
  }

  renderTile(idx, val) {
    return <GameTile id={"tile"+idx} value={val}/>;
  }

  render() {
    return (
      <div>
        <div className="availableTiles">
          {
            this.tileArr.map(el =>
            this.renderTile(el.idx, el.value))
          }
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
