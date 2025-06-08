use dep::keccak256;

fn main(guess: Field, address: pub Field, expected_hash: pub Field) {
    let addr_sqrt: Field = address * address;
    let guess_bytes: [u8; 32] = guess.to_be_bytes();
    let guess_hash: [u8; 32] = keccak256::keccak256(guess_bytes, 32);
    assert_eq(addr_sqrt, address * address);
    assert_eq(Field::from_be_bytes(guess_hash), expected_hash);
}