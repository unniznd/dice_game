import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

const GameScreen: React.FC = () => {
  const { logout, ready } = usePrivy();
  const [isRolling, setIsRolling] = useState(false);
  const [diceFace, setDiceFace] = useState('\u2680');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const diceFaces = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    let counter = 0;
    const rollInterval = setInterval(() => {
      setDiceFace(diceFaces[Math.floor(Math.random() * 6)]);
      if (++counter >= 10) {
        clearInterval(rollInterval);
        setDiceFace(diceFaces[Math.floor(Math.random() * 6)]);
        setIsRolling(false);
      }
    }, 100);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="text-center relative w-full">
      {/* Fullscreen loading spinner */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <Image
            src="/dice_loading.gif"
            alt="Logging out"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      )}

      {ready && !isLoggingOut && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-8">Roll the Dice</h1>

      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 cursor-pointer"
          onClick={handleRoll}
        >
          <span className="text-4xl">{diceFace}</span>
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg"
          onClick={() => alert('Place Bet functionality to be implemented')}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
