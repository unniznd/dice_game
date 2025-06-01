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
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">Roll the Dice</h1>
      {ready && !isLoggingOut ? (
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg"
          onClick={authenticated ? handleLogout : login}
        >
          {authenticated ? 'Logout' : 'Login'}
        </button>
      ) : (
        <Image
          src="/dice_loading.gif"
          alt="Logging out"
          width={100}
          height={100}
          className="object-contain mx-auto"
        />
      )}
    </div>
  );
};

export default MainScreen;