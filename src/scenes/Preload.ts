import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('ship', 'ship.png')
    this.load.image('arrow', 'arrow.png')

    // Tilemap
    this.load.tilemapTiledJSON('default-map', 'tilemap/default-map.json')
    this.load.image('tiles_sheet', 'tilemap/tiles_sheet-extruded.png')
  }

  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}
