import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { KING, WHITE, BLACK, Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import MoveHistory from './MoveHistory';

export default function ChessGame() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('start');
  const [history, setHistory] = useState([]);
  const [orientation, setOrientation] = useState('white');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [fenList, setFenList] = useState(['start']);
  const [isGameOver, setIsGameOver] = useState(false);
  const [kingSquare, setKingSquare] = useState(null);

  const [autoOrientation, setAutoOrientation] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#0056b3');

  const onButtonClick = (color) => {
    setBackgroundColor(color);
  };

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

  const makeRandomMove = () => {
    if (isGameOver) return;

    const possibleMoves = game.moves();
    if (game.isGameOver() || possibleMoves.length === 0) return;

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setCurrentMoveIndex(game.history().length);
    result();
  };

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
      setTimeout(makeRandomMove, 500);
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
    ];

    for (const [condition, message] of drawConditions) {
      if (condition) {
        alert(message);
        setIsGameOver(true);
        return;
      }
    }

    if (game.isCheckmate()) {
      alert(`MAT! ${game.turn() === 'w' ? 'Czarne' : 'Białe'} wygrały!`);
      setIsGameOver(true);
      return;
    }
    setTimeout(() => {
      updateAfterMove();
    }, 100);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="board-container">
          <Chessboard
            position={fen}
            onPieceDrop={(sourceSquare, targetSquare, piece) => {
              onDrop({ sourceSquare, targetSquare, piece });
              return true;
            }}
            boardOrientation={orientation}
            onPromotionCheck={onPromotionCheck}
            customSquareStyles={
              kingSquare
                ? {
                    [kingSquare]: {
                      backgroundImage:
                        'radial-gradient(circle, rgba(255, 0, 0, 0.5) 30%, transparent 70%)',
                    },
                  }
                : {}
            }
            customDarkSquareStyle={{
              backgroundColor: '#0056b3',
            }}
            customLightSquareStyle={{
              backgroundColor: '#edeed1',
            }}
          />
        </div>
        <div className="right-panel">
          <MoveHistory history={history} currentMoveIndex={currentMoveIndex} />
          <div className="controls">
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
              <span className="material-symbols-outlined">
                screen_rotation_up
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
