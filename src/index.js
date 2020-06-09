import React from 'react';
import ReactDOM from 'react-dom'; 
import './boardStyle.css';

class GameTile extends React.Component {
  render() {
    return (
      <div
        className={"gameTile" + (this.props.selected ? " selected" : "")}
        id={this.props.id}
        onClick={() => this.props.onTileClicked()}
      > {
        this.props.value
      } </div>
    );
  }
}

class GameBoard extends React.Component {

  renderTile(idx, row, col, val) {
    return <GameTile key={idx} id={("box"+col)+row} value={val}/>;
  }

  render() {
    return (
        <div className="gameBoard">
          {
            this.props.tileGrid.map((el, elIdx) => {
              let rowIdx = Math.floor(elIdx / 5);
              let colIdx = elIdx % 5;
              return this.renderTile(elIdx, rowIdx, colIdx, el.value);
            })
          }
        </div>
    );
  }
}

class TileRack extends React.Component {

  renderTile(idx, val, selected) {
    return <GameTile
             key = {idx}
             id = {"tile"+idx}
             value = {val}
             selected = {selected}
             onTileClicked = {() => this.props.onTileClicked(idx)}
           />;
  }

  render() {
    return (
      <div className="tileRack">
        {
          this.props.tileArr.map((el, idx) =>
            this.renderTile(idx, el.value, (idx === this.props.selectedIdx))
          )
        }
      </div>
    )
  }
}

class InteractionPanel extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="instructionsText">
          {this.props.instructionsText}
        </div>
        <div className="actionButtonDiv">
          <button onClick={() => this.props.onButtonClick()}>
            {this.props.buttonText}
          </button>
        </div>
      </React.Fragment>
    );
  }
}

class Game extends React.Component {

  gameUIStates = {
    selectingTile: "selectingTile",
    tileSelected: "tileSelected",
    buildWordStart: "buildWordStart",
    wordBuilding: "wordBuilding"  
  };

  uiInstructionsText = {
    selectingTile: "Click on a tile in the bottom row to select it",
    tileSelected: "Click on an empty tile in the grid to place your selected tile",
    buildWordStart: "Press and hold on a filled tile in the grid to start your word",
    wordBuilding: "Drag over tiles in the grid to draw your word"
  };

  uiState = undefined;

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
        selectedRackTile: null,
        instructionsText: "InstructionsText",
        buttonText: "BUTTON"
    };
    this.updateUIState(this.gameUIStates.selectingTile);
  }

  onRackTileClicked(idx) {
    if ((this.uiState === this.gameUIStates.selectingTile) || (this.uiState === this.gameUIStates.tileSelected)) {
      this.setState({ selectedRackTile: idx });
      this.updateUIState(this.gameUIStates.tileSelected);
  }

  onPanelButtonClicked() {

  }

  updateUIState(newState) {
    this.uiState = newState;
    this.setState({instructionsText: this.uiInstructionsText[newState]});
  }

  render() {
    return (
      <div className="wrapper">
        <div className="game">
          <GameBoard tileGrid={this.state.gameGrid} />
          <TileRack
            tileArr = {this.state.tileArr}
            selectedIdx = {this.state.selectedRackTile}
            onTileClicked = {(idx) => this.onRackTileClicked(idx)}
          />
        </div>
        <div className="interactionPanel">
          <InteractionPanel
            instructionsText = {this.state.instructionsText}
            buttonText = {this.state.buttonText}
            onButtonClick = {() => this.onPanelButtonClicked()}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
