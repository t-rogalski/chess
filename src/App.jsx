import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="home">
      <nav>
        <div className="logo">
          <img src="/chessicon.svg" alt="logo"></img>
          <h1>Szachy</h1>
        </div>
        <ul className="mode-selection">
          <li>
            <Link to="/game/local">Gra lokalna</Link>
          </li>
          <li>
            <Link to="/game/vsComputer">Gra z komputerem</Link>
          </li>
          <li>
            <Link to="/analyze">Analiza pozycji</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
