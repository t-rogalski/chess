export default function ResultDialog({ open, result, onClose, setAnalyze }) {
  if (!open) return null;

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
          <button
            className="controlBtn"
            onClick={() => {
              setAnalyze(true);
              onClose();
            }}
          >
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
