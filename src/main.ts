import Game from './scenes/Game'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'

import { Preload } from './scenes/Preload'
import { UI } from './scenes/UI'
import { Constants } from './utils/Constants'
import { GameOver } from './scenes/GameOver'
import { Start } from './scenes/Start'

const config = {
  width: Constants.WINDOW_WIDTH,
  height: Constants.WINDOW_HEIGHT,
  type: Phaser.WEBGL,
  parent: 'phaser',
  scene: [Preload, Start, Game, UI, GameOver],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      // debug: true,
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
  },
  dom: {
    createContainer: true,
  },
}

new Phaser.Game(config)
