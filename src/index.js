import React from 'react';
import ReactDOM from 'react-dom';
import './boardStyle.css';

class GameTile extends React.Component {
  render() {
    return (
      <div className={"gameTile" + (this.props.selected ? " selected" : "")} id={this.props.id}> {
        this.props.value
      } </div>
    );
  }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTile(idx, row, col, val) {
    return <GameTile key={idx} id={("box"+col)+row} value={val}/>;
  }

  render() {
    return (
      <div>
        <div className="gameBoard">
          {
            this.props.tileGrid.map((el, elIdx) => {
              let rowIdx = Math.floor(elIdx / 5);
              let colIdx = elIdx % 5;
              return this.renderTile(elIdx, rowIdx, colIdx, el.value);
            })
          }
        </div>
      </div>
    );
  }
}

class TileRack extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTile(idx, val, selected) {
    return <GameTile key={idx} id={"tile"+idx} value={val} selected={selected}/>;
  }

  render() {
    return (
      <div>
        <div className="tileRack">
          {
            this.props.tileArr.map((el, idx) =>
              this.renderTile(idx, el.value, (idx === this.props.selectedIdx))
            )
          }
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        gameGrid: Array(25).fill(null).map((el, index) => ({value: String.fromCharCode(65+index)})),
        tileArr: Array(6).fill(null).map((el, index) => ({value: String.fromCharCode(64+26-index)})),
        tileBag: [
          "A", "A", "A", "A", "A", "A", 
          "B", "B",
          "C", "C",
          "D", "D", "D",
          "E", "E", "E", "E", "E", "E", "E", "E",
          "F", "F",
          "G", "G",
          "H", "H",
          "I", "I", "I", "I", "I", "I",
          "J",
          "K",
          "L", "L", "L", "L",
          "M", "M",
          "N", "N", "N", "N",
          "O", "O", "O", "O", "O",
          "P", "P",
          "Qu",
          "R", "R", "R", "R", "R",
          "S", "S", "S", "S",
          "T", "T", "T", "T", "T",
          "U", "U",
          "V",
          "W",
          "X",
          "Y", "Y",
          "Z"
        ],
        selectedRackTile: 3
    };
  }

  onRackTileClicked(idx) {
    this.setState({ selectedRackTile: idx });
  }

  render() {
    return (
      <div className="game">
        <GameBoard tileGrid={this.state.gameGrid} />
        <div className="boardTilesGutter" />
        <TileRack tileArr={this.state.tileArr} selectedIdx = {this.state.selectedRackTile} />
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
