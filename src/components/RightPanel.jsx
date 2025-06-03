import MoveHistory from './MoveHistory';
import GameControls from './GameControls';

export default function RightPanel({
  history,
  currentMoveIndex,
  game,
  setGame,
  setFen,
  setHistory,
  setOrientation,
  setIsGameOver,
  setKingSquare,
  setFenList,
  setCurrentMoveIndex,
  mode,
  autoOrientation,
  setAutoOrientation,
  onButtonClick,
  backgroundColor,
  navigate,
}) {
  return (
    <div className="right-panel">
      <MoveHistory history={history} currentMoveIndex={currentMoveIndex} />
      <GameControls
        navigate={navigate}
        game={game}
        setGame={setGame}
        setFen={setFen}
        setHistory={setHistory}
        setOrientation={setOrientation}
        setIsGameOver={setIsGameOver}
        setKingSquare={setKingSquare}
        setFenList={setFenList}
        setCurrentMoveIndex={setCurrentMoveIndex}
        mode={mode}
        autoOrientation={autoOrientation}
        setAutoOrientation={setAutoOrientation}
        onButtonClick={onButtonClick}
        backgroundColor={backgroundColor}
      />
    </div>
  );
}

/* <div className="controls">
        <button className="controlBtn" onClick={() => navigate('/')}>
          Powrót do menu
        </button>
        <button
          className="controlBtn"
          onClick={() => {
            setGame(new Chess());
            setFen('start');
            setHistory([]);
            setOrientation('white');
            setIsGameOver(false);
            setKingSquare(null);
            setFenList(['start']);
            setCurrentMoveIndex(0);
          }}
        >
          Reset
        </button>
        <button
          className="controlBtn"
          style={{
            backgroundColor: mode !== 'local' ? 'gray' : backgroundColor,
          }}
          onClick={() => {
            setAutoOrientation(!autoOrientation);
            onButtonClick(!autoOrientation ? '#007bff' : '#0056b3');
          }}
          disabled={mode !== 'local'}
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
      </div> */
