import React from 'react';
import ReactDOM from 'react-dom'; 
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import HexicographyGame from './components/HexicographyGame';
///////////////////////////////////////////////////////////////////////////////

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
      <Route path="/game/:gameId" component={HexicographyGame} />
      <Route path="/">
        <MainPage />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
