interface HistoryItem {
  id: number;
  address: string;
  won: boolean;
}

interface HistoryBoardProps {
  history: HistoryItem[];
}

const HistoryBoard: React.FC<HistoryBoardProps> = ({ history }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Game History</h2>
      <div className="divide-y divide-gray-200">
        {history.length > 0 ? history.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-2"
          >
            <span className="text-sm font-mono text-gray-700 truncate">{item.address}</span>
            <span className={`text-sm font-semibold ${item.won ? 'text-green-500' : 'text-red-500'}`}>
              {item.won ? '\u2705 Won' : '\u274c Lost'}
            </span>
          </div>
        )) : (
          <div className="text-sm text-gray-500">No history yet</div>
        )}
      </div>
    </div>

  );
};

export default HistoryBoard;