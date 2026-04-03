import { describe, it, expect } from 'vitest';
import { resolveRound, computeScores } from './combat.js';
import { MOVES } from './moves.js';

describe('resolveRound', () => {
  describe('wins', () => {
    it('Punch beats Low Kick', () => {
      expect(resolveRound(MOVES.PUNCH, MOVES.LOW_KICK)).toBe('p1');
    });
    it('Low Kick beats Defend', () => {
      expect(resolveRound(MOVES.LOW_KICK, MOVES.DEFEND)).toBe('p1');
    });
    it('Defend beats Punch', () => {
      expect(resolveRound(MOVES.DEFEND, MOVES.PUNCH)).toBe('p1');
    });
  });

  describe('losses (symmetric)', () => {
    it('Low Kick loses to Punch', () => {
      expect(resolveRound(MOVES.LOW_KICK, MOVES.PUNCH)).toBe('p2');
    });
    it('Defend loses to Low Kick', () => {
      expect(resolveRound(MOVES.DEFEND, MOVES.LOW_KICK)).toBe('p2');
    });
    it('Punch loses to Defend', () => {
      expect(resolveRound(MOVES.PUNCH, MOVES.DEFEND)).toBe('p2');
    });
  });

  describe('ties', () => {
    it('Punch vs Punch is a tie', () => {
      expect(resolveRound(MOVES.PUNCH, MOVES.PUNCH)).toBe('tie');
    });
    it('Low Kick vs Low Kick is a tie', () => {
      expect(resolveRound(MOVES.LOW_KICK, MOVES.LOW_KICK)).toBe('tie');
    });
    it('Defend vs Defend is a tie', () => {
      expect(resolveRound(MOVES.DEFEND, MOVES.DEFEND)).toBe('tie');
    });
  });
});

describe('computeScores', () => {
  it('P1 wins all rounds', () => {
    const p1 = [MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH];
    const p2 = [MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 5, p2Score: 0, winner: 'p1' });
  });

  it('P2 wins all rounds', () => {
    const p1 = [MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.LOW_KICK];
    const p2 = [MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 0, p2Score: 5, winner: 'p2' });
  });

  it('all ties gives a draw', () => {
    const p1 = [MOVES.PUNCH, MOVES.LOW_KICK, MOVES.DEFEND, MOVES.PUNCH, MOVES.LOW_KICK];
    const p2 = [MOVES.PUNCH, MOVES.LOW_KICK, MOVES.DEFEND, MOVES.PUNCH, MOVES.LOW_KICK];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 0, p2Score: 0, winner: 'draw' });
  });

  it('equal wins gives a draw', () => {
    // P1 wins rounds 1,2 — P2 wins rounds 3,4 — round 5 is a tie
    const p1 = [MOVES.PUNCH, MOVES.LOW_KICK, MOVES.LOW_KICK, MOVES.DEFEND, MOVES.PUNCH];
    const p2 = [MOVES.LOW_KICK, MOVES.DEFEND, MOVES.PUNCH, MOVES.LOW_KICK, MOVES.PUNCH];
    const result = computeScores(p1, p2);
    expect(result.p1Score).toBe(result.p2Score);
    expect(result.winner).toBe('draw');
  });

  it('mixed sequence tallies correctly', () => {
    // P1: Punch>LK, Defend>P, LK loses to P, tie, LK>D  → p1=3, p2=1
    const p1 = [MOVES.PUNCH, MOVES.DEFEND, MOVES.LOW_KICK, MOVES.PUNCH, MOVES.LOW_KICK];
    const p2 = [MOVES.LOW_KICK, MOVES.PUNCH, MOVES.PUNCH, MOVES.PUNCH, MOVES.DEFEND];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 3, p2Score: 1, winner: 'p1' });
  });
});
