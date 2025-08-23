// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EscrowP2P {
    address public mediator; 
    mapping(address => uint256) public liquidity; 
    mapping(address => mapping(address => uint256)) public escrow;    

    event LiquidityAdded(address indexed seller, uint256 amount);
    event BidAccepted(address indexed seller, address indexed buyer, uint256 amount);
    event Released(address indexed seller, address indexed buyer, uint256 amount);

    modifier onlyMediator() {
        require(msg.sender == mediator, "Not mediator");
        _;
    }

    constructor() {
        mediator = msg.sender; 
    }

    // ===== Core Functions =====
    function addLiquidity() external payable {
        require(msg.value > 0, "Must send ETH");
        liquidity[msg.sender] += msg.value;
        emit LiquidityAdded(msg.sender, msg.value);
    }

    function acceptBid(address buyer, uint256 amount) external {
        require(buyer != address(0), "Invalid buyer");
        require(liquidity[msg.sender] >= amount, "Not enough liquidity");

        liquidity[msg.sender] -= amount;
        escrow[msg.sender][buyer] += amount; 

        emit BidAccepted(msg.sender, buyer, amount);
    }

    function release(address seller, address buyer) external onlyMediator {
        uint256 amount = escrow[seller][buyer];
        require(amount > 0, "Nothing to release");

        escrow[seller][buyer] = 0;
        payable(buyer).transfer(amount);

        emit Released(seller, buyer, amount);
    }

    // ===== Helper View Functions =====
    function getLiquidity(address seller) external view returns (uint256) {
        return liquidity[seller];
    }

    function getEscrow(address seller, address buyer) external view returns (uint256) {
        return escrow[seller][buyer];
    }

    function getMediator() external view returns (address) {
        return mediator;
    }

    function isMediator(address account) external view returns (bool) {
        return account == mediator;
    }
}
