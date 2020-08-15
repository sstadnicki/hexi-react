import React from 'react';
import ReactDOM from 'react-dom'; 
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import update from 'immutability-helper';
import './boardStyle.css';

import GameBoard, { getXYFromIndex } from './components/GameBoard';
import TileRack from './components/TileRack';
import ModalDialog from './components/ModalDialog';
import InteractionPanel from './components/InteractionPanel';
import { render } from '@testing-library/react';

const BOARD_SIZE = 5;

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

  uiState = undefined;

  isDragging = false;

  sampleJson=`
  {
    "gameBoard": {
      "gameGrid": [
        {"value": "", "tileScore": 0},
        {"value": "A", "tileScore": -1},
        {"value": "B", "tileScore": 1},
        {"value": "C", "tileScore": -1},
        {"value": "D", "tileScore": 1},
        {"value": "E", "tileScore": -1},
        {"value": "", "tileScore": 0},
        {"value": "F", "tileScore": -1},
        {"value": "G", "tileScore": 1},
        {"value": "H", "tileScore": -1},
        {"value": "I", "tileScore": 1},
        {"value": "J", "tileScore": -1},
        {"value": "", "tileScore": 0},
        {"value": "K", "tileScore": -1},
        {"value": "L", "tileScore": 1},
        {"value": "M", "tileScore": -1},
        {"value": "N", "tileScore": 1},
        {"value": "O", "tileScore": -1},
        {"value": "", "tileScore": 0},
        {"value": "P", "tileScore": -1},
        {"value": "R", "tileScore": 1},
        {"value": "S", "tileScore": -1},
        {"value": "T", "tileScore": 1},
        {"value": "U", "tileScore": -1},
        {"value": "", "tileScore": 0}
      ],
      "lastPlacedTile": 10,
      "lastWordIndices": [
        10, 12, 15, 11
      ]
    },
    "tileRack": {
      "tileArr": [
        {"value": "A"},
        {"value": "C"},
        {"value": "T"},
        {"value": "I"},
        {"value": "O"},
        {"value": "N"}
      ],
      "newTileIndex": 2
    },
    "currentPlayer": "Blue",
    "currentScore": [8, 4]
  }
  `;

  constructor(props) {
    super(props);
    this.state = {
        currentPlayer: null,
        gameGrid: Array(BOARD_SIZE*BOARD_SIZE).fill(null).map((el, index) => ({value: "", tileScore: 0})),
        tileArr: Array(6).fill(null).map((el, index) => ({value: ""})),
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

  componentDidMount() {

    let gameId = (this.props.match && this.props.match.params)? this.props.match.params.gameId: undefined;
    console.log(`fetching game ${gameId}`);
    fetch(
      `http://localhost:9999/api/games/${gameId}`,
      {crossDomain: true}
    )
    .then(res => res.json())
    .then(data => {
      this.setState({
        gameGrid: data.gameBoard.gameGrid,
        tileArr: data.tileRack.tileArr,
        currentPlayer: (data.currentPlayer == 0? "Blue": "Red")
      }); 
    });
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
    let {x: firstX, y: firstY} = getXYFromIndex(firstIdx, BOARD_SIZE);
    let {x: secondX, y: secondY} = getXYFromIndex(secondIdx, BOARD_SIZE);
    let deltaX = secondX-firstX;
    let deltaY = secondY-firstY;
    return ((Math.abs(deltaX) === 1) && (deltaY === 0))
        || ((deltaX === 0) && (Math.abs(deltaY) === 1))
        || ((deltaX === -1) && (deltaY === 1))
        || ((deltaX === 1) && (deltaY === -1));
  }

  adjacentIndicesList = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1},
    {x: -1, y: 1},
    {x: 1, y: -1}
  ];

  countAdjacentFilled(idx) {
    let {x, y} = getXYFromIndex(idx, BOARD_SIZE);
    let count = 0;
    for (let neighborDelta of this.adjacentIndicesList) {
      let testX = x+neighborDelta.x;
      let testY = y+neighborDelta.y;
      if ((testX < 0) || (testY < 0) || (testX >= BOARD_SIZE) || (testY >= BOARD_SIZE)) {
        continue;
      }
      let testIdx = BOARD_SIZE*testY+testX;
      if (this.state.gameGrid[testIdx].value !== "") {
        count++;
      }
    }
    return count;
  }

  couldBuildWord() {
    let index = this.state.tilePlacementLoc;
    // If we don't actually have a placed tile, then we can't build a word.
    if (!index) return false;
    let neighbors = this.countAdjacentFilled(index);
    // If we have no neighbors, we're definitely not able to build.
    if (neighbors === 0) return false;
    // If there are at least two filled tiles adjacent to the placed tile, we assume we can.
    if (neighbors > 1) return true;
    // Otherwise, we look for the (at most) one filled neighbor of the placed tile,
    // and check to see if _it_ has two neighbors.
    let {x, y} = getXYFromIndex(index, BOARD_SIZE);
    for (let neighborDelta of this.adjacentIndicesList) {
      let testX = x+neighborDelta.x;
      let testY = y+neighborDelta.y;
      if ((testX < 0) || (testY < 0) || (testX >= BOARD_SIZE) || (testY >= BOARD_SIZE)) {
        continue;
      }
      let testIdx = BOARD_SIZE*testY+testX;
      if (this.state.gameGrid[testIdx].value !== "") {
        return (this.countAdjacentFilled(testIdx) >= 2);
      }
    }
    // We should never get here, but we may as well just return false if we do.
    return false;
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
      if (this.couldBuildWord()) {
        // Fire up the confirmation dialog to make sure the player wants to end the turn
        this.setState({showConfirmation: true});
      } else {
        this.endTurn();
      }
    } else if (this.uiState === this.gameUIStates.wordBuilt) {
      // And then end the turn
      this.endTurn();
    }
  }

  onPanelUndoButtonClicked() {
    this.resetToStartOfTurn();
  }

  endTurn() {
    // Construct a submitted move representing the tile the player placed, where they placed it, and what word they made
    let submittedMove = {
      chosenTile: this.state.selectedRackTile,
      tileLocation: this.state.tilePlacementLoc,
      buildIndices: this.state.buildIndices
    };
    let submittedMoveJson = JSON.stringify(submittedMove);
    // This should be sent to the API, but for now, let's just print it to the console.
    let gameId = (this.props.match && this.props.match.params)? this.props.match.params.gameId: undefined;
    fetch(
      `http://localhost:9999/api/games/${gameId}`, {
        method: 'PUT',
        crossDomain: true,
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
         },
        body: submittedMoveJson
      }
    )
    // console.log(submittedMoveJson);
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
    this.endTurn(this.state.gameGrid);
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
        <div className="titleBar">
          Hexicography
        </div>
        <div className="buttonDiv">
          <button onClick={() => window.open("instructions.html")}>How To Play</button>
        </div>
        <div className="game">
          <GameBoard
            boardSize = {BOARD_SIZE}
            tileGrid = {this.state.gameGrid}
            buildIndices = {this.state.buildIndices}
            tilePlacementLoc = {this.state.tilePlacementLoc}
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

class MainPage extends React.Component {
  render() {
    return (
      <div>This is the main page!</div>
    );
  }
}

class GamesListItem extends React.Component {
  render() {
    return (
      <li id={this.props.id}>
      <Link to={`/game/${this.props.id}`}>{this.props.id}</Link>
      </li>
    )
  }
}

class GamesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {idList: []};
  }

  componentDidMount() {
    console.log(`fetching game list`);
    fetch(
      `http://localhost:9999/api/games/list`,
      {crossDomain: true}
    )
    .then(res => res.json())
    .then(data => {
      let idArr = data.map((element) => element._id);
      this.setState({idList: [...idArr]});
    });
  }

  createNew() {
    fetch(
      `http://localhost:9999/api/games/create`, {
        method: 'POST',
        crossDomain: true
      }
    )
    .then(res => res.json())
    .then(data => this.setState({idList: [...this.state.idList, data.gameId]}))
  }

  render() {
    return (
      <div>
        <ul className="gamesList">
          {
            this.state.idList.map((id) => 
            <GamesListItem id={id} />
            )
          }
        </ul>
        <button id="newGame" onClick={() => this.createNew()}>New Game</button>
      </div>
    );
  }

}

class HeaderBar extends React.Component {
  render() {
    return (
      <div><nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/games/">Games</Link></li>
          <li><Link to="/signin/">Sign In</Link></li>
        </ul>
      </nav></div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter>
    <HeaderBar />
    <Switch>
      <Route path="/games/" exact>
        <GamesList />
      </Route>
      <Route path="/game/:gameId" component={Game} />
      <Route path="/">
        <MainPage />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
