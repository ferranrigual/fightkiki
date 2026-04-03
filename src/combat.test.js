import { describe, it, expect } from 'vitest';
import { resolveRound, computeScores } from './combat.js';

describe('resolveRound', () => {
  describe('wins', () => {
    it('Punch beats Low Kick', () => {
      expect(resolveRound('Punch', 'Low Kick')).toBe('p1');
    });
    it('Low Kick beats Defend', () => {
      expect(resolveRound('Low Kick', 'Defend')).toBe('p1');
    });
    it('Defend beats Punch', () => {
      expect(resolveRound('Defend', 'Punch')).toBe('p1');
    });
  });

  describe('losses (symmetric)', () => {
    it('Low Kick loses to Punch', () => {
      expect(resolveRound('Low Kick', 'Punch')).toBe('p2');
    });
    it('Defend loses to Low Kick', () => {
      expect(resolveRound('Defend', 'Low Kick')).toBe('p2');
    });
    it('Punch loses to Defend', () => {
      expect(resolveRound('Punch', 'Defend')).toBe('p2');
    });
  });

  describe('ties', () => {
    it('Punch vs Punch is a tie', () => {
      expect(resolveRound('Punch', 'Punch')).toBe('tie');
    });
    it('Low Kick vs Low Kick is a tie', () => {
      expect(resolveRound('Low Kick', 'Low Kick')).toBe('tie');
    });
    it('Defend vs Defend is a tie', () => {
      expect(resolveRound('Defend', 'Defend')).toBe('tie');
    });
  });
});

describe('computeScores', () => {
  it('P1 wins all rounds', () => {
    const p1 = ['Punch', 'Punch', 'Punch', 'Punch', 'Punch'];
    const p2 = ['Low Kick', 'Low Kick', 'Low Kick', 'Low Kick', 'Low Kick'];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 5, p2Score: 0, winner: 'p1' });
  });

  it('P2 wins all rounds', () => {
    const p1 = ['Low Kick', 'Low Kick', 'Low Kick', 'Low Kick', 'Low Kick'];
    const p2 = ['Punch', 'Punch', 'Punch', 'Punch', 'Punch'];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 0, p2Score: 5, winner: 'p2' });
  });

  it('all ties gives a draw', () => {
    const p1 = ['Punch', 'Low Kick', 'Defend', 'Punch', 'Low Kick'];
    const p2 = ['Punch', 'Low Kick', 'Defend', 'Punch', 'Low Kick'];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 0, p2Score: 0, winner: 'draw' });
  });

  it('equal wins gives a draw', () => {
    // P1 wins rounds 1,2 — P2 wins rounds 3,4 — round 5 is a tie
    const p1 = ['Punch', 'Low Kick', 'Low Kick', 'Defend', 'Punch'];
    const p2 = ['Low Kick', 'Defend', 'Punch', 'Low Kick', 'Punch'];
    const result = computeScores(p1, p2);
    expect(result.p1Score).toBe(result.p2Score);
    expect(result.winner).toBe('draw');
  });

  it('mixed sequence tallies correctly', () => {
    // P1: Punch>LK, Defend>P, LK loses to P, tie, LK>D  → p1=3, p2=1
    const p1 = ['Punch', 'Defend', 'Low Kick', 'Punch', 'Low Kick'];
    const p2 = ['Low Kick', 'Punch', 'Punch', 'Punch', 'Defend'];
    expect(computeScores(p1, p2)).toEqual({ p1Score: 3, p2Score: 1, winner: 'p1' });
  });
});
