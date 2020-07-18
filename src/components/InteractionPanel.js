import React from 'react';


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

export default InteractionPanel;
  