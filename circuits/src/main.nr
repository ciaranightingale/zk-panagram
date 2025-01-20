fn main(guess: Field, answer: Field) {
    let guess_commitment = std::hash::pedersen_hash([guess]);
    assert(answer == guess_commitment);
}
