import Phaser from 'phaser'
import { Player } from '../core/player'
import { Constants, WindDirection } from '../utils/Constants'
import { UI } from './UI'

export default class Game extends Phaser.Scene {
  public updateFunctions: (() => void)[] = []
  public windDirection: WindDirection = WindDirection.EAST
  public windUpdateEvent!: Phaser.Time.TimerEvent
  public tilemap!: Phaser.Tilemaps.Tilemap

  private static _instance: Game

  constructor() {
    super('game')
    if (!Game._instance) {
      Game._instance = this
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
    this.tilemap = this.make.tilemap({
      key: 'default-map',
    })
    const tileset = this.tilemap.addTilesetImage(
      'tiles_sheet',
      'tiles_sheet',
      64,
      64,
      1,
      2
    )!
    this.createLayer('Ocean', tileset)
    this.createLayer('Shore', tileset)
    const landLayer = this.createLayer('Land', tileset)
    landLayer.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(landLayer)

    const player = new Player(this, {
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
        if (UI.instance && UI.instance.isCreated) {
          UI.instance.updateWindDirection(this.windDirection)
        }
      },
    })
  }

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tilemap.createLayer(layerName, tileset)!
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }

  update() {
    this.updateFunctions.forEach((fn) => {
      fn()
    })
  }
}
