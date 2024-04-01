import { BodyType } from 'matter'
import Game from '../scenes/Game'
import { ColliderLabels, Constants } from '../utils/Constants'

export interface EnemyConfig {
  position: {
    x: number
    y: number
  }
}

export class Enemy {
  private static MAX_HEALTH = 3
  private static CPU_SPEED_MULTIPLIER = 0.75

  private game: Game
  public sprite: Phaser.Physics.Matter.Sprite
  private health: number = Enemy.MAX_HEALTH
  private isTurning: boolean = false
  private isAggro: boolean = false
  public isDead: boolean = false
  private lastFiredTimestamp = 0

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
        label: ColliderLabels.ENEMY_MAIN_COLLIDER,
      }
    )

    const frontSensor = Bodies.rectangle(
      this.sprite.displayWidth / 2 + 10,
      0,
      20,
      40,
      {
        isSensor: true,
        label: ColliderLabels.ENEMY_SENSOR_LABEL,
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

  getPathTowardsPlayer() {
    const path = this.game.map.getShortestPathBetweenTwoPoints(
      this.sprite.x,
      this.sprite.y,
      this.game.player.sprite.x,
      this.game.player.sprite.y
    )
    // path.forEach((node) => {
    //   const { row, col } = node.position
    //   const worldXY = this.game.map.getWorldPositionForRowCol(row, col)
    //   this.game.add.circle(worldXY.x, worldXY.y, 5, 0xff0000)
    // })
    return path
  }

  update() {
    if (this.isDead || !this.sprite.active) {
      return
    }
    if (this.isTurning) {
      this.sprite.setVelocity(0, 0)
      return
    }
    if (this.isAggro) {
      const path = this.getPathTowardsPlayer()
      const nextNodeInPath = path[0]
      if (nextNodeInPath) {
        const nextNodeWorldXY = this.game.map.getWorldPositionForRowCol(
          nextNodeInPath.position.row,
          nextNodeInPath.position.col
        )
        const angle = Math.round(
          Phaser.Math.RadToDeg(
            Phaser.Math.Angle.Between(
              this.sprite.x,
              this.sprite.y,
              nextNodeWorldXY.x,
              nextNodeWorldXY.y
            )
          )
        )
        const angleDiff = Math.abs(angle - this.sprite.angle)
        if (angleDiff >= 30 && !this.isTurning) {
          this.isTurning = true
          this.turnShip(angle)
        }

        // If the angle to the player is within a range of the current course, fire a cannonball
        const angleToPlayer = Math.round(
          Phaser.Math.RadToDeg(
            Phaser.Math.Angle.Between(
              this.sprite.x,
              this.sprite.y,
              this.game.player.sprite.x,
              this.game.player.sprite.y
            )
          )
        )
        const diffToCurrTrajectory = Phaser.Math.Angle.ShortestBetween(
          this.sprite.angle,
          angleToPlayer
        )
        if (diffToCurrTrajectory <= 10) {
          this.fireCannonball()
        }
      }
    }
    this.moveShipWithWind()
  }

  fireCannonball() {
    const currTime = Date.now()
    if (currTime - this.lastFiredTimestamp > 3000) {
      this.game.sound.play('cannon-fire')
      this.lastFiredTimestamp = currTime
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
        label: ColliderLabels.ENEMY_CANNONBALL,
      })
      const currAngle = Phaser.Math.DegToRad(this.sprite.angle)
      const velocityVector = new Phaser.Math.Vector2(
        Math.cos(currAngle) * Constants.ENEMY_CANNONBALL_SPEED_MULTIPLIER,
        Math.sin(currAngle) * Constants.ENEMY_CANNONBALL_SPEED_MULTIPLIER
      )
      cannonball.setVelocity(velocityVector.x, velocityVector.y)
    }
  }

  takeDamage() {
    this.game.sound.play('explosion')
    if (!this.isAggro) {
      this.isAggro = true
    }
    this.health = Math.max(0, this.health - 1)
    if (this.health == 2) {
      this.sprite.setTexture('pirate-halfhealth')
    }
    if (this.health === 1) {
      this.sprite.setTexture('pirate-lowhealth')
    }
    if (this.health == 0) {
      this.handleDeath()
    }
  }

  handleCollision(bodyB: BodyType) {
    if (bodyB.label === ColliderLabels.PLAYER_CANNONBALL) {
      this.game.cameras.main.shake(150, 0.002)
      const cannonballSprite = bodyB.gameObject
      if (cannonballSprite) {
        cannonballSprite.destroy()
      }
      this.takeDamage()
    } else {
      if (!this.isTurning && !this.isAggro) {
        const turnAngles = [45, 90, -45, -90]
        const randomTurnAngle =
          this.sprite.angle + Phaser.Utils.Array.GetRandom(turnAngles)
        this.isTurning = true
        this.turnShip(randomTurnAngle)
      }
    }
  }

  turnShip(turnAngle: number) {
    if (this.sprite.active) {
      this.game.tweens.add({
        targets: [this.sprite],
        angle: {
          from: this.sprite.angle,
          to: turnAngle,
        },
        duration: 500,
        onComplete: () => {
          this.sprite.setAngle(turnAngle)
          this.isTurning = false
          if (this.isDead) {
            this.sprite.destroy()
          }
        },
      })
    }
  }

  handleDeath() {
    this.game.player.updateScore()
    this.sprite.setVelocity(0, 0)
    this.isDead = true
    this.game.tweens.add({
      targets: [this.sprite],
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out,
      onComplete: () => {
        this.sprite.destroy()
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
    speed *= Enemy.CPU_SPEED_MULTIPLIER
    const velocityVector = new Phaser.Math.Vector2(
      Math.cos(Phaser.Math.DegToRad(currAngle)) * speed,
      Math.sin(Phaser.Math.DegToRad(currAngle)) * speed
    )
    this.sprite.setVelocity(velocityVector.x, velocityVector.y)
  }
}
