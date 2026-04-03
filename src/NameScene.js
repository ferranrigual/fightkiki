import Phaser from 'phaser';

export class NameScene extends Phaser.Scene {
  constructor() {
    super('NameScene');
  }

  init(data) {
    this.player = data.player; // 'p1' or 'p2'
  }

  create() {
    this.socket = this.registry.get('socket');

    this.add.text(400, 150, "What's your name?", {
      fontSize: '36px', fontFamily: 'Arial', color: '#eee', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 220, `(${this.player === 'p1' ? 'Host' : 'Guest'})`, {
      fontSize: '16px', fontFamily: 'Arial', color: '#aaa',
    }).setOrigin(0.5);

    // Native HTML input for mobile keyboard
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 20;
    input.placeholder = 'Enter name';
    Object.assign(input.style, {
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%, -50%)',
      fontSize: '28px',
      width: '280px',
      textAlign: 'center',
      background: '#0f3460',
      color: '#4fc3f7',
      border: '2px solid #4fc3f7',
      borderRadius: '8px',
      padding: '12px',
      outline: 'none',
    });
    document.body.appendChild(input);
    input.focus();

    this.statusText = this.add.text(400, 350, '', {
      fontSize: '18px', fontFamily: 'Arial', color: '#e94560',
    }).setOrigin(0.5);

    const confirmBtn = this.add.rectangle(400, 430, 220, 55, 0x27ae60).setInteractive({ useHandCursor: true });
    this.add.text(400, 430, 'Confirm', {
      fontSize: '26px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);

    confirmBtn.on('pointerdown', () => {
      const name = input.value.trim();
      if (!name) {
        this.statusText.setText('Please enter a name.');
        return;
      }
      confirmBtn.disableInteractive();
      this.submitName(name, input);
    });

    // Listen for names-ready from server
    this.socket.once('names-ready', ({ p1Name, p2Name }) => {
      input.remove();
      this.scene.start('SelectScene', {
        player: this.player,
        name: this.player === 'p1' ? p1Name : p2Name,
        opponentName: this.player === 'p1' ? p2Name : p1Name,
      });
    });

    // Listen for opponent disconnect
    this.socket.once('opponent-disconnected', () => {
      this.showDisconnected(input);
    });

    // Clean up input if scene shuts down
    this.events.once('shutdown', () => input.remove());
  }

  submitName(name, input) {
    this.socket.emit('submit-name', name);

    // Show waiting overlay
    this.add.rectangle(400, 430, 400, 80, 0x1a1a2e).setOrigin(0.5);
    const waitTxt = this.add.text(400, 430, 'Waiting for opponent...', {
      fontSize: '20px', fontFamily: 'Arial', color: '#888',
    }).setOrigin(0.5);
    this.tweens.add({ targets: waitTxt, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });
  }

  showDisconnected(input) {
    input.remove();
    this.add.rectangle(400, 300, 500, 150, 0x000000, 0.85).setOrigin(0.5);
    this.add.text(400, 285, 'Opponent disconnected', {
      fontSize: '26px', fontFamily: 'Arial', color: '#e94560', fontStyle: 'bold',
    }).setOrigin(0.5);

    const backBtn = this.add.rectangle(400, 340, 200, 45, 0x444444).setInteractive({ useHandCursor: true });
    this.add.text(400, 340, 'Back to Menu', { fontSize: '20px', fontFamily: 'Arial', color: '#fff' }).setOrigin(0.5);
    backBtn.on('pointerdown', () => this.scene.start('TitleScene'));
  }
}
