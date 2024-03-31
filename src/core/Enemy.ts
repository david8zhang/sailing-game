import { BodyType } from 'matter'
import Game from '../scenes/Game'
import { Constants } from '../utils/Constants'
import { Node } from './map/Pathfinding'

export interface EnemyConfig {
  position: {
    x: number
    y: number
  }
}

export class Enemy {
  private static MAX_HEALTH = 3
  public static ENEMY_SENSOR_LABEL = 'enemy-collision-sensor'
  public static ENEMY_MAIN_COLLIDER = 'enemy-main-collider'

  private game: Game
  public sprite: Phaser.Physics.Matter.Sprite
  private health: number = Enemy.MAX_HEALTH
  private currPath: Node[] = []
  private isTurning: boolean = false

  constructor(game: Game, config: EnemyConfig) {
    this.game = game
    this.sprite = this.game.matter.add.sprite(
      config.position.x,
      config.position.y,
      'pirate-fullhealth'
    )
    const { Bodies, Body } = (Phaser.Physics.Matter as any)
      .Matter as typeof MatterJS
    const mainBody = Bodies.rectangle(
      0,
      0,
      this.sprite.displayWidth,
      this.sprite.displayHeight * 0.6,
      {
        label: Enemy.ENEMY_MAIN_COLLIDER,
      }
    )

    const frontSensor = Bodies.rectangle(
      this.sprite.displayWidth / 2 + 10,
      0,
      20,
      40,
      {
        isSensor: true,
        label: Enemy.ENEMY_SENSOR_LABEL,
      }
    )

    const compoundBody = Body.create({
      parts: [mainBody, frontSensor],
      render: {
        sprite: {
          xOffset: 0.5,
          yOffset: 0.5,
        },
      },
    })

    this.sprite
      .setExistingBody(compoundBody as BodyType)
      .setPosition(config.position.x, config.position.y)
      .setFixedRotation()
      .setData('ref', this)

    this.game.updateFunctions.push(() => {
      this.update()
    })
  }

  update() {
    if (this.isTurning) {
      this.sprite.setVelocity(0, 0)
      return
    }
    this.moveShipWithWind()
  }

  handleWallCollision() {
    if (!this.isTurning) {
      const turnAngles = [45, 90, -45, -90]
      const randomTurnAngle =
        this.sprite.angle + Phaser.Utils.Array.GetRandom(turnAngles)
      this.turnShip(randomTurnAngle)
    }
  }

  turnShip(turnAngle: number) {
    this.isTurning = true
    this.game.tweens.add({
      targets: [this.sprite],
      angle: {
        from: this.sprite.angle,
        to: turnAngle,
      },
      duration: 500,
      onComplete: () => {
        this.isTurning = false
      },
    })
  }

  moveShipWithWind() {
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
}
