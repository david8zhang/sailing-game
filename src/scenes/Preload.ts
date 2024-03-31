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
  }

  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}
