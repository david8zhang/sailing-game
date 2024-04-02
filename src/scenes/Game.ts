import Phaser from 'phaser'
import { ColliderLabels, Constants, WindDirection } from '../utils/Constants'
import { UI } from './UI'
import { Map } from '../core/map/Map'
import { Player } from '../core/Player'
import { Event, EventBus, EventTypes } from '../core/EventBus'
import { Enemy } from '../core/Enemy'
import { BodyType } from 'matter'
import { createAnims } from '../core/anims/createAnims'

export default class Game extends Phaser.Scene {
  public updateFunctions: (() => void)[] = []
  public windDirection: WindDirection = WindDirection.EAST
  public windUpdateEvent!: Phaser.Time.TimerEvent
  public spawnEnemyEvent!: Phaser.Time.TimerEvent
  public map!: Map
  public player!: Player
  public enemies: Enemy[] = []

  private static NUM_ENEMIES = 10
  private static _instance: Game

  constructor() {
    super('game')
    if (!Game._instance) {
      Game._instance = this
    }
    EventBus.instance.subscribe((e: Event) => {
      this.onEvent(e)
    })
  }

  onEvent(event: Event) {
    if (event.type == EventTypes.UI_CREATED) {
      UI.instance.updateWindDirection(this.windDirection)
      UI.instance.updateHealthText(this.player.health)
      UI.instance.updateScoreText(this.player.score)
    }
  }

  static get instance() {
    return Game._instance
  }

  create() {
    createAnims(this.anims)
    this.sound.play('game-music', { loop: true, volume: 0.5 })
    this.cameras.main.setBackgroundColor('#b0e9fc')
    this.cameras.main.setBounds(
      0,
      0,
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT
    )

    const worldBounds = this.matter.world.setBounds(
      0,
      0,
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT
    )
    Object.values(worldBounds.walls).forEach((wall: BodyType) => {
      wall.label = ColliderLabels.MAP_BOUNDS
    })

    this.map = new Map(this, {
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
      cellSize: Constants.CELL_SIZE,
      walkableLayer: 'Ocean',
    })

    this.player = new Player(this, {
      position: {
        x: Constants.GAME_WIDTH / 2,
        y: Constants.GAME_HEIGHT / 2,
      },
    })

    this.windUpdateEvent = this.time.addEvent({
      repeat: -1,
      delay: 10000,
      callback: () => {
        this.sound.play('wind')
        const directions = Object.values(WindDirection)
        const randomDirection = Phaser.Utils.Array.GetRandom(directions)
        this.windDirection = randomDirection
        if (UI.instance) {
          UI.instance.updateWindDirection(this.windDirection)
        }
      },
    })

    this.cameras.main.startFollow(this.player.sprite)
    this.matter.world.on(
      'collisionstart',
      (
        _: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: BodyType,
        bodyB: BodyType
      ) => {
        if (
          bodyA.label === ColliderLabels.ENEMY_SENSOR_LABEL ||
          bodyB.label === ColliderLabels.ENEMY_SENSOR_LABEL ||
          bodyA.label === ColliderLabels.ENEMY_MAIN_COLLIDER ||
          bodyB.label === ColliderLabels.ENEMY_MAIN_COLLIDER
        ) {
          let enemyBody
          let otherBody
          if (
            bodyA.label === ColliderLabels.ENEMY_SENSOR_LABEL ||
            bodyA.label === ColliderLabels.ENEMY_MAIN_COLLIDER
          ) {
            enemyBody = bodyA
            otherBody = bodyB
          } else {
            enemyBody = bodyB
            otherBody = bodyA
          }
          const enemySprite =
            enemyBody.gameObject as Phaser.Physics.Matter.Sprite
          if (enemySprite) {
            const enemyRef = enemySprite.getData('ref') as Enemy
            enemyRef.handleCollision(otherBody)
          }
        }

        if (
          bodyA.label === ColliderLabels.MAP_BOUNDS ||
          bodyB.label === ColliderLabels.MAP_BOUNDS
        ) {
          const otherBody =
            bodyA.label === ColliderLabels.MAP_BOUNDS ? bodyB : bodyA
          this.handleWallCollisions(otherBody)
        }

        if (
          bodyA.label === ColliderLabels.PLAYER_COLLIDER_LABEL ||
          bodyB.label === ColliderLabels.PLAYER_COLLIDER_LABEL
        ) {
          const otherBody =
            bodyA.label === ColliderLabels.PLAYER_COLLIDER_LABEL ? bodyB : bodyA
          this.player.handleCollision(otherBody)
        }
      }
    )
    this.enemies = []
    this.spawnEnemy()
    this.time.addEvent({
      repeat: -1,
      delay: 5000,
      callback: () => {
        this.enemies = this.enemies.filter((e) => !e.isDead)
        this.spawnEnemy()
      },
    })
  }

  handleWallCollisions(body: BodyType) {
    switch (body.label) {
      case ColliderLabels.ENEMY_CANNONBALL:
      case ColliderLabels.PLAYER_CANNONBALL: {
        const cannonballSprite = body.gameObject
        if (cannonballSprite) {
          cannonballSprite.destroy()
        }
        break
      }
    }
  }

  spawnEnemy() {
    const numEnemiesToSpawn = Game.NUM_ENEMIES - this.enemies.length
    for (let i = 0; i < numEnemiesToSpawn; i++) {
      const randomTile: Phaser.Tilemaps.Tile = Phaser.Utils.Array.GetRandom(
        this.map.walkableTiles
      )
      const newEnemy = new Enemy(this, {
        position: {
          x: randomTile.getCenterX(),
          y: randomTile.getCenterY(),
        },
      })
      this.enemies.push(newEnemy)
    }
  }

  update() {
    this.updateFunctions.forEach((fn) => {
      fn()
    })
    this.children.each((obj) => {
      if (obj.type === 'cannonball') {
        const cannonballSprite = obj as Phaser.Physics.Matter.Sprite
        if (
          !this.cameras.main.worldView.contains(
            cannonballSprite.x,
            cannonballSprite.y
          )
        ) {
          cannonballSprite.destroy()
        }
      }
    })
  }

  handleGameOver() {
    this.scene.start('gameover', { score: this.player.score })
    this.scene.stop('game')
    this.scene.stop('ui')
  }
}
