import { SpriteRenderer } from '@/engine/sprite-renderer/SpriteRenderer'
import { Collider } from '../engine/collider/Collider'
import { RectangleCollider } from '../engine/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../engine/game-object/GameObject'
import { Game } from '../engine/game/Game'
import lik from '#/doodle-jump/lik-left@2x.png'
import likReverse from '#/doodle-jump/lik-right@2x.png'
import likJump from '#/doodle-jump/lik-left-odskok@2x.png'
import likReverse_Jump from '#/doodle-jump/lik-right-odskok@2x.png'

export class Player extends GameObjectDecorator {
    private control: {
        left: boolean
        right: boolean
    }
    private speed: number
    private gravity: number
    private friction: number
    private collider: Collider
    private spriteRenderer: SpriteRenderer
    private lastMoveDirection: number

    constructor(config: PlayerConfig) {
        const collider = new RectangleCollider({
            tag: 'Player',
            position: {
                x: 0,
                y: 20,
            },
            size: {
                x: 55,
                y: 30,
            },
            // debug: true
        })

        const spriteRenderer = new SpriteRenderer({
            layer: 'foreground',
            size: {
                x: 75,
                y: 75,
            },
            baseColor: 'white',
            imageSrc: lik,
        })

        const gameObject = new GameObject({
            startActive: config.startActive,
            parent: config.parent,
            children: [...(config.children ?? [])],
            components: [spriteRenderer, collider],
        })

        super(gameObject)

        this.speed = config.speed
        this.gravity = config.gravity
        this.friction = config.friction
        this.collider = collider
        this.spriteRenderer = spriteRenderer

        this.control = {
            left: false,
            right: false,
        }
    }

    public override init(game: Game): void {
        super.init(game)

        this.on('update', this.move.bind(this))

        // subscribe velocity control to keydown event
        document.addEventListener('keydown', this.onKeyDown.bind(this))

        // subscribe velocity control to keyup event
        document.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    private move = (delta: number): void => {
        const transform = this.getTransform()
        // move player based on control
        let moveDirection = 0
        if (this.control.left) {
            moveDirection -= 1
        }

        if (this.control.right) {
            moveDirection += 1
        }

        // jump vs fall sprite
        if (this.collider.velocity.y < 0) {
            if (this.lastMoveDirection < 0) {
                this.spriteRenderer.setImageSource(likJump)
            } else {
                this.spriteRenderer.setImageSource(likReverse_Jump)
            }
        } else {
            if (this.lastMoveDirection < 0) {
                this.spriteRenderer.setImageSource(lik)
            } else {
                this.spriteRenderer.setImageSource(likReverse)
            }
        }

        this.lastMoveDirection = moveDirection !== 0 ? moveDirection : this.lastMoveDirection

        // deprecated due to the use of acceleration
        // transform.localPosition.x += (moveDirection * this.speed) / delta

        // with acceleration
        this.collider.acceleration.x = moveDirection * this.speed

        // velocity
        this.collider.velocity.x += this.collider.acceleration.x / delta
        this.collider.velocity.x *= this.friction
        transform.localPosition.x += this.collider.velocity.x

        // with gravity
        this.collider.acceleration.y += this.gravity
        this.collider.velocity.y += this.collider.acceleration.y / delta
        this.collider.velocity.y *= this.friction
        transform.localPosition.y += this.collider.velocity.y
    }

    private onKeyDown(keydown: KeyboardEvent) {
        // arrow left right
        if (keydown.key === 'ArrowLeft') {
            this.control.left = true
        } else if (keydown.key === 'ArrowRight') {
            this.control.right = true
        }

        // a, d
        if (keydown.key === 'a') {
            this.control.left = true
        } else if (keydown.key === 'd') {
            this.control.right = true
        }
    }

    private onKeyUp(keyup: KeyboardEvent) {
        // arrow left right
        if (keyup.key === 'ArrowLeft') {
            this.control.left = false
        } else if (keyup.key === 'ArrowRight') {
            this.control.right = false
        }

        // a, d
        if (keyup.key === 'a') {
            this.control.left = false
        } else if (keyup.key === 'd') {
            this.control.right = false
        }
    }
}
