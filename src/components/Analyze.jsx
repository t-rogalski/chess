import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import Engine from './Engine.jsx';
import { Chessboard } from 'react-chessboard';

const inputStyle = {
  padding: '8px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
};

export default function Analyze() {
  const navigate = useNavigate();
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const inputRef = useRef(null);
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestline] = useState('');
  const [possibleMate, setPossibleMate] = useState('');

  // Rejestruj handler tylko raz
  useEffect(() => {
    const handleMessage = (msg) => {
      // console.log('Odpowiedź silnika:', msg);
      if (msg.positionEvaluation !== undefined) {
        setPositionEvaluation(
          ((game.turn() === 'w' ? 1 : -1) * Number(msg.positionEvaluation)) /
            100,
        );
      }
      if (msg.possibleMate !== undefined) setPossibleMate(msg.possibleMate);
      if (msg.depth !== undefined) setDepth(msg.depth);
      if (msg.pv !== undefined) setBestline(msg.pv);
    };
    engine.onMessage(handleMessage);
    return () => engine.stop?.();
    // eslint-disable-next-line
  }, [engine, game]);

  // Analizuj po każdej zmianie pozycji
  useEffect(() => {
    if (!game.isGameOver() && !game.isDraw()) {
      engine.evaluatePosition(chessBoardPosition, 18);
    }
    // eslint-disable-next-line
  }, [chessBoardPosition, engine, game]);

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? 'q',
    });
    setPossibleMate('');
    setChessBoardPosition(game.fen());

    // illegal move
    if (move === null) return false;
    engine.stop();
    setBestline('');
    if (game.isGameOver() || game.isDraw()) return false;
    return true;
  }

  const bestMove = bestLine?.split(' ')?.[0];

  const handleFenInputChange = (e) => {
    const { valid } = game.validate_fen(e.target.value);
    if (valid && inputRef.current) {
      inputRef.current.value = e.target.value;
      game.load(e.target.value);
      setChessBoardPosition(game.fen());
    }
  };

  return (
    <div className="analyze">
      <h3 className="engineResult">
        Ocena pozycji: {possibleMate ? `#${possibleMate}` : positionEvaluation}
        {'; '}
        Głębokość: {depth}
      </h3>
      <h5 className="engineResult">
        Najlepsza linia: <i>{bestLine.slice(0, 40)}</i> ...
      </h5>
      <input
        ref={inputRef}
        style={{
          ...inputStyle,
          width: '90%',
        }}
        onChange={handleFenInputChange}
        placeholder="Paste FEN to start analysing custom position"
      />
      <div className="analyzeboard">
        <Chessboard
          id="AnalysisBoard"
          position={chessBoardPosition}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{
            backgroundColor: '#0056b3',
          }}
          customLightSquareStyle={{
            backgroundColor: '#edeed1',
          }}
          customArrows={
            bestMove
              ? [
                  [
                    bestMove.substring(0, 2),
                    bestMove.substring(2, 4),
                    'rgb(0, 128, 0)',
                  ],
                ]
              : undefined
          }
        />
      </div>
      <div className="controls">
        <button
          className="controlBtn"
          onClick={() => {
            setPossibleMate('');
            setBestline('');
            game.reset();
            setChessBoardPosition(game.fen());
          }}
        >
          Reset
        </button>
        <button
          className="controlBtn"
          onClick={() => {
            setPossibleMate('');
            setBestline('');
            game.undo();
            setChessBoardPosition(game.fen());
          }}
        >
          Cofnij
        </button>
        <button
          className="controlBtn backToMenuBtn"
          onClick={() => navigate('/')}
        >
          Powrót do menu
        </button>
      </div>
    </div>
  );
}
