import { GameComponent } from '../GameComponent'
import { Game } from '../../game/Game'

export abstract class Collider extends GameComponent {
    private static readonly activeColliders: Collider[] = []
    private _type: GameComponentType = 'Collider'
    protected _callbacks: {
        [key in ColliderEvent]: ((other: Collider) => void)[]
    }

    public getType(): GameComponentType {
        return this._type
    }

    constructor() {
        super()
        this._callbacks = {
            collisionEnter: [],
            collisionExit: [],
            collisionStay: [],
        }
    }

    public static getAllColliders(game: Game): Collider[] {
        return Collider.activeColliders.filter(
            (collider) => collider.getGameObject()?.getGame() === game &&
                collider.isActive
        )
    }

    protected static registerCollider(collider: Collider): number {
        return Collider.activeColliders.push(collider) - 1
    }

    protected static unregisterCollider(index: number) {
        Collider.activeColliders.splice(index, 1)
    }

    public abstract getColliderType(): ColliderType

    public abstract get collidingColliders(): Collider[]

    public abstract get colliderId(): number
    public abstract set colliderId(value: number)

    public abstract get tag(): ColliderTag
    public abstract set tag(value: ColliderTag)

    public abstract get velocity(): Vector2D
    public abstract set velocity(value: Vector2D)

    public abstract get acceleration(): Vector2D
    public abstract set acceleration(value: Vector2D)

    public abstract get x(): number
    public abstract set x(value: number)

    public abstract get y(): number
    public abstract set y(value: number)

    public abstract get width(): number
    public abstract set width(value: number)

    public abstract get height(): number
    public abstract set height(value: number)

    public abstract get right(): number
    public abstract set right(value: number)

    public abstract get left(): number
    public abstract set left(value: number)

    public abstract get top(): number
    public abstract set top(value: number)

    public abstract get bottom(): number
    public abstract set bottom(value: number)

    public abstract get centerX(): number
    public abstract set centerX(value: number)

    public abstract get centerY(): number
    public abstract set centerY(value: number)

    public abstract get halfWidth(): number
    public abstract set halfWidth(value: number)

    public abstract set halfHeight(value: number)
    public abstract get halfHeight(): number

    public override setActive(value: boolean): void {
        super.setActive(value)
        if (value) {
            this.colliderId = Collider.registerCollider(this)
        } else {
            Collider.unregisterCollider(this.colliderId)
            this.colliderId = -1
        }
    }

    public abstract collide(other: Collider): boolean
    public abstract isPointInCollider(x: number, y: number): boolean
    public abstract on(event: ColliderEvent, callback: (other: Collider) => void): void
    public abstract off(event: ColliderEvent, callback: (other: Collider) => void): void
    protected abstract onCollisionEnter(other: Collider): void
    protected abstract onCollisionExit(other: Collider): void
    protected abstract onCollisionStay(other: Collider): void
}
