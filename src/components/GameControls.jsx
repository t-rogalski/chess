import VsLocalButtons from './VsLocalButtons';
import VsComputerButtons from './VsComputerButtons';

export default function GameControls({
  navigate,
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
}) {
  return mode === 'local' ? (
    <VsLocalButtons
      navigate={navigate}
      setGame={setGame}
      setFen={setFen}
      setHistory={setHistory}
      setOrientation={setOrientation}
      setIsGameOver={setIsGameOver}
      setKingSquare={setKingSquare}
      setFenList={setFenList}
      setCurrentMoveIndex={setCurrentMoveIndex}
      autoOrientation={autoOrientation}
      setAutoOrientation={setAutoOrientation}
      onButtonClick={onButtonClick}
      backgroundColor={backgroundColor}
    />
  ) : (
    <VsComputerButtons
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
    />
  );
}
