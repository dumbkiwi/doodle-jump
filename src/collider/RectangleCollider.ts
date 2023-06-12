import { EventManager } from '../event/Event'
import { GameObject } from '../game-object/GameObject'
import { Collider } from './Collider'

export class RectangleCollider extends Collider {
    public getColliderType = () => 'RectangleCollider' as ColliderType

    public get x(): number {
        return this._worldPosition.x
    }
    public set x(value: number) {
        this._worldPosition.x = value
    }

    public get y(): number {
        return this._worldPosition.y
    }

    public set y(value: number) {
        this._worldPosition.y = value
    }

    public get width(): number {
        return this._size.x
    }

    public set width(value: number) {
        this._size.x = value
    }

    public get height(): number {
        return this._size.y
    }

    public set height(value: number) {
        this._size.y = value
    }

    public get right(): number {
        return this._worldPosition.x + this._size.x
    }

    public set right(value: number) {
        this._worldPosition.x = value - this._size.x
    }

    public get left(): number {
        return this._worldPosition.x
    }

    public set left(value: number) {
        this._worldPosition.x = value
    }

    public get top(): number {
        return this._worldPosition.y
    }

    public set top(value: number) {
        this._worldPosition.y = value
    }

    public get bottom(): number {
        return this._worldPosition.y + this._size.y
    }

    public set bottom(value: number) {
        this._worldPosition.y = value - this._size.y
    }

    public get centerX(): number {
        return this._worldPosition.x + this._size.x / 2
    }

    public set centerX(value: number) {
        this._worldPosition.x = value - this._size.x / 2
    }

    public get centerY(): number {
        return this._worldPosition.y + this._size.y / 2
    }

    public set centerY(value: number) {
        this._worldPosition.y = value - this._size.y / 2
    }

    public get halfWidth(): number {
        return this._size.x / 2
    }

    public set halfWidth(value: number) {
        this._size.x = value * 2
    }

    public get halfHeight(): number {
        return this._size.y / 2
    }

    public set halfHeight(value: number) {
        this._size.y = value * 2
    }

    // collider
    private _localPosition: Vector2D
    private _worldPosition: Vector2D
    private _size: Vector2D
    private _eventManager: EventManager<ColliderEvent, Collider>
    private _velocity: Vector2D
    private _tag: ColliderTag = 'Default'

    private _collidingWith: Collider[] = []

    // getters and setters
    public get collidingColliders(): Collider[] {
        return this._collidingWith
    }

    public get velocity(): Vector2D {
        return this._velocity
    }

    public set velocity(value: Vector2D) {
        this._velocity = value
    }

    public get tag(): ColliderTag {
        return this._tag
    }

    public set tag(value: ColliderTag) {
        this._tag = value
    }

    constructor(config: RectangleColliderConfig) {
        super()

        this._velocity = { x: 0, y: 0 }

        this._localPosition = config.position
        this._worldPosition = { x: 0, y: 0 }
        this._size = config.size
        this._tag = config.tag

        this._eventManager = new EventManager<ColliderEvent, Collider>()

        if (config.onCollisionEnter) {
            this._callbacks["collisionEnter"].push(config.onCollisionEnter)
        }
        
        if (config.onCollisionExit) {
            this._callbacks["collisionExit"].push(config.onCollisionExit)
        }

        if (config.onCollisionStay) {
            this._callbacks["collisionStay"].push(config.onCollisionStay)
        }

        // binds so that the methods can access this._callbacks
        this.onCollisionEnter = this.onCollisionEnter.bind(this)
        this.onCollisionExit = this.onCollisionExit.bind(this)
        this.onCollisionStay = this.onCollisionStay.bind(this)
    }

    public collide(other: Collider): boolean {
        if (other instanceof RectangleCollider) {
            return this.collideRectangle(other)
        } else {
            return false
        }
    }

    public isPointInCollider(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    public on(event: ColliderEvent, callback: (collider: Collider) => void): void {
        // adds to list of callbacks
        this._callbacks[event].push(callback)
    }

    public off(event: ColliderEvent, callback: (collider: Collider) => void): void {
        // removes from list of callbacks
        this._callbacks[event] = this._callbacks[event].filter((cb) => cb !== callback)
    }

    protected onCollisionEnter(other: Collider): void {
        this._callbacks.collisionEnter.forEach((callback) => {
            callback(other)
        })
    }

    protected onCollisionExit(other: Collider): void {
        this._callbacks.collisionExit.forEach((callback) => {
            callback(other)
        })
    }

    protected onCollisionStay(other: Collider): void {
        this._callbacks.collisionStay.forEach((callback) => {
            callback(other)
        })
    }

    private collideRectangle(other: RectangleCollider): boolean {
        return (
            this.left < other.right &&
            this.right > other.left &&
            this.top < other.bottom &&
            this.bottom > other.top
        )
    }

    public override init(gameObject: GameObject): void {
        super.init(gameObject)

        // set world position
        const transform = gameObject.getTranform()
        const worldPosition = transform.toWorldSpace(this._localPosition)
        this._worldPosition = worldPosition

        this._eventManager.on('collisionEnter', this.onCollisionEnter)
        this._eventManager.on('collisionExit', this.onCollisionExit)
        this._eventManager.on('collisionStay', this.onCollisionStay)
    }

    protected onUpdate = (_delta: number): void => {
        // if there is a gameobject call getColliders on gameobject to get all active colliders in game object
        if (!this.gameObject) {
            throw new Error('Collider does not have a game object')
        }

        // if collider is not active, do not check for collisions
        if (!this.isActive) {
            return
        }

        const game = this.gameObject.getGame()

        if (game === undefined) {
            throw new Error('Collider does not have a game')
        }

        // update current position
        // TODO: this should be done in the Rigidbody component
        const transform = this.gameObject.getTranform()
        // debugger
        this._worldPosition = transform.toWorldSpace(this._localPosition)

        // get all colliders
        const colliders = Collider.getAllColliders(game)
        for (const collider of colliders) {
            // ignore self
            if (collider === this) {
                continue
            }

            const isColliding = this.collide(collider)
            // check if colliders collide
            if (isColliding) {
                // if they collide, check if they are already colliding
                if (!this._collidingWith.includes(collider)) {
                    // if they are not colliding, add them to collidingWith
                    this._collidingWith.push(collider)
                    this._eventManager.emit('collisionEnter', collider)
                } else {
                    // if they are colliding, emit collisionStay
                    this._eventManager.emit('collisionStay', collider)
                }
            }

            // if they are not colliding, check if they were colliding
            // if they were colliding, remove them from collidingWith
            if (!isColliding && this._collidingWith.includes(collider)) {
                this._collidingWith.splice(this._collidingWith.indexOf(collider), 1)
                this._eventManager.emit('collisionExit', collider)
            }
        }
    }

    public destroy(): void {
        this._eventManager.off('collisionEnter', this.onCollisionEnter)
        this._eventManager.off('collisionExit', this.onCollisionExit)
        this._eventManager.off('collisionStay', this.onCollisionStay)
    }
}
