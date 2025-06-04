import { useNavigate, useLocation } from 'react-router-dom';

export default function ResultDialog({ open, result, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  const handleAnalyze = () => {
    navigate(`${location.pathname}/analyze`);
  };

  return (
    <div className="dialog-backdrop">
      <div
        className="dialog"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>{result}</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="controlBtn" onClick={handleAnalyze}>
            Analiza gry
          </button>
          <button className="controlBtn" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
