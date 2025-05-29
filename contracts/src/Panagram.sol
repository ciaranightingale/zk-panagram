// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import ERC1155 contract (NFT)
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IVerifier} from "./Verifier.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Panagram is ERC1155, Ownable {
    IVerifier public s_verifier;

    uint256 public s_currentRound;

    // Keep track of the winner of the current round
    address public s_currentRoundWinner; // initially address(0)

    // Mapping to track number of wins for each address
    mapping(address => uint256) public s_winnerWins;

    // Track which round a user last guessed correctly
    mapping(address => uint256) public s_lastCorrectGuessRound;

    bytes32 public s_answer; // hash of the answer
    uint256 public MIN_DURATION = 10800; // minimum of 3 hours to prevent owner stopping the round early
    uint256 public s_roundStartTime;
    // Events

    event Panagram__RoundStarted();
    event Panagram__NFTMinted(address winner, uint256 tokenId);
    event Panagram__VerifierUpdated(IVerifier verifier);
    event Panagram__ProofSucceeded(bool result);

    error Panagram__IncorrectGuess();
    error Panagram__NoRoundWinner();
    error Panagram__AlreadyAnsweredCorrectly();
    error Panagram__InvalidTokenId();
    error Panagram__FirstPanagramNotSet();
    error Panagram__MinTimeNotPassed(uint256 mintTimePassed, uint256 currentTimePassed);

    constructor(IVerifier _verifier)
        ERC1155("ipfs://bafybeicqfc4ipkle34tgqv3gh7gccwhmr22qdg7p6k6oxon255mnwb6csi/{id}.json")
        Ownable(msg.sender)
    {
        s_verifier = _verifier;
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://bafybeicqfc4ipkle34tgqv3gh7gccwhmr22qdg7p6k6oxon255mnwb6csi/collection.json";
    }

    // Only the owner can start and end the round
    function newRound(bytes32 _correctAnswer) external onlyOwner {
        // check if we need to initialize the first round
        if (s_roundStartTime == 0) {
            // this initializes the first round!
            s_roundStartTime = block.timestamp;
            s_answer = _correctAnswer;
        } else {
            // check the min duration has passed
            if (block.timestamp < s_roundStartTime + MIN_DURATION) {
                revert Panagram__MinTimeNotPassed(MIN_DURATION, block.timestamp - s_roundStartTime);
            }
            // there has to have been a winner to start a new round.
            if (s_currentRoundWinner == address(0)) {
                revert Panagram__NoRoundWinner();
            }
            s_answer = _correctAnswer;
            s_currentRoundWinner = address(0);
        }
        s_currentRound++;
        emit Panagram__RoundStarted();
    }

    // Verify the guess and mint NFT if first or subsequent correct guesses
    function makeGuess(bytes calldata proof) external returns (bool) {
        if (s_currentRound == 0) {
            revert Panagram__FirstPanagramNotSet();
        }
        bytes32[] memory inputs = new bytes32[](2);
        inputs[0] = bytes32(uint256(uint160(msg.sender)));
        inputs[1] = s_answer; // hard code to prevent front-running!
        if (s_lastCorrectGuessRound[msg.sender] == s_currentRound) {
            revert Panagram__AlreadyAnsweredCorrectly();
        }
        bool proofResult = s_verifier.verify(proof, inputs);
        emit Panagram__ProofSucceeded(proofResult);
        if (!proofResult) {
            revert Panagram__IncorrectGuess();
        }
        s_lastCorrectGuessRound[msg.sender] = s_currentRound;
        // If this is the first correct guess, s_currentRoundWinner will still be address(0) so mint NFT with id 1
        if (s_currentRoundWinner == address(0)) {
            s_currentRoundWinner = msg.sender;
            s_winnerWins[msg.sender]++; // Increment wins for the first winner
            _mint(msg.sender, 0, 1, ""); // Mint NFT with ID 0
            emit Panagram__NFTMinted(msg.sender, 0);
        } else {
            // If someone is the second or further correct guesser, mint NFT with id 2
            _mint(msg.sender, 1, 1, ""); // Mint NFT with ID 1
            emit Panagram__NFTMinted(msg.sender, 1);
        }
        return proofResult;
    }

    // Allow updating the verifier (only the owner)
    function setVerifier(IVerifier _verifier) external onlyOwner {
        s_verifier = _verifier;
        emit Panagram__VerifierUpdated(_verifier);
    }

    // Getter for current round status
    function getCurrentRoundStatus() external view returns (address) {
        return (s_currentRoundWinner);
    }

    function getCurrentPanagram() external view returns (bytes32) {
        return s_answer;
    }
}
