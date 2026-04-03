// Moves that beat each other: Punch > Low Kick > Defend > Punch
const WINS_AGAINST = {
  Punch: 'Low Kick',
  'Low Kick': 'Defend',
  Defend: 'Punch',
};

/**
 * Resolve a single round between two moves.
 * @returns 'p1' | 'p2' | 'tie'
 */
export function resolveRound(move1, move2) {
  if (move1 === move2) return 'tie';
  return WINS_AGAINST[move1] === move2 ? 'p1' : 'p2';
}

/**
 * Compute final scores from two move sequences.
 * @returns {{ p1Score: number, p2Score: number, winner: 'p1' | 'p2' | 'draw' }}
 */
export function computeScores(p1Moves, p2Moves) {
  let p1Score = 0;
  let p2Score = 0;

  for (let i = 0; i < p1Moves.length; i++) {
    const result = resolveRound(p1Moves[i], p2Moves[i]);
    if (result === 'p1') p1Score++;
    else if (result === 'p2') p2Score++;
  }

  let winner;
  if (p1Score > p2Score) winner = 'p1';
  else if (p2Score > p1Score) winner = 'p2';
  else winner = 'draw';

  return { p1Score, p2Score, winner };
}
