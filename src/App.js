import React, { Component } from 'react'
import RobotContract from '../build/contracts/RobotERC721.json'
import { Link, Route, Switch } from 'react-router-dom'
// import Tile from './Tile'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import MyBots from './MyBots';
import Home from './Home';

const NavBar = () => (
  <div className="navbar pure-menu pure-menu-horizontal">
    <Link className="nav-link" to='/'>Home</Link>
    <div className="space-between"></div>
    <Link className="nav-link" to='/mybots'>My Bots</Link>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div className="App">
        <NavBar />

        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/mybots' component={MyBots} />
        </Switch>
      </div>
    );
  }
}

export default App
