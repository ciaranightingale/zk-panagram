import { ANAGRAM } from "../constant";

function PanagramImage() {
  const word = ANAGRAM;

  // Scramble the word (excluding the middle letter)
  const middleIndex = Math.floor(word.length / 2); // Middle letter
  const letters = word.split("");
  const middleLetter = letters[middleIndex]; // Store the middle letter
  letters.splice(middleIndex, 1); // Remove the middle letter
  const scrambledLetters = letters.sort(() => Math.random() - 0.5); // Shuffle the remaining letters
  scrambledLetters.splice(middleIndex, 0, middleLetter); // Insert the middle letter back

  return (
    <div className="flex items-center justify-center my-8">
      <div className="relative w-64 h-64">
        {/* Render the middle letter in the center */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
            bg-gray-800 text-white rounded-full w-12 h-12 text-xl font-bold"
          style={{ left: "50%", top: "50%" }}
        >
          {scrambledLetters[middleIndex]} {/* Middle letter */}
        </div>

        {/* Render the surrounding scrambled letters in a circular layout */}
        {scrambledLetters.map((letter, index) => {
          if (index === middleIndex) return null; // Skip the middle letter as it is already rendered
          const angle =
            (360 / (scrambledLetters.length - 1)) *
            (index < middleIndex ? index : index - 1);
          const x = 50 + 35 * Math.cos((angle * Math.PI) / 180); // X position for circle
          const y = 50 + 35 * Math.sin((angle * Math.PI) / 180); // Y position for circle

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
                bg-gray-300 text-gray-700 rounded-full w-12 h-12 text-xl font-bold"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {letter}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PanagramImage;
