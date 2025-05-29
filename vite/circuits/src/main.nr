fn main(guess: Field, address: pub Field, expected_hash: pub Field) {
    let addr_sqrt: Field = address * address;
    assert_eq(addr_sqrt, address * address);
    assert_eq(guess, expected_hash);
}