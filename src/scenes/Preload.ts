import { Scene } from 'phaser'
import { EventBus } from '../core/EventBus'
import { Cache } from '../core/Cache'

export class Preload extends Scene {
  constructor() {
    super('preload')
    new EventBus()
    new Cache()
  }

  preload() {
    this.load.image('ship', 'ship.png')
    this.load.image('arrow', 'arrow.png')
    this.load.image('cannonBall', 'cannonBall.png')

    // Enemies
    this.load.image('pirate-fullhealth', 'enemies/pirate-fullhealth.png')
    this.load.image('pirate-halfhealth', 'enemies/pirate-halfhealth.png')
    this.load.image('pirate-lowhealth', 'enemies/pirate-lowhealth.png')

    // Tilemap
    this.load.tilemapTiledJSON('default-map', 'tilemap/default-map.json')
    this.load.image('tiles_sheet', 'tilemap/tiles_sheet-extruded.png')

    // Audio
    this.load.audio('title-music', 'music/title-music.mp3')
    this.load.audio('game-music', 'music/game.mp3')
    this.load.audio('cannon-fire', 'sfx/cannon-fire.mp3')
    this.load.audio('explosion', 'sfx/explosion.mp3')
  }

  create() {
    this.scene.start('start')
  }
}
