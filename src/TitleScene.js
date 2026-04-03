import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.add.text(400, 200, 'FIGHT KIKI', {
      fontSize: '64px',
      fontFamily: 'Arial Black, Arial',
      color: '#e94560',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 300, 'A Battle of Wits', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#eee',
    }).setOrigin(0.5);

    const prompt = this.add.text(400, 450, 'Click to Start', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#0f3460',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once('pointerdown', () => {
      this.scene.start('SelectScene', { playerNumber: 1, p1Moves: [], p2Moves: [] });
    });
  }
}
