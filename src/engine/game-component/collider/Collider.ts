import { IGameComponent } from '../GameComponent'

export interface CollisionEventArgs {
    self: ICollider
    other: ICollider
}

export default interface ICollider extends IGameComponent {
    // utils
    isCollidingWith(other: ICollider): boolean

    getColliderType(): ColliderType
    getCollidingColliders(): ICollider[]

    addCollidingCollider(collider: ICollider): void
    removeCollidingCollider(colliderId: number): void

    // runtime
    onCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void
    onceCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void
    offCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void
    emitCollision(event: ColliderEvent, args: CollisionEventArgs): void

    // getters and setters
    colliderId: number

    tag: ColliderTag

    velocity: Vector2D
    acceleration: Vector2D

    mass: number

    x: number
    y: number

    width: number
    height: number

    right: number
    left: number
    top: number
    bottom: number

    centerX: number
    centerY: number

    halfWidth: number
    halfHeight: number
}
