import { canvasSize } from '../canvasSize'
import { Player } from '../player/Player'

// player
const player = new Player({
    size: {
        x: 50,
        y: 80, // being ovewritten in debug
    },
    mass: 1,
    speed: 15,
    gravity: 0.2,
    drag: 0.25,
})

// player's transform
const playerTransform = player.getTransform()

if (!playerTransform) {
    throw new Error('Player must have a transform')
}

playerTransform.localPosition.x = canvasSize.x / 2 - 50 / 2
playerTransform.localPosition.y = canvasSize.y / 2 - 50 / 2

export { player }
