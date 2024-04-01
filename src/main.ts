import Game from './scenes/Game'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'

import { Preload } from './scenes/Preload'
import { UI } from './scenes/UI'
import { Constants } from './utils/Constants'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

const config = {
  width: Constants.WINDOW_WIDTH,
  height: Constants.WINDOW_HEIGHT,
  type: Phaser.WEBGL,
  parent: 'phaser',
  scene: [Preload, Game, UI],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  plugins: {
    global: [
      {
        key: 'rexOutlinePipeline',
        plugin: OutlinePipelinePlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: 'matterCollision',
        plugin: PhaserMatterCollisionPlugin,
        mapping: 'matterCollision',
      },
    ],
  },
  dom: {
    createContainer: true,
  },
}

const game = new Phaser.Game(config)
