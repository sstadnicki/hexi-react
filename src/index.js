import React from 'react';
import ReactDOM from 'react-dom'; 
import update from 'immutability-helper';
import './boardStyle.css';

function getXYFromIndex(idx) {
  return {x: idx % 5, y: Math.floor(idx/5)};
}

// TileArrow uses an SVG element to draw the arrow from one tile to the next
class TileArrow extends React.Component {
  coordinateArr = [
    "",
    "50,50 26,58 25,47 15,70 40,73 31,67",
    "50,50 45,75 35,70 50,90 65,70 55,75",
    "50,50 31,33 40,27 15,30 25,53 26,42",
    "",
    "50,50 69,67 60,73 85,70 75,47 74,58",
    "50,50 55,25 65,30 50,10 35,30 45,25",
    "50,50 74,42 75,53 85,30 60,27 69,33"
  ];

  render() {
    let arrowIdx = 3*(this.props.direction.y+1)+this.props.direction.x+1;
    return (
      <svg
        style={{display: "block", position: "absolute", width: "100%", height: "100%", zIndex: "10"}}
        viewBox="15 15 70 70"
      >
        <polygon
          points={this.coordinateArr[arrowIdx]}
        />
      </svg>
    )
  }

}

class GameTile extends React.Component {
  render() {
    return (
      <div
        className = {"gameTile"
          + (this.props.selected ? " selected" : "")
          + (this.props.isNew ? " newTile" : "")
          + (this.props.isDraggedOver ? " draggedOver" : "")
          + " score"+this.props.scoreShade}
        id = {this.props.id}
        draggable = {this.props.draggable}
        onClick = {() => this.props.onTileClicked()}
        onMouseDown = {() => this.props.onTileMouseDown()}
        onMouseEnter = {() => this.props.onTileMouseEnter()}
        onDragStart = {(evt) => this.props.onTileDragStart(evt)}
        onDragOver = {(evt) => this.props.onTileDragOver(evt)}
        onDragEnter = {(evt) => this.props.onTileDragEnter(evt)}
        onDragLeave = {(evt) => this.props.onTileDragLeave(evt)}
        onDrop = {(evt) => this.props.onTileDrop(evt)}
      >
        {this.props.nextDirection && <TileArrow direction={this.props.nextDirection} />}
        <div style={{display: "block", position: "absolute"}} >
          {this.props.value}
        </div>
      </div>
    );
  }
}

class GameBoard extends React.Component {

  renderTile(idx, row, col, val, score, selected, nextDirection, isNew, isDraggedOver) {
    return <GameTile
              key = {idx}
              id = {("box"+col)+row}
              value = {val}
              selected = {selected}
              nextDirection = {nextDirection}
              isNew = {isNew}
              isDraggedOver = {isDraggedOver}
              scoreShade = {score}
              draggable={false}
              onTileClicked = {() => this.props.onTileClicked(idx)}
              onTileMouseDown = {() => this.props.onTileMouseDown(idx)}
              onTileMouseEnter = {() => this.props.onTileMouseEnter(idx)}
              onTileDragStart = {() => {}}
              onTileDragOver = {(evt) => this.props.onTileDragOver(evt, idx)}
              onTileDragEnter = {(evt) => this.props.onTileDragEnter(evt, idx)}
              onTileDragLeave = {(evt) => this.props.onTileDragLeave(evt, idx)}
              onTileDrop = {(evt) => this.props.onTileDrop(evt, idx)}
            />;
  }

  render() {
    return (
        <div className="gameBoard">
          {
            this.props.tileGrid.map((el, elIdx) => {
              let {x: colIdx, y: rowIdx} = getXYFromIndex(elIdx);
              let arrayIdx = this.props.buildIndices.indexOf(elIdx);
              let tileSelected = (arrayIdx !== -1);
              let nextDirection = null;
              if (tileSelected && (arrayIdx < this.props.buildIndices.length-1)) {
                let nextXY = getXYFromIndex(this.props.buildIndices[arrayIdx+1]);
                nextDirection = {x: nextXY.x - colIdx, y: nextXY.y - rowIdx};
              }
              return this.renderTile(
                elIdx,
                rowIdx,
                colIdx,
                el.value,
                el.tileScore,
                tileSelected,
                nextDirection,
                (elIdx === this.props.tilePlacementLoc),
                (elIdx === this.props.draggedOverTile)
              );
            })
          }
        </div>
    );
  }
}

class CurrentPlayerPanel extends React.Component {
  playerNameTable = [
    "Blue",
    "Red"
  ];

  render() {
    return (
      <div className="playerName">
        Current Player:&nbsp;
        <div className={"player" + this.props.player}>
          {this.playerNameTable[this.props.player]}
        </div>
      </div>
    );
  }
}

class ScorePanel extends React.Component {
  render() {
    return (
      <div className="scorePanel">
        Score:&nbsp;&nbsp;
        Blue:&nbsp;
        <div className="blueScore">
          {this.props.gameScore.blue}
        </div>
        &nbsp; Red:&nbsp;
        <div className="redScore">
          {this.props.gameScore.red}
        </div>
      </div>
    )
  }
}
class TileRack extends React.Component {

  renderTile(idx, val, selected) {
    return <GameTile
             key = {idx}
             id = {"tile"+idx}
             value = {val}
             selected = {selected}
             draggable = {true}
             onTileClicked = {() => {}}
             onTileMouseDown = {() => this.props.onTileClicked(idx)}
             onTileMouseEnter = {() => {}}
             onTileDragStart = {(evt) => this.props.onTileDragStart(evt, idx)}
             onTileDragOver = {() => {}}
             onTileDragEnter = {() => {}}
             onTileDragLeave = {() => {}}
             onTileDrop = {() => {}}
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
        <div className="wordHolder">
          Previous Word:
          <div className="previousWord">
            {this.props.previousWord}
          </div>
        </div>
        <CurrentPlayerPanel
          player = {this.props.currentPlayer}
        />
        <ScorePanel
          gameScore = {this.props.gameScore}
        />
        <div className="wordHolder">
          Current Word:
          <div className="currentWord">
            {this.props.currentWord}
          </div>
        </div>
        <div className="instructionsText">
          {this.props.instructionsText}
        </div>
        <div className="buttonHolder">
          <div className="actionButtonDiv">
            {this.props.actionButtonText !== "" &&
              <button className="actionButton" onClick={() => this.props.onActionButtonClick()}>
                {this.props.actionButtonText}
              </button>
            }
          </div>
          <div className="undoButtonDiv">
            {this.props.showUndoButton &&
              <button className="undoButton" onClick={() => this.props.onUndoButtonCLick()}>
                Undo
              </button>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class ModalDialog extends React.Component {

  render() {
    return (this.props.show && 
      <div className="modalBackdrop">
        <div className="modalMain">
          {this.props.children}
          <div className="modalFooter">
            <button onClick={this.props.onCancelClick}>
              Cancel
            </button>
            <button onClick={this.props.onOKClick}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
}

///////////////////////////////////////////////////////////////////////////////

class Game extends React.Component {

  gameUIStates = {
    selectingTile: "selectingTile",
    tileSelected: "tileSelected",
    buildWordStart: "buildWordStart",
    wordBuilding: "wordBuilding",
    wordBuilt: "wordBuilt",
    gameOver: "gameOver"
  };

  uiInstructionsText = {
    selectingTile: "Click on a tile in the bottom row to select it",
    tileSelected: "Click on an empty tile in the grid to place your selected tile",
    buildWordStart: "Press and hold on a filled tile in the grid to start your word",
    wordBuilding: "Drag over tiles in the grid to draw your word",
    wordBuilt: "Submit your word",
    buildTooShort: "Your word must contain at least three letters",
    invalidBuild: "You must draw a word through your new letter",
    illegalWord: " is not a valid word",
    gameOver: "Congratulations!"
  };

  actionButtonText = {
    selectingTile: "",
    tileSelected: "",
    buildWordStart: "End turn",
    wordBuilding: "",
    wordBuilt: "Submit word",
    gameOver: ""
  };

  // Defines the new score of a tile based on its previous score (-2..2, offset to be 0..4)
  // and who just built a word through it (player 0 or player 1).
  scoreUpdateTable = [
    [-2, -2, -1, -1, 1],
    [-1, 1, 1, 2, 2]
  ];

  uiState = undefined;

  isDragging = false;

  constructor(props) {
    super(props);
    this.state = {
        currentPlayer: 0,
        gameGrid: Array(25).fill(null).map((el, index) => ({value: "", tileScore: 0})),
        tileArr: Array(6).fill(null).map((el, index) => ({value: ""})),
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
        tilePlacementLoc: null,
        draggedOverTile: null,
        instructionsText: "InstructionsText",
        actionButtonText: "",
        buildIndices: [],
        builtWord: "",
        previousWord: "",
        showConfirmation: false,
        turnStartState: {
          gameGrid: [],
          tileArr: [],
          currentPlayer: null
        }
    };
    // Initialize the instruction text based on the UI state
    this.uiState = this.gameUIStates.selectingTile;
    this.state.instructionsText =  this.uiInstructionsText.selectingTile;
    this.state.actionButtonText = this.actionButtonText[this.uiState];

    // Initialize the tile array from the bag
    for (let idx = 0; idx < this.state.tileArr.length; idx++) {
      let bagIdx = Math.floor(Math.random() * this.state.tileBag.length);
      let bagTile = this.state.tileBag.splice(bagIdx, 1)[0];
      this.state.tileArr[idx].value = bagTile;
    }
    this.state.turnStartState.gameGrid = [...this.state.gameGrid];
    this.state.turnStartState.tileArr = [...this.state.tileArr];
    this.state.turnStartState.currentPlayer = this.state.currentPlayer;

    // Assign off an arrow function to a variable on this so we can remove it as needed
    this.mouseUpFunc = () => {
      if (this.uiState === this.gameUIStates.wordBuilding) {
        if (this.state.buildIndices.length <= 2) {
          // Fail if the word is too short
          this.setState({builtWord: "", buildIndices: [], instructionsText: this.uiInstructionsText.buildTooShort});
          this.updateUIState(this.gameUIStates.buildWordStart);
        } else if (this.state.buildIndices.indexOf(this.state.tilePlacementLoc) < 0) {
          // Fail if it doesn't go through the placed tile
          this.setState({builtWord: "", buildIndices: [], instructionsText: this.uiInstructionsText.invalidBuild});
          this.updateUIState(this.gameUIStates.buildWordStart);
        } else if (!(document.dictSet.has(this.state.builtWord.toUpperCase()))) {
          // Fail if the word isn't in the dictionary
          let wrongText = this.state.builtWord.toUpperCase() + this.uiInstructionsText.illegalWord;
          this.setState({builtWord: "", buildIndices: [], instructionsText: wrongText});
          this.updateUIState(this.gameUIStates.buildWordStart);
        } else {
          // Success!
          this.setState({instructionsText: this.uiInstructionsText.wordBuilt});
          this.updateUIState(this.gameUIStates.wordBuilt);
        }
        // Regardless, we remove the even listener from the window.
        window.removeEventListener("mouseup", this.mouseUpFunc);
      }
    };
  }

  onRackTileClicked(idx) {
    if ((this.uiState === this.gameUIStates.selectingTile) || (this.uiState === this.gameUIStates.tileSelected)) {
      this.setState({ selectedRackTile: idx , instructionsText: this.uiInstructionsText.tileSelected});
      this.updateUIState(this.gameUIStates.tileSelected);
    }
  }

  onRackTileDragStart(evt, idx) {
    this.isDragging = true;
    this.rackTileIdx = idx;
  }

  onGridTileClicked(idx) {
    if ((this.uiState === this.gameUIStates.tileSelected) && (this.state.gameGrid[idx].value === "")) {
      let selectedTileVal = this.state.tileArr[this.state.selectedRackTile].value;
      let newTileArr = update(this.state.tileArr, {[this.state.selectedRackTile]: {value: {$set: ""}}});
      let newGameGrid = update(this.state.gameGrid, {[idx]: {value: {$set: selectedTileVal}}});
      this.setState({tileArr: newTileArr, gameGrid: newGameGrid, tilePlacementLoc: idx, instructionsText: this.uiInstructionsText.buildWordStart});
      this.updateUIState(this.gameUIStates.buildWordStart);
    }
  }

  onGridTileMouseDown(idx) {
    if ((this.uiState === this.gameUIStates.buildWordStart)
     || (this.uiState === this.gameUIStates.wordBuilt)) {
      if (this.state.gameGrid[idx].value !== "") {
        this.setState({
          builtWord: this.state.gameGrid[idx].value,
          buildIndices: [idx]
        });
        this.setState({instructionsText: this.uiInstructionsText.wordBuilt});
        this.updateUIState(this.gameUIStates.wordBuilding);
        window.addEventListener("mouseup", this.mouseUpFunc);
      }
    }
  }

  onGridTileDragEnter(evt, idx) {
    this.setState({draggedOverTile: idx});
    evt.preventDefault();
  }

  onGridTileDragOver(evt, idx) {
    evt.preventDefault();
  }

  onGridTileDragLeave(evt, idx) {
    if (idx === this.state.draggedOverTile) {
      this.setState({draggedOverTile: null});
    }
    evt.preventDefault();
  }

  onGridTileDrop(evt, idx) {
    evt.preventDefault();
    if ((this.uiState === this.gameUIStates.tileSelected) && (this.state.gameGrid[idx].value === "")) {
      let selectedTileVal = this.state.tileArr[this.state.selectedRackTile].value;
      let newTileArr = update(this.state.tileArr, {[this.state.selectedRackTile]: {value: {$set: ""}}});
      let newGameGrid = update(this.state.gameGrid, {[idx]: {value: {$set: selectedTileVal}}});
      this.setState({
        tileArr: newTileArr,
        gameGrid: newGameGrid,
        tilePlacementLoc: idx,
        instructionsText: this.uiInstructionsText.buildWordStart,
        draggedOverTile: null
      });
      this.updateUIState(this.gameUIStates.buildWordStart);
    } else {
      this.setState({draggedOverTile: null})
    }
  }

  onGridTileEnter(idx) {
    if ((this.uiState === this.gameUIStates.wordBuilding)) {
      if (this.state.gameGrid[idx].value !== "") {
        // If the tile we're going into is one away from the top of the list, then
        // just pop the last item off the list
        if ((this.state.buildIndices.length > 1) && (this.state.buildIndices.indexOf(idx) === this.state.buildIndices.length-2)) {
          let newIndicesArray = [...this.state.buildIndices];
          let lastIdx = newIndicesArray.pop();
          let lastCharLength = this.state.gameGrid[lastIdx].value.length;
          let newWord = this.state.builtWord.substring(0, this.state.builtWord.length - lastCharLength);
          this.setState({
            builtWord: newWord,
            buildIndices: newIndicesArray
          });
        } else if (
          (this.state.buildIndices.indexOf(idx) === -1)
          && this.areIndicesAdjacent(idx, this.state.buildIndices[this.state.buildIndices.length-1])
        ) {
          let newWord = this.state.builtWord + this.state.gameGrid[idx].value;
          let newIndicesArray = [...this.state.buildIndices, idx];
          this.setState({
            builtWord: newWord,
            buildIndices: newIndicesArray
          });
        }
      }
    }
  }

  areIndicesAdjacent(firstIdx, secondIdx) {
    let {x: firstX, y: firstY} = getXYFromIndex(firstIdx);
    let {x: secondX, y: secondY} = getXYFromIndex(secondIdx);
    let deltaX = secondX-firstX;
    let deltaY = secondY-firstY;
    return ((Math.abs(deltaX) === 1) && (deltaY === 0))
        || ((deltaX === 0) && (Math.abs(deltaY) === 1))
        || ((deltaX === -1) && (deltaY === 1))
        || ((deltaX === 1) && (deltaY === -1));
  }

  resetToStartOfTurn() {
    this.setState({
      gameGrid: [...this.state.turnStartState.gameGrid],
      tileArr: [...this.state.turnStartState.tileArr],
      currentPlayer: this.state.turnStartState.currentPlayer,
      instructionsText: this.uiInstructionsText.selectingTile,
      builtWord: "",
      buildIndices: [],
      tilePlacementLoc: null,
      draggedOverTile: null,
      selectedRackTile: null
    });
    this.updateUIState(this.gameUIStates.selectingTile);
  }

  onPanelActionButtonClicked() {
    if (this.uiState === this.gameUIStates.buildWordStart) {
      // Fire up the confirmation dialog to make sure the player wants to end the turn
      // this.endTurn();
      this.setState({showConfirmation: true});
    } else if (this.uiState === this.gameUIStates.wordBuilt) {
      // Make the word
      let newGameGrid = [...this.state.gameGrid];
      for (let buildIdx of this.state.buildIndices) {
        newGameGrid[buildIdx] = {...newGameGrid[buildIdx],
          tileScore: this.scoreUpdateTable[this.state.currentPlayer][newGameGrid[buildIdx].tileScore+2]
        };
        this.setState({gameGrid: newGameGrid});
      }
      // And then end the turn
      this.endTurn();
    }
  }

  onPanelUndoButtonClicked() {
    this.resetToStartOfTurn();
  }

  endTurn() {
    // First of all, fill the empty tile with a new tile from the bag
    let newTileBagIdx = Math.floor(Math.random() * this.state.tileBag.length);
    let newTileValue = this.state.tileBag[newTileBagIdx];
    let newTileArr = update(this.state.tileArr, {[this.state.selectedRackTile]: {value: {$set: newTileValue}}})
    let newTileBag = update(this.state.tileBag, {$splice: [[newTileBagIdx, 1]]});
    // Then update the player whose turn it is
    let newPlayer = 1-this.state.currentPlayer;
    let prevWord = this.state.builtWord;
    this.setState({
      tileArr: newTileArr,
      tileBag: newTileBag,
      buildIndices: [],
      builtWord: "",
      tilePlacementLoc: null,
      previousWord: prevWord,
      selectedRackTile: undefined,
      currentPlayer: newPlayer
    });
    if (this.isGameOver()) {
      this.setState({instructionsText: this.uiInstructionsText.gameOver});
      this.updateUIState(this.gameUIStates.gameOver);
    } else {
      this.setState({
        instructionsText: this.uiInstructionsText.selectingTile,
        turnStartState: {
          gameGrid: [...this.state.gameGrid],
          tileArr: [...newTileArr],
          currentPlayer: newPlayer
        }
      });
      this.updateUIState(this.gameUIStates.selectingTile);
    }
  }

  isGameOver() {
    // Check all of our tiles to see if any are empty. If so, the game's not over.
    for (let tile of this.state.gameGrid) {
      if (tile.value === "")
        return false;
    }
    // If they're all full, then the game is done!
    return true;
  }

  gameScore() {
    return this.state.gameGrid.reduce(
      (scores, tile) => ({blue: scores.blue + (tile.tileScore < 0? 1 : 0),
                          red: scores.red + (tile.tileScore > 0? 1: 0)}),
      {blue: 0, red: 0}
    );
  }

  updateUIState(newState) {
    this.uiState = newState;
    this.setState({actionButtonText: this.actionButtonText[newState]});
  }

  onCancelModal() {
    this.setState({showConfirmation: false});
  }

  onOKModal() {
    this.setState({showConfirmation: false});
    this.endTurn();
  }

  render() {
    return (
      <div className="wrapper">
        <ModalDialog
          show = {this.state.showConfirmation}
          onCancelClick = {() => this.onCancelModal()}
          onOKClick = {() => this.onOKModal()}
        >
          Are you sure you want to end your turn without submitting a word?
        </ModalDialog>
        <div className="game">
          <GameBoard
            tileGrid={this.state.gameGrid}
            buildIndices={this.state.buildIndices}
            tilePlacementLoc={this.state.tilePlacementLoc}
            draggedOverTile = {this.state.draggedOverTile}
            onTileClicked = {(idx) => this.onGridTileClicked(idx)}
            onTileMouseEnter = {(idx) => this.onGridTileEnter(idx)}
            onTileMouseDown = {(idx) => this.onGridTileMouseDown(idx)}
            onTileDragOver = {(evt, idx) => this.onGridTileDragOver(evt, idx)}
            onTileDragEnter = {(evt, idx) => this.onGridTileDragEnter(evt, idx)}
            onTileDragLeave = {(evt, idx) => this.onGridTileDragLeave(evt, idx)}
            onTileDrop = {(evt, idx) => this.onGridTileDrop(evt, idx)}
          />
          <TileRack
            tileArr = {this.state.tileArr}
            selectedIdx = {this.state.selectedRackTile}
            onTileClicked = {(idx) => this.onRackTileClicked(idx)}
            onTileDragStart = {(evt, idx) => this.onRackTileDragStart(evt, idx)}
          />
        </div>
        <div className="interactionPanel">
          <InteractionPanel
            currentPlayer = {this.state.currentPlayer}
            currentWord = {this.state.builtWord}
            previousWord = {this.state.previousWord}
            instructionsText = {this.state.instructionsText}
            actionButtonText = {this.state.actionButtonText}
            showUndoButton = {(this.uiState !== this.gameUIStates.selectingTile) && (this.uiState !== this.gameUIStates.tileSelected)}
            onActionButtonClick = {() => this.onPanelActionButtonClicked()}
            onUndoButtonCLick = {() => this.onPanelUndoButtonClicked()}
            gameScore = {this.gameScore()}
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
