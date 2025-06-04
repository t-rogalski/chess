export default class Engine {
  constructor() {
    this.stockfish = new Worker('/stockfish.js');
    this.callbacks = [];
    this.lastInfo = {};
    this.stockfish.addEventListener('message', (e) => {
      const line = typeof e.data === 'string' ? e.data : '';
      // Parsuj info
      if (line.startsWith('info')) {
        const depth = Number(line.match(/depth (\d+)/)?.[1]);
        const mate = line.match(/score mate (-?\d+)/)?.[1];
        const cp = line.match(/score cp (-?\d+)/)?.[1];
        const pv = line.match(/ pv (.+)/)?.[1];
        let positionEvaluation = cp ? Number(cp) : undefined;
        let possibleMate = mate ? Number(mate) : undefined;
        this.lastInfo = {
          depth,
          positionEvaluation,
          possibleMate,
          pv,
        };
        this.callbacks.forEach((cb) =>
          cb({
            depth,
            positionEvaluation,
            possibleMate,
            pv,
          }),
        );
      }
      // Parsuj bestmove
      if (line.startsWith('bestmove')) {
        const bestMove = line.match(/bestmove\s+(\S+)/)?.[1];
        this.callbacks.forEach((cb) => cb({ bestMove }));
      }
    });
    // Init engine
    this.sendMessage('uci');
    this.sendMessage('isready');
  }

  onMessage(callback) {
    this.callbacks.push(callback);
  }

  sendMessage(msg) {
    this.stockfish.postMessage(msg);
  }

  evaluatePosition(fen, depth) {
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {
    this.sendMessage('stop');
  }
  quit() {
    this.sendMessage('quit');
  }
}
