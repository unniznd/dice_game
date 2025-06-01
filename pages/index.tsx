import { useState } from 'react';
import MainScreen from '../components/MainScreen';
import GameScreen from '../components/GameScreen';
import HistoryBoard from '../components/HistoryBoard';
import HistoryPopup from '../components/HistoryPopup';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

const Home: React.FC = () => {
  const { ready, authenticated } = usePrivy();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sample history data (replace with real data in production)
  const history = [
    { id: 1, address: '0x123...456', won: true },
    { id: 2, address: '0x789...012', won: false },
    { id: 3, address: '0x345...678', won: true },
  ];

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Image
          src="/dice_loading.gif"
          alt="Loading"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Main/Game Screen (75% on desktop) */}
      <div className="lg:w-3/4 w-full p-4 flex items-center justify-center relative">
        {authenticated ? <GameScreen /> : <MainScreen />}
      </div>
      {/* History Board (25% on desktop, hidden on mobile) */}
      <div className="lg:w-1/4 w-full p-4 hidden lg:block">
        <HistoryBoard history={history} />
      </div>
      {/* Floating Action Button for Mobile */}
      <button
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsHistoryOpen(true)}
        aria-label="Open History"
      >
        {String.fromCodePoint(0x1f4dc)}
      </button>
      {/* History Popup for Mobile */}
      {isHistoryOpen && (
        <HistoryPopup history={history} onClose={() => setIsHistoryOpen(false)} />
      )}
    </div>
  );
};

export default Home;