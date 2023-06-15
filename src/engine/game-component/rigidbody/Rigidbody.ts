import { GameObject } from '@/engine/game-object/GameObject'
import { GameComponent, GameComponentDecorator } from '../GameComponent'
import { Transform } from '../transform/Transform'

export default class Rigibody extends GameComponentDecorator {
    public velocity: Vector2D
    public acceleration: Vector2D
    public mass: number
    public gravity: number
    public drag: number

    private transform: Transform | undefined

    public override getType = () => 'Rigidbody' as GameComponentType

    constructor(config?: { mass?: number; gravity?: number; drag?: number }) {
        const base = new GameComponent()
        super(base)

        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0 }
        this.mass = config?.mass ?? 1
        this.gravity = config?.gravity ?? 0
        this.drag = config?.drag ?? 0
    }

    public init(gameObject: GameObject) {
        super.init(gameObject)

        this.transform = gameObject.getTransform()

        gameObject.on('update', () => {
            this.update()
        })
    }

    public update() {
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y + this.gravity

        // mult drag
        this.velocity.x *= 1 - this.drag

        if (this.transform) {
            this.transform.localPosition.x += this.velocity.x
            this.transform.localPosition.y += this.velocity.y
        }
    }

    public addForce(force: Vector2D) {
        this.velocity.x += force.x / this.mass
        this.velocity.y += force.y / this.mass
    }
}
