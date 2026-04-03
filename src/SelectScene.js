import Phaser from 'phaser';
import { MOVE_LIST, MOVE_COLORS, MOVE_EMOJIS } from './moves.js';

const TOTAL_MOVES = 5;

export class SelectScene extends Phaser.Scene {
  constructor() {
    super('SelectScene');
  }

  init(data) {
    this.playerNumber = data.playerNumber;
    this.p1Moves = data.p1Moves || [];
    this.p2Moves = data.p2Moves || [];
    this.selectedMoves = [];
    this.isHandoff = data.isHandoff || false;
  }

  create() {
    if (this.isHandoff) {
      this.showHandoff();
      return;
    }

    // Header
    this.add.text(400, 40, `Player ${this.playerNumber} - Choose Your Moves`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: this.playerNumber === 1 ? '#4fc3f7' : '#ef5350',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 80, `Pick ${TOTAL_MOVES} moves in order`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#aaa',
    }).setOrigin(0.5);

    // Move buttons
    MOVE_LIST.forEach((move, i) => {
      const y = 180 + i * 90;
      const btn = this.add.rectangle(400, y, 300, 65, Phaser.Display.Color.HexStringToColor(MOVE_COLORS[move]).color)
        .setInteractive({ useHandCursor: true });

      this.add.text(400, y, `${MOVE_EMOJIS[move]}  ${move}`, {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#fff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      btn.on('pointerover', () => btn.setAlpha(0.8));
      btn.on('pointerout', () => btn.setAlpha(1));
      btn.on('pointerdown', () => this.addMove(move));
    });

    // Sequence display
    this.sequenceTexts = [];
    for (let i = 0; i < TOTAL_MOVES; i++) {
      const x = 160 + i * 120;
      const bg = this.add.rectangle(x, 490, 100, 50, 0x333333, 0.6).setStrokeStyle(2, 0x666666);
      const txt = this.add.text(x, 490, `${i + 1}.  --`, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#888',
      }).setOrigin(0.5);
      this.sequenceTexts.push({ bg, txt });
    }

    // Undo button
    this.undoBtn = this.add.text(400, 555, 'Undo', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#aaa',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.undoBtn.on('pointerdown', () => this.undoMove());
    this.undoBtn.on('pointerover', () => this.undoBtn.setColor('#fff'));
    this.undoBtn.on('pointerout', () => this.undoBtn.setColor('#aaa'));
  }

  addMove(move) {
    if (this.selectedMoves.length >= TOTAL_MOVES) return;

    this.selectedMoves.push(move);
    const idx = this.selectedMoves.length - 1;
    const slot = this.sequenceTexts[idx];
    slot.txt.setText(`${idx + 1}. ${MOVE_EMOJIS[move]}`);
    slot.txt.setColor(MOVE_COLORS[move]);
    slot.bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(MOVE_COLORS[move]).color);

    if (this.selectedMoves.length === TOTAL_MOVES) {
      this.showConfirm();
    }
  }

  undoMove() {
    if (this.selectedMoves.length === 0) return;

    // Remove confirm button if it exists
    if (this.confirmBtn) {
      this.confirmBtn.destroy();
      this.confirmText.destroy();
      this.confirmBtn = null;
      this.confirmText = null;
    }

    this.selectedMoves.pop();
    const idx = this.selectedMoves.length;
    const slot = this.sequenceTexts[idx];
    slot.txt.setText(`${idx + 1}.  --`);
    slot.txt.setColor('#888');
    slot.bg.setStrokeStyle(2, 0x666666);
  }

  showConfirm() {
    this.confirmBtn = this.add.rectangle(400, 555, 200, 50, 0x27ae60).setInteractive({ useHandCursor: true });
    this.confirmText = this.add.text(400, 555, 'Confirm!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.confirmBtn.on('pointerover', () => this.confirmBtn.setFillStyle(0x2ecc71));
    this.confirmBtn.on('pointerout', () => this.confirmBtn.setFillStyle(0x27ae60));
    this.confirmBtn.on('pointerdown', () => this.confirmSelection());
  }

  confirmSelection() {
    if (this.playerNumber === 1) {
      // Go to handoff, then P2 selects
      this.scene.start('SelectScene', {
        playerNumber: 2,
        p1Moves: this.selectedMoves,
        p2Moves: [],
        isHandoff: true,
      });
    } else {
      // Both players done — start fight
      this.scene.start('FightScene', {
        p1Moves: this.p1Moves,
        p2Moves: this.selectedMoves,
      });
    }
  }

  showHandoff() {
    this.add.text(400, 250, 'Pass to Player 2', {
      fontSize: '40px',
      fontFamily: 'Arial',
      color: '#ef5350',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 320, "(Don't let Player 1 peek!)", {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#aaa',
    }).setOrigin(0.5);

    const readyBtn = this.add.rectangle(400, 420, 240, 60, 0xef5350).setInteractive({ useHandCursor: true });
    this.add.text(400, 420, "I'm Ready", {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#fff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    readyBtn.on('pointerdown', () => {
      this.scene.start('SelectScene', {
        playerNumber: 2,
        p1Moves: this.p1Moves,
        p2Moves: [],
        isHandoff: false,
      });
    });
  }
}
