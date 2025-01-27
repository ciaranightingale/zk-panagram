// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import ERC1155 contract (NFT)
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {UltraVerifier} from "./UltraVerifier.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Panagram is ERC1155, Ownable {
    UltraVerifier public verifier;

    // Tracking if a round is active
    bool public isRoundActive;

    // Keep track of the winner of the current round
    address public currentRoundWinner;

    // Mapping to track number of wins for each address
    mapping(address => uint256) public winnerWins;

    // To track if the first winner has already been minted an NFT in this round
    bool public firstWinnerMinted;
    // bytes32 public answer = hex"6cc38c64ff58883dc5c30197e60cecdb104addb4d158e307e992e6491e64fb1c";

    // Events
    event RoundStarted();
    event RoundEnded(address winner);
    event NFTMinted(address winner, uint256 tokenId);
    event VerifierUpdated(UltraVerifier verifier);
    event ProofSucceeded(bool result);

    error IncorrectGuess();
    error RoundNotActive();
    error RoundAlreadyEnded();

    constructor(UltraVerifier _verifier)
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
                "https://ipfs.io/ipfs/bafybeidopttqwsogbmefsajlpziuoqvcnn7h2xf3hh36e5eirmr73uij5y/",
                Strings.toString(_id),
                ".json"
            )
        );
    }

    function contractURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/bafybeidopttqwsogbmefsajlpziuoqvcnn7h2xf3hh36e5eirmr73uij5y/collection.json";
    }

    // Only the owner can start and end the round
    function startRound() external onlyOwner {
        require(!isRoundActive, "A round is already active.");
        isRoundActive = true;
        firstWinnerMinted = false;
        currentRoundWinner = address(0);
        emit RoundStarted();
    }

    function endRound() external onlyOwner {
        require(isRoundActive, "No round is active.");
        require(currentRoundWinner != address(0), "No winner yet.");

        isRoundActive = false;
        emit RoundEnded(currentRoundWinner);
    }

    // Verify the guess and mint NFT if first or subsequent correct guesses
    function verifyEqual(bytes calldata proof) external returns (bool) {
        if (!isRoundActive) {
            revert RoundNotActive();
        }
        bytes32[] memory inputs = new bytes32[](0);
        bool proofResult = verifier.verify(proof, inputs);
        emit ProofSucceeded(proofResult);
        if (!proofResult) {
            revert IncorrectGuess();
        }

        // If this is the first correct guess, mint NFT with id 1
        if (!firstWinnerMinted) {
            firstWinnerMinted = true;
            currentRoundWinner = msg.sender;
            winnerWins[msg.sender]++; // Increment wins for the first winner
            _mint(msg.sender, 0, 1, ""); // Mint NFT with ID 0
            emit NFTMinted(msg.sender, 0);
        } else {
            // If someone is the second or further correct guesser, mint NFT with id 2
            if (msg.sender != currentRoundWinner) {
                _mint(msg.sender, 1, 1, ""); // Mint NFT with ID 1
                emit NFTMinted(msg.sender, 1);
            }
        }
        return proofResult;
    }

    // Allow updating the verifier (only the owner)
    function setVerifier(UltraVerifier _verifier) external onlyOwner {
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }

    // Getter for current round status
    function getCurrentRoundStatus() external view returns (bool, address, bool) {
        return (isRoundActive, currentRoundWinner, firstWinnerMinted);
    }
}
