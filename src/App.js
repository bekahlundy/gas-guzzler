import React, { Component } from 'react'
import RobotContract from '../build/contracts/RobotERC721.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      transactionHash: '',
      web3: null,
      transactionValid: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      this.geRobotsForUser()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  geRobotsForUser() {
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

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    let color = "";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return "#" + color;
  }

  mintRobot() {
    const contract = require('truffle-contract')
    const robotContract = contract(RobotContract)
    robotContract.setProvider(this.state.web3.currentProvider)
    var robotContractInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      robotContract.deployed().then((instance) => {
        robotContractInstance = instance
        var account = accounts[0];
        return robotContractInstance.mint(parseInt(this.getRandomColor(), 16), {from: account, value: this.state.web3.BigNumber(1000000000000000)});
      }).then((result) => {
        console.log('Robot', result)
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
        if (txVerbose.status === 0) {
          this.setState({transactionValid: 'This transaction is valid and failed'});
        } else {
          this.setState({transactionValid: 'This transaction is valid and a success'});
        }
      }
    });
    
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
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
