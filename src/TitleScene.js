import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.socket = this.registry.get('socket');

    this.add.text(400, 130, 'FIGHT KIKI', {
      fontSize: '64px',
      fontFamily: 'Arial Black, Arial',
      color: '#e94560',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 200, 'A Battle of Wits', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#eee',
    }).setOrigin(0.5);

    this.showMainMenu();
  }

  showMainMenu() {
    this.menuGroup = this.add.group();

    const hostBtn = this.add.rectangle(400, 330, 280, 60, 0xe94560).setInteractive({ useHandCursor: true });
    const hostTxt = this.add.text(400, 330, 'Host Game', { fontSize: '28px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    const joinBtn = this.add.rectangle(400, 420, 280, 60, 0x0f3460).setInteractive({ useHandCursor: true });
    const joinTxt = this.add.text(400, 420, 'Join Game', { fontSize: '28px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    this.menuGroup.addMultiple([hostBtn, hostTxt, joinBtn, joinTxt]);

    hostBtn.on('pointerover', () => hostBtn.setFillStyle(0xff6b81));
    hostBtn.on('pointerout', () => hostBtn.setFillStyle(0xe94560));
    hostBtn.on('pointerdown', () => { this.menuGroup.destroy(true); this.showHostScreen(); });

    joinBtn.on('pointerover', () => joinBtn.setFillStyle(0x1a4a80));
    joinBtn.on('pointerout', () => joinBtn.setFillStyle(0x0f3460));
    joinBtn.on('pointerdown', () => { this.menuGroup.destroy(true); this.showJoinScreen(); });
  }

  showHostScreen() {
    this.add.text(400, 300, 'Creating room...', {
      fontSize: '24px', fontFamily: 'Arial', color: '#aaa',
    }).setOrigin(0.5);

    this.socket.emit('create-room', ({ code }) => {
      this.children.removeAll(true); // Clear everything

      this.add.text(400, 150, 'Your Room Code', {
        fontSize: '24px', fontFamily: 'Arial', color: '#aaa',
      }).setOrigin(0.5);

      this.add.text(400, 240, code, {
        fontSize: '72px', fontFamily: 'Arial Black, Arial', color: '#4fc3f7', fontStyle: 'bold',
      }).setOrigin(0.5);

      const waiting = this.add.text(400, 380, 'Waiting for opponent...', {
        fontSize: '20px', fontFamily: 'Arial', color: '#888',
      }).setOrigin(0.5);

      this.tweens.add({ targets: waiting, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });

      const backBtn = this.add.rectangle(400, 480, 160, 50, 0x444444).setInteractive({ useHandCursor: true });
      this.add.text(400, 480, 'Back', {
        fontSize: '24px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold',
      }).setOrigin(0.5);

      backBtn.on('pointerdown', () => {
        this.socket.disconnect();
        this.scene.start('TitleScene');
      });

      this.socket.once('opponent-joined', () => {
        this.scene.start('NameScene', { player: 'p1' });
      });
    });
  }

  showJoinScreen() {
    this.add.text(400, 280, 'Enter Room Code', {
      fontSize: '26px', fontFamily: 'Arial', color: '#eee',
    }).setOrigin(0.5);

    // Native HTML input for mobile keyboard support
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 4;
    input.placeholder = '1234';
    Object.assign(input.style, {
      position: 'absolute',
      left: '50%',
      top: '58%',
      transform: 'translate(-50%, -50%)',
      fontSize: '40px',
      width: '160px',
      textAlign: 'center',
      background: '#0f3460',
      color: '#4fc3f7',
      border: '2px solid #4fc3f7',
      borderRadius: '8px',
      padding: '8px',
      outline: 'none',
      letterSpacing: '12px',
    });
    document.body.appendChild(input);
    input.focus();

    this.statusText = this.add.text(400, 430, '', {
      fontSize: '20px', fontFamily: 'Arial', color: '#e94560',
    }).setOrigin(0.5);

    const joinBtn = this.add.rectangle(400, 500, 200, 55, 0x27ae60).setInteractive({ useHandCursor: true });
    this.add.text(400, 500, 'Join', { fontSize: '26px', fontFamily: 'Arial', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    joinBtn.on('pointerdown', () => {
      const code = input.value.trim();
      if (code.length !== 4) {
        this.statusText.setText('Please enter a 4-digit code.');
        return;
      }
      joinBtn.disableInteractive();
      this.socket.emit('join-room', code, ({ ok, error }) => {
        if (error) {
          this.statusText.setText(error);
          joinBtn.setInteractive({ useHandCursor: true });
          return;
        }
        input.remove();
        this.scene.start('NameScene', { player: 'p2' });
      });
    });

    // Clean up input if scene shuts down
    this.events.once('shutdown', () => input.remove());
  }
}
