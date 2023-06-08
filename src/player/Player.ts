import { Collider } from '../collider/Collider'
import { GameObject } from '../game-object/GameObject'

export class Player extends GameObject {
    public control: {
        left: boolean
        right: boolean
    }
    public speed: number
    public gravity: number
    public friction: number

    public collider: Collider

    constructor(config: PlayerConfig) {
        super()

        this.speed = config.speed
        this.gravity = config.gravity
        this.friction = config.friction
        this.collider = config.groundCollider

        // add collider to player
        this.addComponent(this.collider)

        this.control = {
            left: false,
            right: false,
        }
    }

    public override start() {
        super.start()

        // subscribe velocity control to keydown event
        document.addEventListener('keydown', this.onKeyDown.bind(this))

        // subscribe velocity control to keyup event
        document.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    public override update(delta: number): void {
        if (this.transform === undefined) {
            console.error('Player: transform is undefined')
            return
        }

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

        super.update(delta)
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
