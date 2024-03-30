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
  private keyRight!: Phaser.Input.Keyboard.Key
  private keyLeft!: Phaser.Input.Keyboard.Key
  private static TURN_SPEED_DEG_PER_FRAME = 5

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

    this.keyRight = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    )
    this.keyLeft = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    )

    this.game.updateFunctions.push(() => {
      this.update()
    })
  }

  handleTurn() {
    // Handle boat turn
    if (!this.keyLeft || !this.keyRight) {
      return
    }
    const leftDown = this.keyLeft.isDown
    const rightDown = this.keyRight.isDown
    if (leftDown) {
      this.hullSprite.setAngle(
        this.hullSprite.angle - Player.TURN_SPEED_DEG_PER_FRAME
      )
      this.sailsSprite.setAngle(
        this.sailsSprite.angle - Player.TURN_SPEED_DEG_PER_FRAME
      )
    } else if (rightDown) {
      this.hullSprite.setAngle(
        this.hullSprite.angle + Player.TURN_SPEED_DEG_PER_FRAME
      )
      this.sailsSprite.setAngle(
        this.sailsSprite.angle + Player.TURN_SPEED_DEG_PER_FRAME
      )
    }
  }

  handleWindDirection() {}

  update() {
    this.handleTurn()
  }
}
