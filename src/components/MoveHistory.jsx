export default function MoveHistory({ history, currentMoveIndex }) {
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
                const whiteIndex = i * 2;
                const blackIndex = i * 2 + 1;
                const whiteMove = history[i * 2];
                const blackMove = history[i * 2 + 1];

                const whiteHighlight =
                  currentMoveIndex - 1 === whiteIndex ? "highlight" : "";
                const blackHighlight =
                  currentMoveIndex - 1 === blackIndex ? "highlight" : "";

                return (
                  <tr key={i}>
                    <td className="px-1 border">{i + 1}.</td>
                    <td className={`px-2 border ${whiteHighlight}`}>
                      {whiteMove?.san ?? ""}
                    </td>
                    <td className={`px-2 border ${blackHighlight}`}>
                      {blackMove?.san ?? ""}
                    </td>
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
