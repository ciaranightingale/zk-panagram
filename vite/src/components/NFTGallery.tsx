import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { abi } from "../abi/abi";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant";

const GATEWAY = import.meta.env.VITE_PINATA_GATEWAY!;

// Helper function to ensure we're using a reliable IPFS gateway
const convertToReliableGateway = (url: string) => {
  // If it's already HTTPS but using ipfs.io, switch to a different gateway
  if (url.includes("https://ipfs.io/ipfs/")) {
    const ipfsHash = url.split("https://ipfs.io/ipfs/")[1];
    return `${GATEWAY}${ipfsHash}`;
  }
  // If it's an IPFS protocol URL, convert it
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", `${GATEWAY}`);
  }
  return url;
};

export default function NFTGallery({
  owner,
  token_id,
}: {
  owner: string;
  token_id: number;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  // Call the hook for balance
  const balanceResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: [owner, token_id],
  });

  // Call the hook for URI
  const uriResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS,
    abi,
    functionName: "uri",
    args: [token_id],
  });

  // Convert BigInt balance to number safely
  const balance = balanceResult.data ? Number(balanceResult.data) : 0;
  console.log("Raw balance data:", balanceResult.data);
  console.log("Converted balance:", balance);

  // useEffect to handle metadata fetching once we have the URI
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!uriResult.data) {
        console.log("No URI data available");
        return;
      }

      try {
        const tokenURI = uriResult.data as string;

        // Replace the {id} placeholder with the actual token_id
        const resolvedURI = tokenURI.replace(/{id}/g, token_id.toString());
        console.log("Raw URI:", tokenURI);
        console.log("Resolved URI:", resolvedURI);

        // Convert to reliable gateway
        const reliableUrl = convertToReliableGateway(resolvedURI);
        console.log("Attempting to fetch from:", reliableUrl);

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const metadataResponse = await fetch(reliableUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!metadataResponse.ok) {
          throw new Error(`HTTP error! status: ${metadataResponse.status}`);
        }

        const metadata = await metadataResponse.json();
        console.log("Successfully fetched metadata:", metadata);

        // Convert image URL to reliable gateway if it's IPFS
        if (metadata.image) {
          const reliableImageUrl = convertToReliableGateway(metadata.image);
          console.log("Setting image URL to:", reliableImageUrl);
          setImageUrl(reliableImageUrl);
        } else {
          console.log("No image URL in metadata");
        }

        setMetadata(metadata);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error("Request timed out");
        } else {
          console.error("Error fetching metadata:", error);
        }
        console.error("Full error details:", {
          tokenId: token_id,
          uri: uriResult.data,
          error: error.toString(),
          stack: error.stack,
        });
      }
    };

    fetchMetadata();
  }, [uriResult.data, token_id]);

  // Debug display
  useEffect(() => {
    console.log("Component state:", {
      balance,
      imageUrl,
      metadata,
      isLoading: balanceResult.isLoading || uriResult.isLoading,
      hasError: balanceResult.isError || uriResult.isError,
    });
  }, [
    balance,
    imageUrl,
    metadata,
    balanceResult.isLoading,
    uriResult.isLoading,
    balanceResult.isError,
    uriResult.isError,
  ]);

  // Handling loading state for either request
  if (balanceResult.isLoading || uriResult.isLoading) {
    return <p>Loading...</p>;
  }

  // Handling error state for either request
  if (balanceResult.isError || uriResult.isError) {
    return <p>Error fetching NFT data</p>;
  }

  return (
    <div className="nft-gallery my-8">
      <h2 className="text-xl font-semibold mb-4">
        {token_id === 0 ? "Won the Game" : "Got the Anagram Correct"}
      </h2>

      {balance > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-4">Token Balance: {balance}</p>
          <NFTCard tokenId={token_id} balance={balance} imageUrl={imageUrl} />
        </>
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
    <div className="nft-card border border-gray-300 rounded-lg bg-gray-50 p-4 text-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800">
        Token ID: {tokenId}
      </h3>
      <p className="text-gray-600">Balance: {balance}</p>
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`NFT ${tokenId}`}
            className="mt-4 max-w-full h-auto rounded-md"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </>
      ) : (
        <p className="text-gray-600 mt-4">No image available.</p>
      )}
    </div>
  );
}
