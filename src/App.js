import React, { Component } from 'react'
import RobotContract from '../build/contracts/RobotERC721.json'
import Tile from './Tile'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fakeData: [
        { bg: 'bg1', color: 'blue', id: 123456, title: 'test1', size: '100x100' },
        { bg: 'bg2', color: 'pink', id: 223456, title: 'test2', size: '200x200' },
        { bg: 'bg3', color: 'green', id: 323456, title: 'test3', size: '300x300' }
      ],
      storageValue: 0,
      web3: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        //Get all available robots
        this.initRobots()
        // Get user's tokens
        this.getRobotsForUser()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  initRobots() {
    // Need logic to 
    // 1. get all the transactions that ran out of gas
    // 2. Use failed transaction to determine 
    // 3. Return list
  }
  getRobotsForUser() {
    const contract = require('truffle-contract')
    const robotContract = contract(RobotContract)
    robotContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on robotContract.
    var robotContractInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      robotContract.deployed().then((instance) => {
        robotContractInstance = instance
        var account = accounts[0];
        return robotContractInstance.tokensOf(account)
      }).then((result) => {
        result.forEach((robot) => {
          // Render the robots
          console.log('Robot', robot.toString(10))
        })
      })
    })
  }

  claimRobot(robot) {
    const contract = require('truffle-contract')
    const robotContract = contract(RobotContract)
    robotContract.setProvider(this.state.web3.currentProvider)
    var robotContractInstance
    //check if this account is the same in the robot owner
    this.state.web3.eth.getAccounts((error, accounts) => {
      robotContract.deployed().then((instance) => {
        robotContractInstance = instance
        var account = accounts[0];
        return robotContractInstance.claimRobot(parseInt('#' + robot.id, 16), {from: account, value: 1000000000000000});
      }).then((result) => {
        console.log('Robot result (mint function)', result)
      })
    })
  }

  handleSubmit(event) {
    // webs.eth.getTransaction()
    // if failed, makeRobot()
    // if not failed, returnError()
    console.log('Transaction hash: ', event.target.value);

    event.preventDefault();

    var txVerbose = null;
    
    this.state.web3.eth.getTransactionReceipt(event.target.value).then((result) => {
      console.log(result);
      
      txVerbose = result;

      if (!txVerbose) {
        this.setState({transactionValid: 'This transaction is not valid'});
      } else {
        if (txVerbose.status === 0) {
          this.setState({transactionValid: 'This transaction is valid and failed'});
        } else {
          this.setState({transactionValid: 'This transaction is valid and a success'});
        }
      }
    });
  }

  handleTileClick(event) {
    this.claimRobot(event)
    console.log('click', event)
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Home</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Robot</h1>
              <form onSubmit={this.handleSubmit}>
                <label>
                  Transaction Hash:
                <input type="text" name="name" value={this.state.value} />
                </label>
                <input type="submit"
                  value="Submit" />
              </form>
              <div className='tile-container'>
                {this.state.fakeData.map(robot => {
                  return (
                    <Tile
                      key={robot.id}
                      id={robot.id}
                      size={robot.size}
                      bg={robot.bg}
                      color={robot.color}
                      handleTileClick={() => this.handleTileClick(robot)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default App
