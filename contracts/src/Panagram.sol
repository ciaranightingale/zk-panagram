// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import ERC1155 contract (NFT)
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IVerifier} from "./HonkVerifier.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Panagram is ERC1155, Ownable {
    IVerifier public verifier;

    // Tracking if a round is active
    bool public isRoundActive;

    uint256 public currentRound;

    // Keep track of the winner of the current round
    address public currentRoundWinner;

    // Mapping to track number of wins for each address
    mapping(address => uint256) public winnerWins;

    // Track which round a user last guessed correctly
    mapping(address => uint256) public lastCorrectGuessRound;

    // To track if the first winner has already been minted an NFT in this round
    bool public firstWinnerMinted;
    // bytes32 public answer = hex"6cc38c64ff58883dc5c30197e60cecdb104addb4d158e307e992e6491e64fb1c";

    // Events
    event Panagram__RoundStarted();
    event Panagram__RoundEnded(address winner);
    event Panagram__NFTMinted(address winner, uint256 tokenId);
    event Panagram__VerifierUpdated(IVerifier verifier);
    event Panagram__ProofSucceeded(bool result);

    error Panagram__IncorrectGuess();
    error Panagram__RoundNotActive();
    error Panagram__RoundAlreadyEnded();
    error Panagram__RoundAlreadyActive();
    error Panagram__NoRoundWinner();
    error Panagram__AlreadyAnsweredCorrectly();

    constructor(IVerifier _verifier)
        ERC1155("https://ipfs.io/ipfs/bafybeidopttqwsogbmefsajlpziuoqvcnn7h2xf3hh36e5eirmr73uij5y/{id}.json")
        Ownable(msg.sender)
    {
        verifier = _verifier;
        isRoundActive = false;
        firstWinnerMinted = false;
    }

    // Override the uri function to provide token-specific metadata
    function uri(uint256 _id) public view override returns (string memory) {
        return string(
            abi.encodePacked(
                "ipfs://bafybeidopttqwsogbmefsajlpziuoqvcnn7h2xf3hh36e5eirmr73uij5y/", Strings.toString(_id), ".json"
            )
        );
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://bafybeidopttqwsogbmefsajlpziuoqvcnn7h2xf3hh36e5eirmr73uij5y/collection.json";
    }

    // Only the owner can start and end the round
    function startRound() external onlyOwner {
        if (isRoundActive) {
            revert Panagram__RoundAlreadyActive();
        }
        isRoundActive = true;
        firstWinnerMinted = false;
        currentRoundWinner = address(0);
        emit Panagram__RoundStarted();
    }

    function endRound() external onlyOwner {
        if (!isRoundActive) {
            revert Panagram__RoundNotActive();
        }
        if (currentRoundWinner == address(0)) {
            revert Panagram__NoRoundWinner();
        }

        isRoundActive = false;
        currentRound++;
        emit Panagram__RoundEnded(currentRoundWinner);
    }

    // Verify the guess and mint NFT if first or subsequent correct guesses
    function verifyEqual(bytes calldata proof) external returns (bool) {
        if (!isRoundActive) {
            revert Panagram__RoundNotActive();
        }
        bytes32[] memory inputs = new bytes32[](0);
        if (lastCorrectGuessRound[msg.sender] >= currentRound) {
            revert Panagram__AlreadyAnsweredCorrectly();
        }
        bool proofResult = verifier.verify(proof, inputs);
        emit Panagram__ProofSucceeded(proofResult);
        if (!proofResult) {
            revert Panagram__IncorrectGuess();
        }
        lastCorrectGuessRound[msg.sender] = currentRound;
        // If this is the first correct guess, mint NFT with id 1
        if (!firstWinnerMinted) {
            firstWinnerMinted = true;
            currentRoundWinner = msg.sender;
            winnerWins[msg.sender]++; // Increment wins for the first winner
            _mint(msg.sender, 0, 1, ""); // Mint NFT with ID 0
            emit Panagram__NFTMinted(msg.sender, 0);
        } else {
            // If someone is the second or further correct guesser, mint NFT with id 2
            if (msg.sender != currentRoundWinner) {
                _mint(msg.sender, 1, 1, ""); // Mint NFT with ID 1
                emit Panagram__NFTMinted(msg.sender, 1);
            }
        }
        return proofResult;
    }

    // Allow updating the verifier (only the owner)
    function setVerifier(IVerifier _verifier) external onlyOwner {
        verifier = _verifier;
        emit Panagram__VerifierUpdated(_verifier);
    }

    // Getter for current round status
    function getCurrentRoundStatus() external view returns (bool, address, bool) {
        return (isRoundActive, currentRoundWinner, firstWinnerMinted);
    }
}
