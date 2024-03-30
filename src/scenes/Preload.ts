import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('hull', 'hull.png')
    this.load.image('sail', 'sail.png')
    this.load.image('arrow', 'arrow.png')
  }

  create() {
    this.scene.start('game')
  }
}
