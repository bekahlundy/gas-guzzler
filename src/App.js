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
      transactionHash: '',
      transactionValid: '',
      web3: null
    }
    this.handleChange = this.handleChange.bind(this);
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

        // Instantiate contract once web3 provided.
        this.getRobotsForUser()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
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
          console.log('Robot', robot)
        })
      })
    })
  }

  claimRobot(robot) {
    const contract = require('truffle-contract')
    const robotContract = contract(RobotContract)
    robotContract.setProvider(this.state.web3.currentProvider)
    var robotContractInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      robotContract.deployed().then((instance) => {
        robotContractInstance = instance
        var account = accounts[0];
        return robotContractInstance.claimRobot(parseInt('#' + robot.id, 16), { from: account, value: 1000000000000000 });
      }).then((result) => {
        console.log('Robot result (ca function)', result)
      })
    })
  }

  handleChange(event) {
    this.setState({ transactionHash: event.target.value });
  }

  handleSubmit(event) {
    // now we can take this.state.transactionHash and do whatever we want with it 
    // webs.eth.getTransaction()
    // if failed, makeRobot()
    // if not failed, returnError()
    console.log('Transaction hash: ', this.state.transactionHash);

    event.preventDefault();

    var txVerbose = null;
    
    this.state.web3.eth.getTransactionReceipt(this.state.transactionHash).then((result) => {
      console.log(result);
      
      txVerbose = result;

      if (!txVerbose) {
        this.setState({transactionValid: 'This transaction is not valid'});
      } else {
        if (txVerbose.status === 0 || txVerbose.status === "0x00") {
          this.setState({transactionValid: 'This transaction is valid and failed'});
          this.generateRoboHash(txVerbose);
        } else {
          this.setState({transactionValid: 'This transaction is valid and a success'});
        }
      }
    });
    
  }

  generateRoboHash(tx) {
    var background = 'bg3';
    var roboColor = 'yellow';
    if (tx.blockNumber % 2 == 0) {
      background = 'bg2';
    } else {
      background = 'bg1';
    }

    if (tx.gasUsed >= 6721975) {
      roboColor = 'red';
    } else {
      roboColor = 'green';
    }

    this.state.fakeData = [];
    var data = { bg: background, color: roboColor, id: tx.transactionHash, title: 'Your Robit', size: '250x250' };
    this.state.fakeData.push(data);
    
    console.log(this.state.fakeData);
    this.forceUpdate();
  }

  handleTileClick(event) {
    this.claimRobot(event);
    console.log('click', event);
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
                <input type="text" name="name" value={this.state.value} onChange={this.handleChange} />
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
              <p>The stored value is: {this.state.storageValue}</p>
              <p>{this.state.transactionValid}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
