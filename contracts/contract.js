import Web3 from "web3";

const jsonInterface = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
    ],
    name: "subcribeToCreator",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "witdrawBalance",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawCommission",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ContractOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ContractOwnerBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "Subscriptions",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tier",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const web3 = new Web3(Web3.givenProvider);
const address = "0x991d4BF206Ec205CC23BB1A851D0bF3F068b20A6";
const contract = new web3.eth.Contract(jsonInterface, address);

export default contract;
