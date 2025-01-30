import { useReadContract } from "wagmi";
import { abi } from "../abi/abi"; // Import your NFT contract ABI
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant";

export default function NFTGallery({ owner, token_id }: { owner: string; token_id: number }) {
  const { data, isLoading } = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: [owner, token_id],
  });

  const balance = (data as number) || 0;

  return (
    <div className="nft-gallery my-8">
      <h2 className="text-xl font-semibold mb-4">
        {token_id === 0 ? "Won the Game" : "Got the Anagram Correct"}
      </h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : balance > 0 ? (
        <NFTCard tokenId={token_id} balance={balance} />
      ) : (
        <p>No tokens owned.</p>
      )}
    </div>
  );
}

function NFTCard({ tokenId, balance }: { tokenId: number; balance: number }) {
    return (
        <div className="nft-card border border-gray-300 rounded-lg bg-gray-50 p-4 text-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Token ID: {tokenId}</h3>
          <p className="text-gray-600">Balance: {balance}</p>
        </div>
      );
}
