var RobotERC721 = artifacts.require("RobotERC721");

module.exports = function(done) {
    console.log("Getting deployed version of RobotERC721...");
    var account_zero = web3.eth.accounts[0]; // an address
    console.log("Executing transaction from account " + account_zero + "...");
    RobotERC721.deployed().then(function(instance) {
        return instance.neverEndingLoop().then(function(result) {
            console.log('Success - this shouldn\'t have happened because this transaction is designed to fail...');
            done();
        }).catch(function(vmException) {
            console.log(vmException.message);
            done();
        });
    }).then(function(result) {
        done();
    }).catch(function(transactionException) {
        console.log(transactionException.message);
        done();
    });
}