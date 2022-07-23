// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.15;

contract BlockchainSubscription {

    address public ContractOwner;
    uint public ContractOwnerBalance;

    constructor () payable {
        ContractOwner = msg.sender;
        }

    struct Subscription {
        uint timestamp;
        uint amount;
        uint tier;
        }

    mapping (address => mapping (address => Subscription)) public Subscriptions;
    mapping (address => uint) public balances;

    function subcribeToCreator(uint _tier, address _creator) public payable {
        uint thirdOfAmount = msg.value / 3;
        uint twoThirdsAmount = thirdOfAmount * 2;
        payable(address(this)).transfer(msg.value);
        Subscription storage s = Subscriptions[msg.sender][_creator];
        s.timestamp = block.timestamp;
        s.amount = msg.value;
        s.tier = _tier;
        ContractOwnerBalance = ContractOwnerBalance + thirdOfAmount;
        balances[_creator] = balances[_creator] + twoThirdsAmount;
    }
    function witdrawBalance () public payable {
        payable(address(msg.sender)).transfer(balances[msg.sender]);
    }
    function withdrawCommission () public payable {
        require(msg.sender == ContractOwner, "Not the Contract Owner");
        payable(ContractOwner).transfer(ContractOwnerBalance);
    }
}