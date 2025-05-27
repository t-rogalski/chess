import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import MoveHistory from "./MoveHistory";

export default function ChessGame() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [game, _] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [orientation, setOrientation] = useState("white");
  const [autoOrientation, setAutoOrientation] = useState(
    mode === "local" ? true : false,
  );
  const [backgroundColor, setBackgroundColor] = useState("green");

  const onButtonClick = (color) => {
    setBackgroundColor(color);
  };

  const makeRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || possibleMoves.length === 0) return;

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return;
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));

    if (mode === "vsComputer") {
      setTimeout(makeRandomMove, 500);
    }

    if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
      alert("REMIS!");
    }

    if (game.isCheckmate()) {
      alert(`MAT! ${game.turn() === "w" ? "Czarne" : "Białe"} wygrały!`);
    }

    if (mode === "local") {
      if (autoOrientation) {
        setOrientation(game.turn() === "w" ? "white" : "black");
      }
    }
  };

  return (
    <div className="container">
      <div className="board-container">
        <Chessboard
          position={fen}
          onPieceDrop={(sourceSquare, targetSquare) => {
            onDrop({ sourceSquare, targetSquare });
            return true;
          }}
          boardWidth={800}
          boardOrientation={orientation}
        />
      </div>
      <div className="right-panel">
        <MoveHistory history={history} />
        <div>
          <button onClick={() => navigate("/")}>Powrót do menu</button>
          <button
            onClick={() => {
              game.reset();
              setFen("start");
              setHistory([]);
              setOrientation("white");
            }}
          >
            Reset
          </button>
          <button
            style={{ backgroundColor }}
            onClick={() => {
              setAutoOrientation(!autoOrientation);
              onButtonClick(!autoOrientation ? "green" : "red");
            }}
          >
            Auto Orientacja
          </button>
        </div>
      </div>
    </div>
  );
}
