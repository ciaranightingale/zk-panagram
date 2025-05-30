import NFTGallery from "./NFTGallery";

export default function NFTGalleryContainer({
  userAddress,
}: {
  userAddress: string;
}) {
  return (
    <div className="my-6 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        Your NFT Collection
      </h2>
      <div className="grid grid-cols-1 gap-6 justify-center items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex justify-center text-center">
          <NFTGallery owner={userAddress} token_id={0} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex justify-center text-center">
          <NFTGallery owner={userAddress} token_id={1} />
        </div>
      </div>
    </div>
  );
}
