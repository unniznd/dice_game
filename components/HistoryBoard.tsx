interface HistoryItem {
  id: number;
  address: string;
  won: boolean;
}

interface HistoryBoardProps {
  history: HistoryItem[];
  onRefresh: () => void;
  isLoading: boolean;
}

const HistoryBoard: React.FC<HistoryBoardProps> = ({ history, onRefresh, isLoading }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Game History</h2>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onRefresh}
          aria-label="Refresh History"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="text-sm text-gray-500 text-center">Loading history...</div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2"
            >
              <span className="text-sm font-mono text-gray-700 truncate">{item.address}</span>
              <span className={`text-sm font-semibold ${item.won ? 'text-green-500' : 'text-red-500'}`}>
                {item.won ? '\u2705 Won' : '\u274c Lost'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No history yet</div>
        )}
      </div>
    </div>
  );
};

export default HistoryBoard;