import { useEffect, useState } from 'react';
import MainScreen from '../components/MainScreen';
import GameScreen from '../components/GameScreen';
import HistoryBoard from '../components/HistoryBoard';
import HistoryPopup from '../components/HistoryPopup';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

const Home: React.FC = () => {
  const { ready, authenticated } = usePrivy();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const query = gql`
    {
      diceLandeds(first: 5) {
        id
        roller
        rollNumber
        result
      }
    }
  `;
  const url = 'https://api.studio.thegraph.com/query/112932/dice-game-subgraph/version/latest';
  const GRAPH_API_KEY = process.env.GRAPH_API_KEY!;
  const headers = { Authorization: `Bearer ${GRAPH_API_KEY}` };

  // Function to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['diceHistory'],
    queryFn: async () => {
      const response = await request(url, query, {}, headers) as any;
      return response.diceLandeds.map((item: any) => ({
        id: item.id,
        address: truncateAddress(item.roller),
        won: item.rollNumber === item.result
      }));
    }
  });

  useEffect(() => {
    if (data) {
      setHistory(data);
    }
  }, [data]);

  if (!ready || isLoading) {
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

  if (error) {
    console.error('Error fetching history:', error);
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Main/Game Screen (75% on desktop) */}
      <div className="lg:w-3/4 w-full p-4 flex items-center justify-center relative">
        {authenticated ? <GameScreen /> : <MainScreen />}
      </div>
      {/* History Board (25% on desktop, hidden on mobile) */}
      <div className="lg:w-1/4 w-full p-4 hidden lg:block">
        <HistoryBoard history={history} onRefresh={refetch} isLoading={isFetching} />
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
        <HistoryPopup 
          history={history} 
          onClose={() => setIsHistoryOpen(false)} 
          onRefresh={refetch} 
          isLoading={isFetching} 
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;