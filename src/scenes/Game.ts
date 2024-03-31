import Phaser from 'phaser'
import { Constants, WindDirection } from '../utils/Constants'
import { UI } from './UI'
import { Map } from '../core/map/Map'
import { Player } from '../core/Player'
import { Event, EventBus, EventTypes } from '../core/EventBus'
import { Enemy } from '../core/Enemy'
import { BodyType } from 'matter'

export default class Game extends Phaser.Scene {
  public updateFunctions: (() => void)[] = []
  public windDirection: WindDirection = WindDirection.EAST
  public windUpdateEvent!: Phaser.Time.TimerEvent
  public spawnEnemyEvent!: Phaser.Time.TimerEvent
  public map!: Map
  public player!: Player
  public enemies: Enemy[] = []

  private static NUM_ENEMIES = 5
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
    }
  }

  static get instance() {
    return Game._instance
  }

  create() {
    this.cameras.main.setBackgroundColor('#b0e9fc')
    this.cameras.main.setBounds(
      0,
      0,
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT
    )

    this.matter.world.setBounds(
      0,
      0,
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT
    )

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
        const directions = Object.values(WindDirection)
        const randomDirection = Phaser.Utils.Array.GetRandom(directions)
        this.windDirection = randomDirection
        if (UI.instance) {
          UI.instance.updateWindDirection(this.windDirection)
        }
      },
    })

    this.spawnEnemy()

    this.cameras.main.startFollow(this.player.sprite)
    this.matter.world.on(
      'collisionstart',
      (
        _: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: BodyType,
        bodyB: BodyType
      ) => {
        if (
          bodyA.label === Enemy.ENEMY_SENSOR_LABEL ||
          bodyB.label === Enemy.ENEMY_SENSOR_LABEL ||
          bodyA.label === Enemy.ENEMY_MAIN_COLLIDER ||
          bodyB.label === Enemy.ENEMY_MAIN_COLLIDER
        ) {
          let enemyBody
          if (
            bodyA.label === Enemy.ENEMY_SENSOR_LABEL ||
            bodyA.label === Enemy.ENEMY_MAIN_COLLIDER
          ) {
            enemyBody = bodyA
          } else {
            enemyBody = bodyB
          }
          const enemySprite =
            enemyBody.gameObject as Phaser.Physics.Matter.Sprite
          if (enemySprite) {
            const enemyRef = enemySprite.getData('ref') as Enemy
            enemyRef.handleWallCollision()
          }
        }
      }
    )

    // this.spawnEnemyEvent = this.time.addEvent({
    //   repeat: -1,
    //   delay: 10000,
    //   startAt: 10000,
    //   callback: () => {
    //     this.spawnEnemy()
    //   },
    // })
  }

  spawnEnemy() {
    for (let i = 0; i < Game.NUM_ENEMIES; i++) {
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
  }
}
