import { BodyType } from 'matter'
import Game from '../scenes/Game'
import { ColliderLabels, Constants } from '../utils/Constants'
import { UI } from '../scenes/UI'

export interface PlayerConfig {
  position: {
    x: number
    y: number
  }
}

export class Player {
  // Ship speeds depending on wind
  private static MAX_HEALTH = 5
  private static TURN_SPEED_DEG_PER_FRAME = 5

  private game: Game
  public sprite: Phaser.Physics.Matter.Sprite
  private keyRight!: Phaser.Input.Keyboard.Key
  private keyLeft!: Phaser.Input.Keyboard.Key
  public isAnchored: boolean = true
  public isCooldown: boolean = false
  public health: number = Player.MAX_HEALTH
  public score: number = 0

  constructor(game: Game, config: PlayerConfig) {
    this.game = game
    this.sprite = this.game.matter.add.sprite(
      config.position.x,
      config.position.y,
      'ship'
    )
    this.sprite
      .setRectangle(this.sprite.displayWidth, this.sprite.displayHeight * 0.6, {
        label: ColliderLabels.PLAYER_COLLIDER_LABEL,
      })
      .setFixedRotation()

    this.keyRight = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    )
    this.keyLeft = this.game.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    )

    this.game.input.keyboard?.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      (e: Phaser.Input.Keyboard.Key) => {
        if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.A) {
          this.isAnchored = !this.isAnchored
        }
        if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
          this.fireCannon()
        }
        if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
          this.game.handleGameOver()
        }
      }
    )
    this.game.updateFunctions.push(() => {
      this.update()
    })
  }

  handleCollision(otherBody: BodyType) {
    if (otherBody.label === ColliderLabels.ENEMY_CANNONBALL) {
      const cannonballSprite = otherBody.gameObject
      if (cannonballSprite) {
        cannonballSprite.destroy()
        this.game.cameras.main.shake(150, 0.002)
        this.takeDamage()
      }
    }
  }

  fireCannon() {
    if (!this.isCooldown) {
      this.isCooldown = true
      this.game.sound.play('cannon-fire')
      const cannonball = this.game.matter.add.sprite(
        this.sprite.x,
        this.sprite.y,
        'cannonBall'
      )
      cannonball.setScale(2)
      cannonball.setCircle(cannonball.displayWidth / 2, {
        isSensor: true,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        label: ColliderLabels.PLAYER_CANNONBALL,
      })
      const currAngle = Phaser.Math.DegToRad(this.sprite.angle)
      const velocityVector = new Phaser.Math.Vector2(
        Math.cos(currAngle) * Constants.CANNONBALL_SPEED_MULTIPLIER,
        Math.sin(currAngle) * Constants.CANNONBALL_SPEED_MULTIPLIER
      )
      cannonball.setVelocity(velocityVector.x, velocityVector.y)
      this.game.time.addEvent({
        delay: 1000,
        callback: () => {
          this.isCooldown = false
        },
      })
    }
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
  }

  moveShipWithWind() {
    if (this.isAnchored) {
      this.sprite.setVelocity(0, 0)
      return
    }

    const currAngle = this.sprite.angle
    const windAngle = Constants.getAngleForWindDirection(
      this.game.windDirection
    )
    const angleDiff = Math.abs(
      Phaser.Math.Angle.ShortestBetween(currAngle, windAngle)
    )
    let speed = Constants.SLOW_SPEED
    if (angleDiff < 45) {
      speed = Constants.FAST_SPEED
    } else if (angleDiff >= 45 && angleDiff < 90) {
      speed = Constants.MEDIUM_SPEED
    } else if (angleDiff >= 90 && angleDiff < 180) {
      speed = Constants.SLOW_SPEED
    }
    const velocityVector = new Phaser.Math.Vector2(
      Math.cos(Phaser.Math.DegToRad(currAngle)) * speed,
      Math.sin(Phaser.Math.DegToRad(currAngle)) * speed
    )
    this.sprite.setVelocity(velocityVector.x, velocityVector.y)
  }

  update() {
    if (this.sprite.active) {
      this.handleTurn()
      this.moveShipWithWind()
    }
  }

  updateScore() {
    this.score++
    UI.instance.updateScoreText(this.score)
  }

  takeDamage() {
    this.game.sound.play('explosion')

    this.health = Math.max(this.health - 1, 0)
    UI.instance.updateHealthText(this.health)
    if (this.health == 0) {
      this.game.handleGameOver()
    }
  }
}
