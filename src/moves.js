// Move enum
export const MOVES = {
  PUNCH: 'Punch',
  LOW_KICK: 'Low Kick',
  DEFEND: 'Defend',
};

// List of all moves in order
export const MOVE_LIST = [MOVES.PUNCH, MOVES.LOW_KICK, MOVES.DEFEND];

// Move metadata
export const MOVE_COLORS = {
  [MOVES.PUNCH]: '#e94560',
  [MOVES.LOW_KICK]: '#f5a623',
  [MOVES.DEFEND]: '#0f3460',
};

export const MOVE_EMOJIS = {
  [MOVES.PUNCH]: '\u{1F44A}',
  [MOVES.LOW_KICK]: '\u{1F9B5}',
  [MOVES.DEFEND]: '\u{1F6E1}',
};
