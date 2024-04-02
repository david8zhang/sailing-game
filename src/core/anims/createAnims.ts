export const createAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'explosion-anim',
    frames: anims.generateFrameNames('explosion-anim', {
      start: 0,
      end: 7,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 14,
  })

  anims.create({
    key: 'cannon-smoke',
    frames: anims.generateFrameNames('cannon-smoke', {
      start: 1,
      end: 8,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 14,
  })
}
