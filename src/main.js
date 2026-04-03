import Phaser from 'phaser';
import { TitleScene } from './TitleScene.js';
import { SelectScene } from './SelectScene.js';
import { FightScene } from './FightScene.js';
import { ResultScene } from './ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: document.body,
  scene: [TitleScene, SelectScene, FightScene, ResultScene],
};

new Phaser.Game(config);
