pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract RobotERC721 is ERC721Token, Ownable {
  string constant public NAME = "ROBOT";
  string constant public SYMBOL = "HEX";

  uint256 constant public PRICE = .001 ether;

  mapping(uint256 => uint256) tokenToPriceMap;

  function RobotERC721() public {

  }

  function getName() public pure returns(string) {
    return NAME;
  }

  function getSymbol() public pure returns(string) {
    return SYMBOL;
  }

  function claimRobot(uint256 robotId) public payable {
    require(msg.value >= PRICE);
    _mint(msg.sender, robotId);
    tokenToPriceMap[robotId] = PRICE;

    if (msg.value > PRICE) {
      uint256 priceExcess = msg.value - PRICE;
      msg.sender.transfer(priceExcess);
    }
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
}