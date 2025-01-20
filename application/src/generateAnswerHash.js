// hash-generator.js
const {buildPedersenHash} = require('circomlibjs')

async function generatePedersenHash(inputString) {
    try {
        // Initialize the Pedersen hasher
        const pedersen = await buildPedersenHash();
        
        // Convert string to bytes
        const textEncoder = new TextEncoder();
        const messageBytes = textEncoder.encode(inputString);
        
        // Generate the hash
        const hash = pedersen.hash(messageBytes);
        
        // Convert hash to hex string for readability
        const hashHex = Buffer.from(hash).toString('hex');
        
        return {
            originalString: inputString,
            messageBytes: Array.from(messageBytes),
            hashHex: hashHex
        };
    } catch (error) {
        console.error("Error generating hash:", error);
        throw error;
    }
}

// Example usage
const main = async () => {
    const result = await generatePedersenHash("outnumber");
    console.log("Original string:", result.originalString);
    console.log("Message bytes:", result.messageBytes);
    console.log("Hash (hex):", result.hashHex);
    return result;
};

main().catch(console.error);