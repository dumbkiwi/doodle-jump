import { SpriteRenderer } from '@/engine/game-component/sprite-renderer/SpriteRenderer'
import { EventManager } from '../../event/Event'
import { GameObject } from '../../game-object/GameObject'
import ICollider, { CollisionEventArgs } from './Collider'
import { Transform } from '@/engine/game-component/transform/Transform'
import { GameComponent, GameComponentDecorator } from '../GameComponent'

export class RectangleCollider extends GameComponentDecorator implements ICollider {
    private eventManager: EventManager<ColliderEvent, CollisionEventArgs>

    public colliderId = -1
    public mass = 1
    public tag: ColliderTag = 'Default'
    public velocity: Vector2D
    public acceleration: Vector2D

    public get x() {
        return this.transform
            ? Transform.toWorldSpace(this.offsetFromTransform, this.transform).x
            : this.offsetFromTransform.x
    }

    public set x(value: number) {
        this.offsetFromTransform.x = this.transform
            ? Transform.toLocalSpace({ x: value, y: this.offsetFromTransform.y }, this.transform).x
            : value
    }

    public get y() {
        return this.transform
            ? Transform.toWorldSpace(this.offsetFromTransform, this.transform).y
            : this.offsetFromTransform.y
    }

    public set y(value: number) {
        this.offsetFromTransform.y = this.transform
            ? Transform.toLocalSpace({ x: this.offsetFromTransform.x, y: value }, this.transform).y
            : value
    }

    public get width(): number {
        return this.size.x
    }

    public set width(value: number) {
        this.size.x = value
    }

    public get height(): number {
        return this.size.y
    }

    public set height(value: number) {
        this.size.y = value
    }

    public get right(): number {
        return this.x + this.size.x
    }

    public set right(value: number) {
        this.x = value - this.size.x
    }

    public get left(): number {
        return this.x
    }

    public set left(value: number) {
        this.x = value
    }

    public get top(): number {
        return this.y
    }

    public set top(value: number) {
        this.y = value
    }

    public get bottom(): number {
        return this.y + this.size.y
    }

    public set bottom(value: number) {
        this.y = value - this.size.y
    }

    public get centerX(): number {
        return this.x + this.size.x / 2
    }

    public set centerX(value: number) {
        this.x = value - this.size.x / 2
    }

    public get centerY(): number {
        return this.y + this.size.y / 2
    }

    public set centerY(value: number) {
        this.y = value - this.size.y / 2
    }

    public get halfWidth(): number {
        return this.size.x / 2
    }

    public set halfWidth(value: number) {
        this.size.x = value * 2
    }

    public get halfHeight(): number {
        return this.size.y / 2
    }

    public set halfHeight(value: number) {
        this.size.y = value * 2
    }

    // utils
    public isCollidingWith(other: ICollider): boolean {
        if (other instanceof RectangleCollider) {
            return this.collideRectangle(other)
        } else {
            return false
        }
    }

    public getType = () => 'Collider' as GameComponentType
    public getColliderType = () => 'RectangleCollider' as ColliderType
    public getCollidingColliders(): ICollider[] {
        return this.collidingWith
    }
    public addCollidingCollider(collider: ICollider): void {
        this.collidingWith.push(collider)
    }

    public removeCollidingCollider(colliderId: number): void {
        // remove collider with id
        this.collidingWith = this.collidingWith.filter(
            (collider) => collider.colliderId !== colliderId
        )
    }

    // runtime
    public onCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void {
        this.eventManager.on(event, callback)
    }

    public onceCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void {
        this.eventManager.once(event, callback)
    }

    public offCollision(event: ColliderEvent, callback: (args: CollisionEventArgs) => void): void {
        this.eventManager.off(event, callback)
    }

    public emitCollision(event: ColliderEvent, args: CollisionEventArgs): void {
        this.eventManager.emit(event, args)
    }

    // collider
    private transform: Transform | undefined
    private offsetFromTransform: Vector2D
    private size: Vector2D

    // debug
    private debug: boolean
    private debugGameObject: GameObject
    private debugRenderer: SpriteRenderer

    private collidingWith: ICollider[] = []

    constructor(config: RectangleColliderConfig) {
        const gameComponent = new GameComponent()

        super(gameComponent)

        this.eventManager = new EventManager<ColliderEvent, CollisionEventArgs>()
        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0 }

        this.offsetFromTransform = config.position
        this.size = config.size
        this.tag = config.tag
        this.debug = config.debug ?? false
        this.transform = undefined

        // debug
        this.debugRenderer = new SpriteRenderer({
            layer: 'ui',
            size: this.size,
            baseColor: 'red',
        })

        this.debugGameObject = new GameObject({
            components: [
                new Transform({
                    position: this.offsetFromTransform,
                }),
                this.debugRenderer,
            ],
        })
    }

    public isPointInCollider(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    private collideRectangle(other: RectangleCollider): boolean {
        return (
            this.left < other.right &&
            this.right > other.left &&
            this.top < other.bottom &&
            this.bottom > other.top
        )
    }

    public init(gameObject: GameObject): void {
        super.init(gameObject)
        if (this.debug) {
            this.setDebug(true)
        }

        // register this if it is active
        if (this.getActive()) {
            this.colliderId = gameObject.getGame()?.physics.registerCollider(this) ?? -1
        }

        this.transform = gameObject.getTransform()
    }

    public setActive(value: boolean): void {
        super.setActive(value)
        if (value === true && this.colliderId === -1) {
            this.colliderId = this.getGameObject()?.getGame()?.physics.registerCollider(this) ?? -1
        } else if (value === false) {
            if (this.colliderId === -1) {
                throw new Error('Collider id is -1')
            }

            this.getGameObject()?.getGame()?.physics.unregisterCollider(this.colliderId)
            this.colliderId = -1
        }
    }

    // for debugging
    public setDebug(debug: boolean): void {
        this.debug = debug
        const gameObject = this.getGameObject()

        if (!gameObject) {
            return
        }

        // add sprite renderer to the game object
        if (debug) {
            gameObject.addChildren(this.debugGameObject)
            this.debugRenderer.init(gameObject)
            this.debugRenderer.setActive(true)
        } else {
            this.debugRenderer.setActive(false)
            gameObject.removeChildren(this.debugGameObject)
        }
    }
}
