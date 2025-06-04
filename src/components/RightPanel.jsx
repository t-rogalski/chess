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
  setAnalyze,
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
        setAnalyze={setAnalyze}
      />
    </div>
  );
}
