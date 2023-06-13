import { canvasSize } from '../canvasSize'
import { Player } from '../player/Player'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'

// player collider
// player sprite
const playerSpriteRenderer = new SpriteRenderer({
    size: {
        x: 50,
        y: 50,
    },
    baseColor: 'red',
})

// player
const player = new Player({
    size: {
        x: 50,
        y: 50,
    },
    speed: 110,
    gravity: 10,
    friction: 1,
})

// player's transform
const playerTransform = player.getTransform()

if (!playerTransform) {
    throw new Error('Player must have a transform')
}

playerTransform.localPosition.x = canvasSize.x / 2 - 50 / 2
playerTransform.localPosition.y = canvasSize.y / 2 - 50 / 2

player.addComponent(playerSpriteRenderer)

export { player }
