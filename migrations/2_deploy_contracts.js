const RobotERC721 = artifacts.require("./RobotERC721.sol");

module.exports = function(deployer) {
  deployer.deploy(RobotERC721);
};
