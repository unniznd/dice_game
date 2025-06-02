import HistoryBoard from "./HistoryBoard";

interface HistoryItem {
  id: number;
  address: string;
  won: boolean;
}

interface HistoryPopupProps {
  history: HistoryItem[];
  onRefresh: () => void;
  onClose: () => void;
  isLoading: boolean;
}

const HistoryPopup: React.FC<HistoryPopupProps> = ({ history, onClose, onRefresh, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md fade-in relative">
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-gray-400 hover:text-gray-700 transition text-xl"
            onClick={onClose}
            aria-label="Close History"
          >
            ✕
          </button>
        </div>
        <HistoryBoard history={history} onRefresh={onRefresh} isLoading={isLoading} />
      </div>
    </div>

  );
};

export default HistoryPopup;