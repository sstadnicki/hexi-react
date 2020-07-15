import React from 'react';
import GameTile from './GameTile';

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

export default TileRack;