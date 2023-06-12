import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { Game } from '../game/Game'

export class Player extends GameObject {
    private control: {
        left: boolean
        right: boolean
    }
    private speed: number
    private gravity: number
    private friction: number
    private collider: Collider

    constructor(config: PlayerConfig) {
        const collider = new RectangleCollider({
            tag: 'Player',
            position: {
                x: 0,
                y: 0,
            },
            size: { x: config.size.x, y: config.size.y },
        })
        const playerChildren = [collider]
        super({
            startActive: config.startActive,
            parent: config.parent,
            children: [config.children ? [...config.children, ...playerChildren] : playerChildren],
        })

        this.speed = config.speed
        this.gravity = config.gravity
        this.friction = config.friction
        this.collider = collider

        this.control = {
            left: false,
            right: false,
        }
    }

    public override init(game: Game): void {
        super.init(game)

        // subscribe velocity control to keydown event
        document.addEventListener('keydown', this.onKeyDown.bind(this))

        // subscribe velocity control to keyup event
        document.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    protected override onUpdate = (delta: number): void => {
        // move player based on control
        let moveDirection = 0
        if (this.control.left) {
            moveDirection -= 1
        }
        if (this.control.right) {
            moveDirection += 1
        }

        this.transform.localPosition.x += (moveDirection * this.speed) / delta

        // with gravity
        this.collider.velocity.y += this.gravity / delta
        this.collider.velocity.y /= this.friction
        this.transform.localPosition.y += this.collider.velocity.y
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
