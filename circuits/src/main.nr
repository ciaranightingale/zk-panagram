fn main(guess: Field, blinding_factor: Field, expected_hash: Field) {
    let hash = std::hash::pedersen_hash([guess, blinding_factor]);
    assert_eq(hash, expected_hash);
}