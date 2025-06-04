export default function VsComputerButtons({
  navigate,
  game,
  setFen,
  setHistory,
  setOrientation,
  setIsGameOver,
  setKingSquare,
  setFenList,
  setCurrentMoveIndex,
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
        onClick={() => {
          game.undo();
          game.undo();
          setHistory(game.history({ verbose: true }));
          setCurrentMoveIndex(game.history().length);
          setFenList((prev) => {
            const newFenList = [...prev];
            newFenList.pop();
            newFenList.pop();
            return newFenList;
          });
          setFen(game.fen());
        }}
      >
        Cofnij
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
