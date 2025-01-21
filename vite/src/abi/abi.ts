export const abi = [
    {
        "inputs": [
            {
                "internalType": "contract UltraVerifier",
                "name": "_verifier",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "type": "error",
        "name": "ERC1155InsufficientBalance"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "ERC1155InvalidApprover"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "idsLength",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "valuesLength",
                "type": "uint256"
            }
        ],
        "type": "error",
        "name": "ERC1155InvalidArrayLength"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "ERC1155InvalidOperator"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "ERC1155InvalidReceiver"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "ERC1155InvalidSender"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "ERC1155MissingApprovalForAll"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "IncorrectGuess"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "OwnableInvalidOwner"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "OwnableUnauthorizedAccount"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "RoundAlreadyEnded"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "RoundNotActive"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "ApprovalForAll",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "winner",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "NFTMinted",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "OwnershipTransferred",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "winner",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "RoundEnded",
        "anonymous": false
    },
    {
        "inputs": [],
        "type": "event",
        "name": "RoundStarted",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]",
                "indexed": false
            },
            {
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "TransferBatch",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "TransferSingle",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "value",
                "type": "string",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "URI",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "contract UltraVerifier",
                "name": "verifier",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "VerifierUpdated",
        "anonymous": false
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "answer",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "balanceOfBatch",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "currentRoundWinner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "endRound"
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "firstWinnerMinted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "getCurrentRoundStatus",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "isRoundActive",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "renounceOwnership"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "safeBatchTransferFrom"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "safeTransferFrom"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "setApprovalForAll"
    },
    {
        "inputs": [
            {
                "internalType": "contract UltraVerifier",
                "name": "_verifier",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "setVerifier"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "commitment",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "startRound"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transferOwnership"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "uri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "verifier",
        "outputs": [
            {
                "internalType": "contract UltraVerifier",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "proof",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "verifyEqual",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "winnerWins",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    }
] as const