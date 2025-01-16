//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../circuits/target/contract.sol";

contract Starter {
    UltraVerifier public verifier;

    event VerifierUpdated(UltraVerifier verifier);

    error IncorrectGuess();

    constructor(UltraVerifier _verifier) {
        verifier = _verifier;
    }

    function verifyEqual(bytes calldata proof) public view returns (bool) {
        bool proofResult = verifier.verify(proof, new bytes32[](0));
        if (!proofResult) {
            revert IncorrectGuess();
        }
        // TODO: mint an NFT if no one has got one yet!
        return proofResult;
    }

    function setVerifier(UltraVerifier _verifier) public {
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }
}
