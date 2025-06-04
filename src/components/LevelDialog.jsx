const levels = {
  Łatwy: 1,
  Średni: 6,
  Trudny: 18,
};

export default function LevelDialog({ open, onSelect }) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Wybierz poziom gry</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {Object.entries(levels).map(([level, depth]) => (
            <button
              key={level}
              className="levelBtn"
              onClick={() => onSelect(depth)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .dialog {
          background: #0f0f24;
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 32px rgba(0,0,0,0.2);
          min-width: 300px;
        }
      `}</style>
    </div>
  );
}
