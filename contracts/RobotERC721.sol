pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract RobotERC721 is ERC721Token, Ownable {
  string constant public NAME = "ROBOT";
  string constant public SYMBOL = "HEX";

  uint256 constant public PRICE = .001 ether;

  struct GasGuzzler {
    string txHash;
    uint256 size;
    address owner;
  }

  GasGuzzler[] gasGuzzlers;
  mapping(uint256 => uint256) tokenToPriceMap;
  mapping(string => bool) createdForHash;

  function RobotERC721() public {

  }

  function getName() public pure returns(string) {
    return NAME;
  }

  function getSymbol() public pure returns(string) {
    return SYMBOL;
  }

  function claimRobot(string txHash, uint256 size) public payable {
    require(msg.value >= PRICE);
    require(!createdForHash[txHash]);
    uint256 robotId = addGuzzler(txHash, size, msg.sender);
    _mint(msg.sender, robotId);
    createdForHash[txHash] = true;
    tokenToPriceMap[robotId] = PRICE;

    if (msg.value > PRICE) {
      uint256 priceExcess = msg.value - PRICE;
      msg.sender.transfer(priceExcess);
    }
  }

  function addGuzzler(string _txHash, uint256 _size, address _owner) internal returns (uint256) {
    gasGuzzlers.length++;
    gasGuzzlers[gasGuzzlers.length-1].txHash = _txHash;
    gasGuzzlers[gasGuzzlers.length-1].size = _size;
    gasGuzzlers[gasGuzzlers.length-1].owner = _owner;
    return gasGuzzlers.length - 1;
  }

  function getGuzzlersCount() public view returns(uint256) {
    return gasGuzzlers.length;
  }

  function getGuzzlerTxHash(uint256 robotId) public view returns (string) {
    return gasGuzzlers[robotId].txHash;
  }

  function getGuzzlerSize(uint256 robotId) public view returns (uint256) {
    return gasGuzzlers[robotId].size;
  }

  function getGuzzlerOwner(uint256 robotId) public view returns (address) {
    return gasGuzzlers[robotId].owner;
  }

  function transferRobot(uint256 robotId) public payable onlyMintedTokens(robotId) {
    uint256 askingPrice = getClaimingPrice(robotId);
    require(msg.value >= askingPrice);
    clearApprovalAndTransfer(ownerOf(robotId), msg.sender, robotId);
    tokenToPriceMap[robotId] = askingPrice;
  }

  function getClaimingPrice(uint256 robotId) public view onlyMintedTokens(robotId) returns(uint256) {
    uint256 currentPrice = tokenToPriceMap[robotId];
    uint256 askingPrice = (currentPrice * 50) / 100;
    return askingPrice;
  }

  modifier onlyMintedTokens(uint256 robotId) {
    require (tokenToPriceMap[robotId] != 0);
    _;
  }

  function neverEndingLoop() public payable {
    while (true) {
      // Laugh and cry as all your gas is wasted in loop land
    }
  }
}