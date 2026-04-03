import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  init(data) {
    this.p1Score = data.p1Score;
    this.p2Score = data.p2Score;
    this.p1Name = data.p1Name || 'Player 1';
    this.p2Name = data.p2Name || 'Player 2';
  }

  create() {
    // Determine winner
    let title, titleColor;
    if (this.p1Score > this.p2Score) {
      title = `${this.p1Name} Wins!`;
      titleColor = '#4fc3f7';
    } else if (this.p2Score > this.p1Score) {
      title = `${this.p2Name} Wins!`;
      titleColor = '#ef5350';
    } else {
      title = "It's a Draw!";
      titleColor = '#ffd700';
    }

    this.add.text(400, 180, title, {
      fontSize: '52px',
      fontFamily: 'Arial Black, Arial',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score breakdown
    this.add.text(400, 280, `${this.p1Name}:  ${this.p1Score}   -   ${this.p2Score}  :${this.p2Name}`, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#fff',
    }).setOrigin(0.5);

    // Play again button
    const btn = this.add.rectangle(400, 420, 260, 60, 0x27ae60).setInteractive({ useHandCursor: true });
    this.add.text(400, 420, 'Play Again', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#fff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0x2ecc71));
    btn.on('pointerout', () => btn.setFillStyle(0x27ae60));
    btn.on('pointerdown', () => {
      this.scene.start('TitleScene');
    });
  }
}
