import React, { Component } from 'react'
import RobotContract from '../build/contracts/RobotERC721.json'
import Tile from './Tile'

import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

var boxOne = document.getElementsByClassName('header-slide')[0]


class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            robotData: [],
            storageValue: 0,
            submitted: false,
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

    handleChange(event) {
        this.setState({ transactionHash: event.target.value });
    }

    handleSubmit(event) {
        // now we can take this.state.transactionHash and do whatever we want with it 
        // webs.eth.getTransaction()
        // if failed, makeRobot()
        // if not failed, returnError()
        console.log('Transaction hash: ', this.state.transactionHash);

        document.getElementsByClassName('toggle-button')[0].onclick = function() {
            if(this.innerHTML === 'Submit') 
            { 
              this.innerHTML = 'Pause';
              boxOne.classList.add('horizTranslate');
            } else {
              this.innerHTML = 'Submit';
              var computedStyle = window.getComputedStyle(boxOne),
                  marginLeft = computedStyle.getPropertyValue('margin-left');
              boxOne.style.marginLeft = marginLeft;
              boxOne.classList.remove('horizTranslate');    
            }  
          }

        event.preventDefault();

        var txVerbose = null;

        this.state.web3.eth.getTransactionReceipt(this.state.transactionHash).then((result) => {
            console.log(result);

            txVerbose = result;

            if (!txVerbose) {
                this.setState({ transactionValid: 'This transaction is not valid' });
            } else {
                if (txVerbose.status === 0 || txVerbose.status === "0x00") {
                    this.setState({ transactionValid: 'This transaction is valid and failed' });
                    this.generateRoboHash(txVerbose);
                } else {
                    this.setState({ transactionValid: 'This transaction is valid and a success' });
                }
            }
            this.setState({ submitted: true });
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

        this.state.robotData = [];
        var data = { bg: background, color: roboColor, id: tx.transactionHash, title: 'Your Robit', size: '250x250' };
        this.state.robotData.push(data);

        console.log(this.state.robotData);
        this.forceUpdate();
    }

    handleTileClick(event) {
        this.claimRobot(event);
        console.log('click', event);
    }

    render() {
        if (this.state.submitted) {
            return (
                <div className="pure-g">
                    <div className="pure-u-1-1">
                    <div className="header-slide">
                        <h1 className="page-title">Robot</h1>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Transaction Hash:
                    <input type="text" name="name" value={this.state.value} onChange={this.handleChange} />
                            </label>
                            <input type="submit"
                                value="Submit" />
                        </form>
                        </div>
                        <div className='tile-container'>
                            {this.state.robotData.map(robot => {
                                return (
                                    <Tile
                                        bg={robot.bg}
                                        color={robot.color}
                                        claim={true}
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

        } else {
            return (
                <div className="pure-g">
                    <div className="pure-u-1-1">
                    <div className="header-slide">
                        <h1 className="page-title">Robot</h1>
                        <form onSubmit={this.handleSubmit}>
                            <input className='input-field' type="text" name="name" placeholder="Enter transaction hash here..." value={this.state.value} onChange={this.handleChange} />
                            <input className='btn-submit toggle-button' type="submit"
                                value="Submit" />
                        </form>
                        </div>

                    </div>
                </div>
            )
        }
    }
}

export default Home;