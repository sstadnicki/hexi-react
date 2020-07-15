import React from 'react';
import GameTile from './GameTile';

function getXYFromIndex(idx, boardSize) {
    return {x: idx % boardSize, y: Math.floor(idx/boardSize)};
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
                let {x: colIdx, y: rowIdx} = getXYFromIndex(elIdx, this.props.boardSize);
                let arrayIdx = this.props.buildIndices.indexOf(elIdx);
                let tileSelected = (arrayIdx !== -1);
                let nextDirection = null;
                if (tileSelected && (arrayIdx < this.props.buildIndices.length-1)) {
                    let nextXY = getXYFromIndex(this.props.buildIndices[arrayIdx+1], this.props.boardSize);
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

export default GameBoard;
export { getXYFromIndex };
  
