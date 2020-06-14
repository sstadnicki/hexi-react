import React from 'react';
import ReactDOM from 'react-dom'; 
import update from 'immutability-helper';
import './boardStyle.css';

class GameTile extends React.Component {
  render() {
    return (
      <div
        className = {"gameTile" + (this.props.selected ? " selected" : "") + " score"+this.props.scoreShade}
        id = {this.props.id}
        onClick = {() => this.props.onTileClicked()}
        onMouseDown = {() => this.props.onTileMouseDown()}
        onMouseEnter = {() => this.props.onTileMouseEnter()}
      >
        {
          this.props.value
        }
      </div>
    );
  }
}

class GameBoard extends React.Component {

  renderTile(idx, row, col, val, score) {
    return <GameTile
              key = {idx}
              id = {("box"+col)+row}
              value = {val}
              scoreShade = {score}
              onTileClicked = {() => this.props.onTileClicked(idx)}
              onTileMouseDown = {() => this.props.onTileMouseDown(idx)}
              onTileMouseEnter = {() => this.props.onTileMouseEnter(idx)}
            />;
  }

  render() {
    return (
        <div className="gameBoard">
          {
            this.props.tileGrid.map((el, elIdx) => {
              let rowIdx = Math.floor(elIdx / 5);
              let colIdx = elIdx % 5;
              return this.renderTile(elIdx, rowIdx, colIdx, el.value, el.tileScore);
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
             onTileMouseDown = {() => {}}
             onTileMouseEnter = {() => {}}
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
    wordBuilding: "wordBuilding",
    worldBuilt: "wordBuilt"  
  };

  uiInstructionsText = {
    selectingTile: "Click on a tile in the bottom row to select it",
    tileSelected: "Click on an empty tile in the grid to place your selected tile",
    buildWordStart: "Press and hold on a filled tile in the grid to start your word",
    wordBuilding: "Drag over tiles in the grid to draw your word",
    wordBuilt: "Submit your word"
  };

  buttonText = {
    selectingTile: "",
    tileSelected: "",
    buildWordStart: "End turn",
    wordBuilding: "",
    wordBuilt: "Submit word"
  }

  uiState = undefined;

  constructor(props) {
    super(props);
    this.state = {
        gameGrid: Array(25).fill(null).map((el, index) => ({value: "", tileScore: 0})),
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
        buttonText: "BUTTON",
        builtWord: "",
        buildIndices: []
    };
    // Initialize the instruction text based on the UI state
    this.uiState = this.gameUIStates.selectingTile;
    this.state.instructionsText =  this.uiInstructionsText[this.uiState];
    this.state.buttonText = this.buttonText[this.uiState];

    // Assign off an arrow function to a variable on this so we can remove it as needed
    this.mouseUpFunc = () => {
      if (this.uiState === this.gameUIStates.wordBuilding) {
        if (this.state.buildIndices.length > 2) {
          // Success! We open the word up for submission.
          this.updateUIState(this.gameUIStates.wordBuilt);
        } else {
          // Clear out the word we're building and the list of indices we're building with,
          // and bump our UI back to the start of word-building.
          this.setState({builtWord: "", buildIndices: []});
          this.updateUIState(this.gameUIStates.buildWordStart);
        }
        // Regardless, we remove the even listener from the window.
        window.removeEventListener("mouseup", this.mouseUpFunc);
      }
    };
  }

  onRackTileClicked(idx) {
    if ((this.uiState === this.gameUIStates.selectingTile) || (this.uiState === this.gameUIStates.tileSelected)) {
      this.setState({ selectedRackTile: idx });
      this.updateUIState(this.gameUIStates.tileSelected);
    }
  }

  onGridTileClicked(idx) {
    if ((this.uiState === this.gameUIStates.tileSelected)) {
      let selectedTileVal = this.state.tileArr[this.state.selectedRackTile].value;
      let newTileArr = update(this.state.tileArr, {[this.state.selectedRackTile]: {value: {$set: ""}}});
      let newGameGrid = update(this.state.gameGrid, {[idx]: {value: {$set: selectedTileVal}}});
      this.setState({tileArr: newTileArr, gameGrid: newGameGrid});
      this.updateUIState(this.gameUIStates.buildWordStart);
    }
  }

  onGridTileMouseDown(idx) {
    if ((this.uiState === this.gameUIStates.buildWordStart)) {
      if (this.state.gameGrid[idx] !== "") {
        this.setState({
          builtWord: this.state.gameGrid[idx].value,
          buildIndices: [idx]
        });
        this.updateUIState(this.gameUIStates.wordBuilding);
        window.addEventListener("mouseup", this.mouseUpFunc);
      }
    }
  }

  onGridTileEnter(idx) {
    if ((this.uiState === this.gameUIStates.wordBuilding)) {
      if (this.state.gameGrid[idx] !== "") {
        let newWord = this.state.builtWord + this.state.gameGrid[idx].value;
        let newIndicesArray = [...this.state.buildIndices, idx];
        this.setState({
          builtWord: newWord,
          buildIndices: newIndicesArray
        });
      }
    }
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
          <GameBoard
            tileGrid={this.state.gameGrid}
            onTileClicked = {(idx) => this.onGridTileClicked(idx)}
            onTileMouseEnter = {(idx) => this.onGridTileEnter(idx)}
            onTileMouseDown = {(idx) => this.onGridTileMouseDown(idx)}
          />
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
