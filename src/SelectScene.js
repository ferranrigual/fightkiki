import Phaser from 'phaser';
import { MOVE_LIST, MOVE_COLORS, MOVE_EMOJIS } from './moves.js';

const TOTAL_MOVES = 5;

export class SelectScene extends Phaser.Scene {
  constructor() {
    super('SelectScene');
  }

  init(data) {
    this.player = data.player; // 'p1' or 'p2'
    this.name = data.name;
    this.opponentName = data.opponentName;
    this.selectedMoves = [];
  }

  create() {
    this.socket = this.registry.get('socket');

    // Header
    const color = this.player === 'p1' ? '#4fc3f7' : '#ef5350';

    this.add.text(400, 40, `${this.name} - Choose Your Moves`, {
      fontSize: '30px', fontFamily: 'Arial', color, fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 80, `Pick ${TOTAL_MOVES} moves in order`, {
      fontSize: '18px', fontFamily: 'Arial', color: '#aaa',
    }).setOrigin(0.5);

    // Move buttons
    this.moveButtons = [];
    MOVE_LIST.forEach((move, i) => {
      const y = 175 + i * 90;
      const btn = this.add.rectangle(400, y, 300, 65, Phaser.Display.Color.HexStringToColor(MOVE_COLORS[move]).color)
        .setInteractive({ useHandCursor: true });

      this.add.text(400, y, `${MOVE_EMOJIS[move]}  ${move}`, {
        fontSize: '28px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold',
      }).setOrigin(0.5);

      btn.on('pointerover', () => btn.setAlpha(0.8));
      btn.on('pointerout', () => btn.setAlpha(1));
      btn.on('pointerdown', () => this.addMove(move));
      this.moveButtons.push(btn);
    });

    // Sequence slots
    this.sequenceTexts = [];
    for (let i = 0; i < TOTAL_MOVES; i++) {
      const x = 160 + i * 120;
      const bg = this.add.rectangle(x, 490, 100, 50, 0x333333, 0.6).setStrokeStyle(2, 0x666666);
      const txt = this.add.text(x, 490, `${i + 1}.  --`, {
        fontSize: '18px', fontFamily: 'Arial', color: '#888',
      }).setOrigin(0.5);
      this.sequenceTexts.push({ bg, txt });
    }

    // Undo button
    this.undoBtn = this.add.text(400, 555, 'Undo', {
      fontSize: '20px', fontFamily: 'Arial', color: '#aaa',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.undoBtn.on('pointerdown', () => this.undoMove());
    this.undoBtn.on('pointerover', () => this.undoBtn.setColor('#fff'));
    this.undoBtn.on('pointerout', () => this.undoBtn.setColor('#aaa'));

    // Listen for opponent disconnect
    this.socket.once('opponent-disconnected', () => {
      this.showDisconnected();
    });

    // Listen for fight start (in case server sends it while we're still here)
    this.socket.once('start-fight', (data) => {
      this.scene.start('FightScene', { ...data, localPlayer: this.player });
    });
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
    this.confirmBtn = this.add.rectangle(400, 555, 220, 50, 0x27ae60).setInteractive({ useHandCursor: true });
    this.confirmText = this.add.text(400, 555, 'Lock In!', {
      fontSize: '24px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.confirmBtn.on('pointerover', () => this.confirmBtn.setFillStyle(0x2ecc71));
    this.confirmBtn.on('pointerout', () => this.confirmBtn.setFillStyle(0x27ae60));
    this.confirmBtn.on('pointerdown', () => this.submitMoves());
  }

  submitMoves() {
    // Disable all interaction while waiting
    this.moveButtons.forEach(b => b.disableInteractive());
    this.undoBtn.disableInteractive();
    this.confirmBtn.disableInteractive();
    this.confirmBtn.setFillStyle(0x555555);
    this.confirmText.setText('Waiting...');

    this.socket.emit('submit-moves', this.selectedMoves);

    // Show waiting overlay
    this.add.rectangle(400, 555, 400, 50, 0x1a1a2e).setOrigin(0.5);
    const waitTxt = this.add.text(400, 555, 'Waiting for opponent...', {
      fontSize: '20px', fontFamily: 'Arial', color: '#888',
    }).setOrigin(0.5);
    this.tweens.add({ targets: waitTxt, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });
  }

  showDisconnected() {
    this.add.rectangle(400, 300, 500, 150, 0x000000, 0.85).setOrigin(0.5);
    this.add.text(400, 285, 'Opponent disconnected', {
      fontSize: '26px', fontFamily: 'Arial', color: '#e94560', fontStyle: 'bold',
    }).setOrigin(0.5);

    const backBtn = this.add.rectangle(400, 340, 200, 45, 0x444444).setInteractive({ useHandCursor: true });
    this.add.text(400, 340, 'Back to Menu', { fontSize: '20px', fontFamily: 'Arial', color: '#fff' }).setOrigin(0.5);
    backBtn.on('pointerdown', () => this.scene.start('TitleScene'));
  }
}
