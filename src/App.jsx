import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./App.css";

const Button = ({ children, ...props }) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    {...props}
  >
    {children}
  </button>
);

export default function App() {
  const [gameMode, setGameMode] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);

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

    if (gameMode === "vsComputer") {
      setTimeout(makeRandomMove, 500);
    }
  };

  const resetGame = (mode) => {
    const newGame = new Chess();
    setGame(newGame);
    setFen("start");
    setHistory([]);
    setGameMode(mode);
  };

  if (!gameMode) {
    return (
      <div className="flex">
        <Button onClick={() => resetGame("local")}>Gra lokalna</Button>
        <Button onClick={() => resetGame("vsComputer")}>
          Gra z komputerem
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="board-container">
          <Chessboard
            position={fen}
            onPieceDrop={(sourceSquare, targetSquare) => {
              onDrop({ sourceSquare, targetSquare });
              return true;
            }}
            boardWidth={800}
          />
        </div>
        <div className="right-panel">
          <div>
            <h2>Historia ruchów:</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th className="px-1">#</th>
                    <th className="px-2">Biały</th>
                    <th className="px-2">Czarny</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(history.length / 2) }).map(
                    (_, i) => {
                      const whiteMove = history[i * 2];
                      const blackMove = history[i * 2 + 1];

                      return (
                        <tr key={i}>
                          <td className="px-1 border">{i + 1}.</td>
                          <td className="px-2 border">
                            {whiteMove && whiteMove.color === "w"
                              ? whiteMove.san
                              : ""}
                          </td>
                          <td className="px-2 border">
                            {blackMove && blackMove.color === "b"
                              ? blackMove.san
                              : ""}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Button onClick={() => resetGame(null)}>Powrót do menu</Button>
        </div>
      </div>
    </div>
  );
}
