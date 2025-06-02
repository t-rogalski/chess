import { Chessboard } from 'react-chessboard';

export default function BoardContainer(
  { fen, onDrop, orientation, onPromotionCheck, kingSquare } = {
    fen: 'start',
    orientation: 'white',
  },
) {
  return (
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
  );
}
