const tokenContract = artifacts.require('./RobotERC721.sol')
const BigNumber = web3.BigNumber
  
contract('RobotERC721', accounts => {
  var owner = accounts[0]  
  let robot

  beforeEach(async function () {
    robot = await tokenContract.new({ from: owner })
  })

  it('initial state', async function () { 
    const name = await robot.name()
    const symbol = await robot.symbol()

    assert.equal(name, "robot")
    assert.equal(symbol, "HEX")
  })

  it('has correct owner', async function () { 
    const actualOwner = await robot.owner()
    assert.equal(actualOwner, owner)
  })

  describe('can mint robot', () => { 
    let robotId = 16711680;
    let tx; 
    let price = new web3.BigNumber(10000000000000000)
    
    beforeEach(async function () { 
      tx = await robot.mint(robotId, { from:owner, value:price }) 
    })

    it('can mint us a robot', async function () { 
      assert(robot.ownerOf(robotId), owner)
      assert.equal(tx.logs[0].event, 'Transfer')
    })

    it('can retrieve tokens for the owner', async function () { 
      let tokens = await robot.tokensOf(owner)

      assert.equal(tokens.length, 1)
      assert.equal(tokens[0, new web3.BigNumber(robotId)])
    })

    it('cant mint tokens that have been minted before', async function () { 
      await expectThrow(robot.mint(robotId, {from:owner}))
    })
  })

  var expectThrow = async promise => {
    try {
      await promise;
    } catch (error) {
      // TODO: Check jump destination to destinguish between a throw
      //       and an actual invalid jump.
      const invalidOpcode = error.message.search('invalid opcode') >= 0;
      // TODO: When we contract A calls contract B, and B throws, instead
      //       of an 'invalid jump', we get an 'out of gas' error. How do
      //       we distinguish this from an actual out of gas event? (The
      //       testrpc log actually show an 'invalid jump' event.)
      const outOfGas = error.message.search('out of gas') >= 0;
      const revert = error.message.search('revert') >= 0;
      assert(
        invalidOpcode || outOfGas || revert,
        'Expected throw, got \'' + error + '\' instead',
      );
      return;
    }
    assert.fail('Expected throw not received');
  };
})