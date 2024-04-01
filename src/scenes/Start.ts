import { Scene } from 'phaser'
import { Constants } from '../utils/Constants'
import { Button } from '../core/Button'

export class Start extends Scene {
  constructor() {
    super('start')
  }

  create() {
    this.sound.play('title-music', { loop: true, volume: 0.4 })
    const titleText = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 2.5,
        'Sailwinds',
        {
          fontSize: '90px',
          fontFamily: 'JackPirate',
        }
      )
      .setOrigin(0.5, 0.5)

    new Button({
      scene: this,
      width: 200,
      height: 50,
      text: 'Play',
      onClick: () => {
        this.scene.start('game')
        this.scene.start('ui')
        this.sound.stopAll()
      },
      x: titleText.x,
      y: titleText.y + titleText.displayHeight + 10,
      backgroundColor: 0xffffff,
      fontSize: '20px',
      textColor: 'black',
    })
  }
}
