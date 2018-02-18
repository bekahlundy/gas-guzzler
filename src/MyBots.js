
import React, { Component } from 'react'

import RobotContract from '../build/contracts/RobotERC721.json'
import Tile from './Tile'

import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class MyBots extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fakeData: [
                { bg: 'bg1', color: 'blue', id: 123456, title: 'test1', size: '100x100' },
                { bg: 'bg2', color: 'pink', id: 223456, title: 'test2', size: '200x200' },
                { bg: 'bg3', color: 'green', id: 323456, title: 'test3', size: '300x300' }
              ]
        }
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

      render() {
        return (
          <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Robots</h1>
            <div className='tile-container'>
              {this.state.fakeData.map(robot => {
                return (
                  <Tile
                    bg={robot.bg}
                    color={robot.color}
                    id={robot.id}
                    key={robot.id}
                    size={robot.size}
                    title={robot.title}
                    handleTileClick={() => this.handleTileClick(robot)}
                  />
                )
              })}
            </div>
            <p>The stored value is: {this.state.storageValue}</p>
          </div>
        </div>
        )
    }
}

export default MyBots;