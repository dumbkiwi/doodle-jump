import { RectangleCollider } from '../collider/RectangleCollider'
import { canvasSize } from '../canvasSize'
import { Player } from '../player/Player'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'
import { Transform } from '../transform/Transform'

// player collider
const playerCollider = new RectangleCollider({
    tag: 'Player',
    x: 0,
    y: 0,
    width: 50,
    height: 50,
})

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
        x: 1,
        y: 1,
    },
    speed: 80,
    gravity: 2,
    friction: 1,
    groundCollider: playerCollider,
})

// player's transform
const playerTransform = player.getComponent('Transform') as Transform

if (!playerTransform) {
    throw new Error('Player must have a transform')
}

playerTransform.localPosition.x = canvasSize.x / 2 - playerCollider.width / 2
playerTransform.localPosition.y = canvasSize.y / 2 - playerCollider.height / 2

player.addComponent(playerSpriteRenderer)

export { player }
