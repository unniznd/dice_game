import HistoryBoard from "./HistoryBoard";

interface HistoryItem {
  id: number;
  address: string;
  won: boolean;
}

interface HistoryPopupProps {
  history: HistoryItem[];
  onClose: () => void;
}

const HistoryPopup: React.FC<HistoryPopupProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">History</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <HistoryBoard history={history} />
      </div>
    </div>
  );
};

export default HistoryPopup;