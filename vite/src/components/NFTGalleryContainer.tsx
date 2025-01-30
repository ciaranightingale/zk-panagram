import NFTGallery from './NFTGallery';

export default function NFTGalleryContainer({ userAddress }: { userAddress: string }) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Your NFT Collection</h2>
  
        {/* Flex container for the NFT Galleries */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Gallery 1: Token ID 0 (Won the Game) */}
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <NFTGallery owner={userAddress} token_id={0} />
          </div>
  
          {/* Gallery 2: Token ID 1 (Anagram Correct) */}
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <NFTGallery owner={userAddress} token_id={1} />
          </div>
        </div>
      </div>
    );
  }
  