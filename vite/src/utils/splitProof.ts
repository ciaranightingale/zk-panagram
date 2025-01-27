import { splitHonkProof } from '@aztec/bb.js';

export function uint8ArrayToHex(buffer: Uint8Array): string {
    let hex = '';
    for (let i = 0; i < buffer.length; i++) {
      const hexByte = buffer[i].toString(16).padStart(2, '0');
      hex += hexByte;
    }
    return hex;
  }
  
  
  // Function to process the proof and remove public inputs
  export function splitProof(proofWithPublicInputs: Uint8Array): string {
    const { proof, publicInputs } = splitHonkProof(proofWithPublicInputs); // Split proof from public inputs
    
    // Convert the proof part to hex string
    const hexProof = uint8ArrayToHex(proof);
  
    // Remove the first 8 bytes (16 hex chars) from the string
    const resultHex = hexProof.slice(16);  // Removes first 16 hex chars (8 bytes)
    
    return hexProof;  // Return the final proof part as hex
  }
  