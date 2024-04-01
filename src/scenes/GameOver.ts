import { Scene } from 'phaser'
import { Constants } from '../utils/Constants'
import { Button } from '../core/Button'

export class GameOver extends Scene {
  private score: number = 0
  constructor() {
    super('gameover')
  }

  init(data: { score: number }) {
    this.score = data.score
  }

  create() {
    const gameOverText = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 3,
        'Game Over!',
        {
          fontSize: '80px',
          fontFamily: 'JackPirate',
        }
      )
      .setOrigin(0.5, 0.5)
    const scoreText = this.add
      .text(
        gameOverText.x,
        gameOverText.y + gameOverText.displayHeight + 5,
        `Your score: ${this.score}`,
        {
          fontSize: '25px',
        }
      )
      .setOrigin(0.5, 0.5)

    new Button({
      scene: this,
      width: 200,
      height: 50,
      text: 'Play Again',
      onClick: () => {
        this.scene.start('game')
        this.scene.start('ui')
        this.sound.stopAll()
      },
      x: scoreText.x,
      y: scoreText.y + scoreText.displayHeight + 50,
      backgroundColor: 0xffffff,
      fontSize: '20px',
      textColor: 'black',
    })
  }
}
