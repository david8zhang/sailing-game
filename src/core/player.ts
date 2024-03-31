import Game from '../scenes/Game'
import { Constants } from '../utils/Constants'

export interface PlayerConfig {
  position: {
    x: number
    y: number
  }
}

export class Player {
  private game: Game
  public sprite: Phaser.Physics.Matter.Sprite
  private keyRight!: Phaser.Input.Keyboard.Key
  private keyLeft!: Phaser.Input.Keyboard.Key
  private static TURN_SPEED_DEG_PER_FRAME = 5
  public isAnchored: boolean = false

  // Ship speeds depending on wind
  private static SLOW_SPEED = 1
  private static MEDIUM_SPEED = 2
  private static FAST_SPEED = 3

  constructor(game: Game, config: PlayerConfig) {
    this.game = game
    this.sprite = this.game.matter.add.sprite(
      config.position.x,
      config.position.y,
      'ship'
    )
    this.sprite.setRectangle(
      this.sprite.displayWidth,
      this.sprite.displayHeight * 0.6
    )

    this.keyRight = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    )
    this.keyLeft = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    )

    this.game.input.keyboard?.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      (e: Phaser.Input.Keyboard.Key) => {
        if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
          this.isAnchored = !this.isAnchored
        }
      }
    )
    this.game.updateFunctions.push(() => {
      this.update()
    })
    this.game.cameras.main.startFollow(this.sprite)
  }

  handleTurn() {
    // Handle boat turn
    if (!this.keyLeft || !this.keyRight) {
      return
    }
    const leftDown = this.keyLeft.isDown
    const rightDown = this.keyRight.isDown
    if (leftDown) {
      this.sprite.setAngle(this.sprite.angle - Player.TURN_SPEED_DEG_PER_FRAME)
    } else if (rightDown) {
      this.sprite.setAngle(this.sprite.angle + Player.TURN_SPEED_DEG_PER_FRAME)
    }
    if (this.isAnchored) {
      this.sprite.setVelocity(0, 0)
    } else {
      this.moveShipWithWind()
    }
  }

  moveShipWithWind() {
    const currAngle = this.sprite.angle
    const windAngle = Constants.getAngleForWindDirection(
      this.game.windDirection
    )
    const angleDiff = Math.abs(
      Phaser.Math.Angle.ShortestBetween(currAngle, windAngle)
    )
    let speed = Player.SLOW_SPEED
    if (angleDiff < 45) {
      speed = Player.FAST_SPEED
    } else if (angleDiff >= 45 && angleDiff < 90) {
      speed = Player.MEDIUM_SPEED
    } else if (angleDiff >= 90 && angleDiff < 180) {
      speed = Player.SLOW_SPEED
    }
    const velocityVector = new Phaser.Math.Vector2(
      Math.cos(Phaser.Math.DegToRad(currAngle)) * speed,
      Math.sin(Phaser.Math.DegToRad(currAngle)) * speed
    )
    this.sprite.setVelocity(velocityVector.x, velocityVector.y)

    // this.sprite.applyForce(velocityVector)
    // this.game.matter.applyForceFromAngle(
    //   [this.sprite.body],
    //   speed,
    //   this.sprite.angle
    // )
  }

  update() {
    this.handleTurn()
  }
}
