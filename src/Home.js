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
            loading: false,
            name: '',
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

    handleChange(event) {
        this.setState({ transactionHash: event.target.value });
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
                return robotContractInstance.claimRobot(robot.id, 100, { from: account, value: 1000000000000000 });
            }).then((result) => {
                console.log('Robot result (ca function)', result)
            })
        })
    }

    handleTileClick(event) {
        this.claimRobot(event);
        console.log('click', event);
    }

    handleSubmit(event) {
        this.setState({ loading: true })
        // this.startLoader();
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
                this.setState({ transactionValid: 'This transaction is not valid' });
            } else {
                if (txVerbose.status === 0 || txVerbose.status === "0x00") {
                    this.setState({ transactionValid: 'This transaction is valid and failed, have a robot!' });
                    this.generateRoboHash(txVerbose);
                } else {
                    this.setState({ transactionValid: 'This transaction is valid and a success - no robot for you.' });
                }
            }
            this.setState({ submitted: true });
            setTimeout(() => { this.setState({ loading: false }); }, 2000);

        });

    }

    getName() {
        var firstNames = ['space', 'bubbles', 'cutie', 'sad', 'bubby', 'strong', 'metal', 'tin', 'beep', 'bop'];
        var lastNames = ['dummy', 'prince', 'beep', 'bop', 'battery', 'nail', 'hammer', 'buddy', 'oilcan', 'pal', 'hunny'];
        var first = firstNames[Math.floor(Math.random() * firstNames.length)];
        var last = lastNames[Math.floor(Math.random() * lastNames.length)];
        this.setState({ name: first + ' ' + last });
    }

    generateRoboHash(tx) {
        this.getName();
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
        var data = { bg: background, color: roboColor, id: tx.transactionHash, title: this.state.name, size: '250x250' };
        this.state.robotData.push(data);

        console.log(this.state.robotData);
        this.forceUpdate();
    }

    handleTileClick(event) {
        this.claimRobot(event);
        console.log('click', event);
    }

    render() {
        if (this.state.submitted && this.state.loading) {
            return (
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <div className="header-slide">
                            <h1 className="page-title">Robot</h1>
                            <form onSubmit={this.handleSubmit}>
                                <input className='input-field' type="text" name="name" placeholder="Enter failed transaction hash here..." value={this.state.value} onChange={this.handleChange} />
                                <input className='btn-submit' type="submit"
                                    value="Submit" />
                            </form>
                            <span className="loading style-2"></span>

                            <span className="loading style-1"></span>

                            <span className="loading style-2"></span>
                        </div>

                    </div>
                </div>
            )
        }
        else if (this.state.submitted && !this.state.loading) {
            return (
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <div className="header-slide">
                            <h1 className="page-title">Robot</h1>
                            <form onSubmit={this.handleSubmit}>
                                <input className='input-field' type="text" name="name" placeholder="Enter failed transaction hash here..." value={this.state.value} onChange={this.handleChange} />
                                <input className='btn-submit' type="submit"
                                    value="Submit" />
                            </form>
                            <p>{this.state.transactionValid}</p>
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
                                        size="300x300"
                                        title={robot.title}
                                        renderButton={true}
                                        handleTileClick={() => this.handleTileClick(robot)}
                                    />
                                )
                            })}
                        </div>
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
                                <input className='input-field' type="text" name="name" placeholder="Enter failed transaction hash here..." value={this.state.value} onChange={this.handleChange} />
                                <input className='btn-submit' type="submit"
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