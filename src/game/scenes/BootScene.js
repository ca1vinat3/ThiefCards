import { Scene } from 'phaser'
import background from '@/game/assets/background.png'
import thief from '@/game/assets/thief.png'
import platform from '@/game/assets/platform.png'
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
  }

  create () {
    this.scene.start('PlayScene')
  }
}
