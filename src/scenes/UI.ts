import { Scene } from 'phaser'
import { Constants, WindDirection } from '../utils/Constants'

export class UI extends Scene {
  private windArrow!: Phaser.GameObjects.Sprite
  private static _instance: UI
  public isCreated: boolean = false
  public postFxPlugin: any

  constructor() {
    super('ui')
    if (!UI._instance) {
      UI._instance = this
    }
  }

  static get instance() {
    return UI._instance
  }

  create() {
    // Setup tilemap
    this.postFxPlugin = this.plugins.get('rexOutlinePipeline')
    this.windArrow = this.add
      .sprite(Constants.WINDOW_WIDTH, 15, 'arrow')
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
    this.postFxPlugin.add(this.windArrow, {
      thickness: 3,
      outlineColor: 0x444444,
    })
    this.windArrow.setPosition(
      this.windArrow.x - this.windArrow.displayWidth / 2 - 30,
      this.windArrow.displayHeight / 2 + 15
    )
    this.isCreated = true
  }

  updateWindDirection(windDirection: WindDirection) {
    const angle = Constants.getAngleForWindDirection(windDirection)
    if (angle !== this.windArrow.angle) {
      this.tweens.add({
        targets: [this.windArrow],
        angle: {
          from: this.windArrow.angle,
          to: angle,
        },
        duration: 500,
        ease: Phaser.Math.Easing.Sine.InOut,
      })
    }
  }
}
