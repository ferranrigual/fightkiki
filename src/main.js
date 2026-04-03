import Phaser from 'phaser';
import { io } from 'socket.io-client';
import { TitleScene } from './TitleScene.js';
import { NameScene } from './NameScene.js';
import { SelectScene } from './SelectScene.js';
import { FightScene } from './FightScene.js';
import { ResultScene } from './ResultScene.js';

// Single shared socket for all scenes
// Use Railway backend in production, localhost in dev
const socketUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://fightkiki.up.railway.app';

const socket = io(socketUrl);

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: document.body,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [TitleScene, NameScene, SelectScene, FightScene, ResultScene],
  callbacks: {
    preBoot: (game) => {
      game.registry.set('socket', socket);
    },
  },
};

new Phaser.Game(config);
