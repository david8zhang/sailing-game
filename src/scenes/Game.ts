import Phaser from 'phaser'
import { Player } from '../core/player'

export default class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }
  create() {
    const player = new Player(this, {
      position: {
        x: 100,
        y: 100,
      },
    })
  }
}
