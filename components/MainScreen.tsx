import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

const MainScreen: React.FC = () => {
  const { login, logout, ready, authenticated } = usePrivy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      {/* Fullscreen loader when logging out */}
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

      {/* Logout Button */}
      {ready && authenticated && !isLoggingOut && (
        <button
          className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-8">Roll the Dice</h1>

      {ready && !authenticated && !isLoggingOut && (
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg"
          onClick={login}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default MainScreen;
