export default function MoveHistory({ history }) {
  return (
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
                    <td className="px-2 border">{whiteMove?.san ?? ""}</td>
                    <td className="px-2 border">{blackMove?.san ?? ""}</td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
