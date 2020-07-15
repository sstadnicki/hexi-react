import React from 'react';

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
  
  export default GameTile;