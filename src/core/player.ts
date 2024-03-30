import Game from '../scenes/Game'

export interface PlayerConfig {
  position: {
    x: number
    y: number
  }
}

export class Player {
  private game: Game
  public hullSprite: Phaser.GameObjects.Sprite
  public sailsSprite: Phaser.GameObjects.Sprite

  constructor(game: Game, config: PlayerConfig) {
    this.game = game
    this.hullSprite = this.game.add.sprite(
      config.position.x,
      config.position.y,
      'hull'
    )
    this.sailsSprite = this.game.add.sprite(
      config.position.x,
      config.position.y,
      'sail'
    )
  }
}
