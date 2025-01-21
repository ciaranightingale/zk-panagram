import React from 'react';

interface SubmitButtonProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ handleSubmit }) => {
  return (
    <button
      type="submit"
      id="submit"
      className="w-full px-6 py-4 text-lg font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Submit Guess
    </button>
  );
}

export default SubmitButton;
