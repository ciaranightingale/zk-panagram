import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { abi } from "../abi/abi";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant";

const GATEWAY = import.meta.env.VITE_PINATA_GATEWAY!;

const convertToReliableGateway = (url: string) => {
  if (url.startsWith("https://ipfs.io/ipfs/")) {
    return `${GATEWAY}${url.split("https://ipfs.io/ipfs/")[1]}`;
  }
  return url.startsWith("ipfs://") ? url.replace("ipfs://", GATEWAY) : url;
};

const fetchMetadata = async (uri: string, token_id: number) => {
  const resolvedURI = uri.replace(/{id}/g, token_id.toString());
  const reliableUrl = convertToReliableGateway(resolvedURI);

  try {
    const response = await fetch(reliableUrl, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const metadata = await response.json();
    return {
      metadata,
      imageUrl: metadata.image
        ? convertToReliableGateway(metadata.image)
        : null,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { metadata: null, imageUrl: null };
  }
};

export default function NFTGallery({
  owner,
  token_id,
}: {
  owner: string;
  token_id: number;
}) {
  const [nftData, setNftData] = useState<{
    metadata: any;
    imageUrl: string | null;
  }>({
    metadata: null,
    imageUrl: null,
  });

  const balanceResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: [owner as `0x${string}`, BigInt(token_id)],
  });

  const uriResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS,
    abi,
    functionName: "uri",
    args: [BigInt(token_id)],
  });

  useEffect(() => {
    if (!uriResult.data) return;
    fetchMetadata(uriResult.data as string, token_id).then(setNftData);
  }, [uriResult.data, token_id]);

  if (balanceResult.isLoading || uriResult.isLoading) return <p>Loading...</p>;
  if (balanceResult.isError || uriResult.isError)
    return <p>Error fetching NFT data</p>;

  const balance = balanceResult.data ? Number(balanceResult.data) : 0;

  return (
    <div className="nft-gallery my-8">
      <h2 className="text-xl font-semibold mb-4">
        {token_id === 0 ? "Times Won" : "Times got Correct (but not won)"}
      </h2>
      {balance > 0 ? (
        <NFTCard
          tokenId={token_id}
          balance={balance}
          imageUrl={nftData.imageUrl}
        />
      ) : (
        <p>No tokens owned.</p>
      )}
    </div>
  );
}

function NFTCard({
  tokenId,
  balance,
  imageUrl,
}: {
  tokenId: number;
  balance: number;
  imageUrl: string | null;
}) {
  return (
    <div className="nft-card border border-gray-300 rounded-lg bg-gray-50 p-4 text-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 justify-center">
      <h3 className="text-lg font-semibold text-gray-800">
        Token ID: {tokenId}
      </h3>
      <p className="text-gray-600">Balance: {balance}</p>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`NFT ${tokenId}`}
          className="mt-4 max-w-full h-auto rounded-md"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        <p className="text-gray-600 mt-4">No image available.</p>
      )}
    </div>
  );
}
