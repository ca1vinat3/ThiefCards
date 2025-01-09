import { Scene } from 'phaser'
import background from '@/game/assets/background.png'
import thief from '@/game/assets/thief.png'
import platform from '@/game/assets/platform.png'
import circleOne from '@/game/assets/sprite-02.png'
import circleTwo from '@/game/assets/sprite-03.png'
import circleThree from '@/game/assets/sprite-04.png'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('background', background)
    this.load.image('thief', thief)
    this.load.image('platform', platform)
    this.load.audio('thud', [thudMp3, thudOgg])
    this.load.image('circleOne', circleOne)
    this.load.image('circleTwo', circleTwo)
    this.load.image('circleThree', circleThree)
  }

  create () {
    this.scene.start('PlayScene')
  }
}
