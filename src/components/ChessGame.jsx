import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { KING, WHITE, BLACK, Chess } from 'chess.js';
import RightPanel from './RightPanel';
import BoardContainer from './BoardContainer';
import Engine from './Engine';
import LevelDialog from './LevelDialog';
import ResultDialog from './ResultDialog';

export default function ChessGame() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const game = useMemo(() => new Chess(), []);
  const engine = useMemo(() => new Engine(), []);
  const [fen, setFen] = useState('start');
  const [history, setHistory] = useState([]);
  const [orientation, setOrientation] = useState('white');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fenList, setFenList] = useState(['start']);
  const [isGameOver, setIsGameOver] = useState(false);
  const [kingSquare, setKingSquare] = useState(null);
  const [showLevelDialog, setShowLevelDialog] = useState(mode === 'vsComputer');
  const [stockfishLevel, setStockfishLevel] = useState(1);
  const [autoOrientation, setAutoOrientation] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#0056b3');
  const [resultMessage, setResultMessage] = useState('');
  const [analyze, setAnalyze] = useState(false);

  const onButtonClick = (color) => {
    setBackgroundColor(color);
  };

  const handleLevelSelect = (depth) => {
    setStockfishLevel(depth);
    setShowLevelDialog(false);
  };

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setFen(game.fen());
        setHistory(game.history({ verbose: true }));
        setCurrentMoveIndex(game.history().length);
        result();
      }
    });
  }

  // Update the game state after a move, its needed to moving in history
  const updateAfterMove = () => {
    const tempGame = new Chess();
    const verboseHistory = game.history({ verbose: true });

    const newFens = ['start'];
    verboseHistory.forEach((move) => {
      tempGame.move(move);
      newFens.push(tempGame.fen());
    });

    setHistory(verboseHistory);
    setFenList(newFens);
    setCurrentMoveIndex(newFens.length - 1);
    setFen(tempGame.fen());
  };

  useEffect(() => {
    const goToMove = (moveIndex) => {
      const clampedIndex = Math.max(0, Math.min(fenList.length - 1, moveIndex));
      setCurrentMoveIndex(clampedIndex);
      setFen(fenList[clampedIndex]);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToMove(currentMoveIndex - 1);
      } else if (event.key === 'ArrowRight') {
        goToMove(currentMoveIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMoveIndex, fenList]);

  const onPromotionCheck = (sourceSquare, targetSquare, piece) => {
    if (!(piece === 'wP' || piece === 'bP')) return false;

    const isPromotionSquare =
      (piece === 'wP' && targetSquare[1] === '8') ||
      (piece === 'bP' && targetSquare[1] === '1');

    if (!isPromotionSquare) return false;

    const moves = game.moves({ verbose: true });
    return moves.some(
      (move) =>
        move.from === sourceSquare &&
        move.to === targetSquare &&
        move.promotion,
    );
  };

  const onDrop = ({ sourceSquare, targetSquare, piece }) => {
    if (isGameOver) return;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? 'q',
    });

    updateGameState(move);
    kingInCheck();
  };

  const kingInCheck = () => {
    if (game.inCheck()) {
      const who = game.turn() === 'w' ? 'b' : 'w';
      const king = game.findPiece(
        who === 'w'
          ? { type: KING, color: BLACK }
          : { type: KING, color: WHITE },
      );
      setKingSquare(king[0]);
    } else {
      setKingSquare(null);
    }
  };

  const updateGameState = (move) => {
    if (move === null) return;
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setCurrentMoveIndex(game.history().length);

    if (mode === 'vsComputer') {
      setTimeout(findBestMove, 500);
    }

    if (mode === 'local') {
      if (autoOrientation) {
        setOrientation(game.turn() === 'w' ? 'white' : 'black');
      }
    }

    result();
  };

  const result = () => {
    const drawConditions = [
      [game.isStalemate(), 'Pat! Gra zakończona remisem.'],
      [
        game.isInsufficientMaterial(),
        'Remis z powodu braku wystarczającej ilości materiału do gry.',
      ],
      [
        game.isDrawByFiftyMoves?.(),
        'Remis z powodu pięćdziesięciu ruchów bez bicia lub ruchu pionka.',
      ],
      [
        game.isThreefoldRepetition(),
        'Remis z powodu trzykrotnego powtórzenia pozycji.',
      ],
      [
        game.isCheckmate(),
        `MAT! ${game.turn() === 'w' ? 'Czarne' : 'Białe'} wygrały!`,
      ],
    ];

    for (const [condition, message] of drawConditions) {
      if (condition) {
        setResultMessage(message);
        setIsGameOver(true);
      }
      setTimeout(() => {
        updateAfterMove();
      }, 100);
    }
  };

  return (
    <div className="wrapper">
      <LevelDialog open={showLevelDialog} onSelect={handleLevelSelect} />
      <ResultDialog
        open={isGameOver}
        result={resultMessage}
        onClose={() => setIsGameOver(false)}
        setAnalyze={setAnalyze}
      />
      <Analyze analyze={analyze} game={game} />
      <div className="container">
        <BoardContainer
          fen={fen}
          onDrop={onDrop}
          orientation={orientation}
          onPromotionCheck={onPromotionCheck}
          kingSquare={kingSquare}
        />
        <RightPanel
          history={history}
          currentMoveIndex={currentMoveIndex}
          game={game}
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
          navigate={navigate}
        />
      </div>
    </div>
  );
}
