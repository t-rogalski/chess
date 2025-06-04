import { useState, useEffect } from 'react';

export default function AnalyzeGame({ analyze, game, engine }) {
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestline] = useState('');
  const [possibleMate, setPossibleMate] = useState('');

  useEffect(() => {
    if (!analyze) return;

    setPositionEvaluation(0);
    setDepth(10);
    setBestline('');
    setPossibleMate('');

    const fen = game.fen();
    engine.evaluatePosition(fen, 18);

    const handler = ({ positionEvaluation, possibleMate, pv, depth }) => {
      if (depth && depth < 10) return;
      if (positionEvaluation !== undefined) {
        setPositionEvaluation(
          ((game.turn() === 'w' ? 1 : -1) * Number(positionEvaluation)) / 100,
        );
      }
      if (possibleMate) setPossibleMate(possibleMate);
      if (depth) setDepth(depth);
      if (pv) setBestline(pv);
    };

    engine.onMessage(handler);
  }, [analyze, game, engine, game.fen()]);

  if (!analyze) return null;
  return (
    <div className="analyzeContainer">
      <h3 className="engineResult">
        Ocena pozycji: {possibleMate ? `#${possibleMate}` : positionEvaluation}
      </h3>
      <h3 className="engineResult">Głębokość: {depth}</h3>
      <h5 className="engineResult">
        Najlepsza linia:{' '}
        <i>{game.isGameOver() ? '(...)' : bestLine.slice(0, 40) + `...`}</i>
      </h5>
    </div>
  );
}
