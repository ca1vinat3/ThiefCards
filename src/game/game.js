import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        debug: false
      }
    },
    render: {
      context: 'webgl2'
  },
    scene: [BootScene, PlayScene]
  })
}

export default launch
export { launch }
