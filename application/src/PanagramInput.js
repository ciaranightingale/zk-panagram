import PanagramImage from "./PanagramImage";

function PanagramInput() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Panagram
          </h1>
          <PanagramImage />
          <p className="text-center text-gray-600 mb-6">
            Can you guess the secret word?
          </p>
          <form className="space-y-6">
            <input
              type="text"
              id="guess"
              maxLength="6"
              placeholder="Type your guess"
              className="w-full px-6 py-4 text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center"
            />
            <button
              type="submit"
              className="w-full px-6 py-4 text-lg font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit Guess
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  export default PanagramInput;
  