import { SpriteRenderer } from '@/engine/game-component/sprite-renderer/SpriteRenderer'
import ICollider from '../engine/game-component/collider/Collider'
import { RectangleCollider } from '../engine/game-component/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../engine/game-object/GameObject'
import { Game } from '../engine/game/Game'
import lik from '#/doodle-jump/lik-left@2x.png'
import likReverse from '#/doodle-jump/lik-right@2x.png'
import likJump from '#/doodle-jump/lik-left-odskok@2x.png'
import likReverse_Jump from '#/doodle-jump/lik-right-odskok@2x.png'
import Rigibody from '@/engine/game-component/rigidbody/Rigidbody'

export class Player extends GameObjectDecorator {
    private control: {
        left: boolean
        right: boolean
    }
    private speed: number
    private rigidbody: Rigibody
    private collider: ICollider
    private spriteRenderer: SpriteRenderer
    private lastMoveDirection: number
    private score: number

    public getScore() {
        return this.score
    }

    constructor(config: PlayerConfig) {
        const rigidbody = new Rigibody({
            mass: config.mass,
            gravity: config.gravity,
            drag: config.drag,
        })

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
            components: [rigidbody, spriteRenderer, collider],
        })

        super(gameObject)

        this.speed = config.speed / 10
        this.collider = collider
        this.spriteRenderer = spriteRenderer
        this.rigidbody = rigidbody
        this.score = 0

        this.control = {
            left: false,
            right: false,
        }
    }

    public override init(game: Game): void {
        super.init(game)

        this.on('update', () => {
            // update score
            this.score = this.getTransform().localPosition.y < this.score ? this.getTransform().localPosition.y : this.score
            this.move()
        })

        // subscribe velocity control to keydown event
        document.addEventListener('keydown', (e) => {this.onKeyDown(e)})

        // subscribe velocity control to keyup event
        document.addEventListener('keyup', (e) => {this.onKeyUp(e)})
    }

    private move(): void {
        // const transform = this.getTransform()
        // move player based on control
        let moveDirection = 0
        if (this.control.left) {
            moveDirection -= 1
        }

        if (this.control.right) {
            moveDirection += 1
        }

        // jump vs fall sprite
        if (this.rigidbody.velocity.y < 0) {
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

        // move player
        this.rigidbody.addForce({ x: moveDirection * this.speed, y: 0 })
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
