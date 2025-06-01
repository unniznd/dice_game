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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span className="text-sm truncate">{item.address}</span>
            <span
              className={`text-sm font-medium ${
                item.won ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.won ? 'Won' : 'Lost'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryBoard;