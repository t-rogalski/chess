export default function VsLocalButtons({
  navigate,
  game,
  setFen,
  setHistory,
  setOrientation,
  setIsGameOver,
  setKingSquare,
  setFenList,
  setCurrentMoveIndex,
  autoOrientation,
  setAutoOrientation,
  onButtonClick,
  backgroundColor,
  setAnalyze,
}) {
  return (
    <div className="controls">
      <button
        className="controlBtn backToMenuBtn"
        onClick={() => navigate('/')}
      >
        Powrót do menu
      </button>
      <button
        className="controlBtn"
        onClick={() => {
          game.reset();
          setFen('start');
          setHistory([]);
          setOrientation('white');
          setIsGameOver(false);
          setKingSquare(null);
          setFenList(['start']);
          setCurrentMoveIndex(0);
          setAnalyze(false);
        }}
      >
        Reset
      </button>
      <button
        className="controlBtn"
        style={{
          backgroundColor: backgroundColor,
        }}
        onClick={() => {
          setAutoOrientation(!autoOrientation);
          onButtonClick(!autoOrientation ? '#007bff' : '#0056b3');
        }}
      >
        Auto Orientacja
      </button>
      <button
        className="rotateBtn"
        onClick={() =>
          setOrientation((prev) => (prev === 'white' ? 'black' : 'white'))
        }
      >
        <span className="material-symbols-outlined">screen_rotation_up</span>
      </button>
    </div>
  );
}
