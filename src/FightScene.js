import Phaser from 'phaser';
import { resolveRound } from './combat.js';
import { MOVE_EMOJIS } from './moves.js';

export class FightScene extends Phaser.Scene {
  constructor() {
    super('FightScene');
  }

  init(data) {
    this.p1Moves = data.p1Moves;
    this.p2Moves = data.p2Moves;
    this.p1Score = 0;
    this.p2Score = 0;
    this.currentRound = 0;
  }

  create() {
    // Arena background
    this.add.rectangle(400, 500, 800, 200, 0x2d2d2d);
    this.add.rectangle(400, 500, 780, 4, 0x444444).setOrigin(0.5, 0);

    // Player labels
    this.add.text(150, 30, 'Player 1', {
      fontSize: '24px', fontFamily: 'Arial', color: '#4fc3f7', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(650, 30, 'Player 2', {
      fontSize: '24px', fontFamily: 'Arial', color: '#ef5350', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score displays
    this.p1ScoreText = this.add.text(150, 60, 'Score: 0', {
      fontSize: '20px', fontFamily: 'Arial', color: '#fff',
    }).setOrigin(0.5);
    this.p2ScoreText = this.add.text(650, 60, 'Score: 0', {
      fontSize: '20px', fontFamily: 'Arial', color: '#fff',
    }).setOrigin(0.5);

    // Draw fighters
    this.p1Fighter = this.drawFighter(200, 350, 0x4fc3f7, false);
    this.p2Fighter = this.drawFighter(600, 350, 0xef5350, true);

    // Round text
    this.roundText = this.add.text(400, 120, '', {
      fontSize: '32px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Move display
    this.p1MoveText = this.add.text(200, 220, '', {
      fontSize: '40px', fontFamily: 'Arial',
    }).setOrigin(0.5);
    this.p2MoveText = this.add.text(600, 220, '', {
      fontSize: '40px', fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Result text (per round)
    this.resultText = this.add.text(400, 270, '', {
      fontSize: '24px', fontFamily: 'Arial', color: '#ffd700', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Start the fight after a short delay
    this.time.delayedCall(800, () => this.playRound());
  }

  drawFighter(x, y, color, flipped) {
    const g = this.add.graphics();

    // Body
    g.fillStyle(color, 1);
    g.fillRoundedRect(x - 25, y - 30, 50, 80, 8);

    // Head
    g.fillCircle(x, y - 50, 22);

    // Arms
    const armDir = flipped ? -1 : 1;
    g.fillRect(x + armDir * 25, y - 20, armDir * 30, 12);
    g.fillRect(x - armDir * 25 - (flipped ? 5 : 25), y - 10, 30, 12);

    // Legs
    g.fillRect(x - 18, y + 50, 14, 40);
    g.fillRect(x + 4, y + 50, 14, 40);

    // Eyes
    g.fillStyle(0x000000, 1);
    const eyeOffset = flipped ? -6 : 6;
    g.fillCircle(x - 7, y - 55, 3);
    g.fillCircle(x + 7, y - 55, 3);

    return g;
  }

  playRound() {
    if (this.currentRound >= this.p1Moves.length) {
      this.time.delayedCall(1000, () => {
        this.scene.start('ResultScene', {
          p1Score: this.p1Score,
          p2Score: this.p2Score,
        });
      });
      return;
    }

    const round = this.currentRound;
    const m1 = this.p1Moves[round];
    const m2 = this.p2Moves[round];

    // Show round number
    this.roundText.setText(`Round ${round + 1}`);
    this.p1MoveText.setText('');
    this.p2MoveText.setText('');
    this.resultText.setText('');

    // Reveal moves with a delay
    this.time.delayedCall(600, () => {
      this.p1MoveText.setText(`${MOVE_EMOJIS[m1]} ${m1}`);
      this.p1MoveText.setFontSize('28px');
    });

    this.time.delayedCall(1200, () => {
      this.p2MoveText.setText(`${m2} ${MOVE_EMOJIS[m2]}`);
      this.p2MoveText.setFontSize('28px');
    });

    // Resolve and animate
    this.time.delayedCall(1800, () => {
      const result = resolveRound(m1, m2);

      if (result === 'p1') {
        this.p1Score++;
        this.resultText.setText('Player 1 scores!').setColor('#4fc3f7');
        this.animateHit(this.p2Fighter);
      } else if (result === 'p2') {
        this.p2Score++;
        this.resultText.setText('Player 2 scores!').setColor('#ef5350');
        this.animateHit(this.p1Fighter);
      } else {
        this.resultText.setText('Tie!').setColor('#ffd700');
      }

      this.p1ScoreText.setText(`Score: ${this.p1Score}`);
      this.p2ScoreText.setText(`Score: ${this.p2Score}`);

      this.currentRound++;
      this.time.delayedCall(1500, () => this.playRound());
    });
  }

  animateHit(fighter) {
    this.tweens.add({
      targets: fighter,
      x: fighter.x + (Math.random() > 0.5 ? 10 : -10),
      duration: 50,
      yoyo: true,
      repeat: 3,
    });
    this.cameras.main.shake(150, 0.005);
  }
}
