import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="mode-selection">
      <button onClick={() => navigate("/game/local")}>Gra lokalna</button>
      <button onClick={() => navigate("/game/vsComputer")}>
        Gra z komputerem
      </button>
    </div>
  );
}
