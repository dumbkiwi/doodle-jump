import { GameComponent } from '../game-component/GameComponent'
import { GameObject } from '../game-object/GameObject'

export class Transform extends GameComponent {
    // TODO: implement world variants
    public localPosition: Vector2D
    public localSize: Vector2D
    public localRotation: number
    public localScale: Vector2D
    public anchor: Vector2D

    private _gameObject: GameObject | undefined
    private _startFn: (() => void) | undefined
    private _updateFn: ((delta: number) => void) | undefined
    private _destroyFn: (() => void) | undefined

    public get type(): GameComponentType {
        return 'Transform' as GameComponentType
    }

    constructor(config?: TransformConfig) {
        super()

        // set defaults then override with config
        const inferredConfig = {
            position: {
                x: 0,
                y: 0,
            },
            size: {
                x: 0,
                y: 0,
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1,
            },
            anchor: {
                x: 0,
                y: 0,
            },
            init: undefined,
            start: undefined,
            update: undefined,
            destroy: undefined,
            ...config, // override defaults with config
        }

        this.localPosition = inferredConfig.position
        this.localSize = inferredConfig.size
        this.localRotation = inferredConfig.rotation
        this.localScale = inferredConfig.scale
        this.anchor = inferredConfig.anchor

        this._startFn = inferredConfig.start
        this._updateFn = inferredConfig.update
        this._destroyFn = inferredConfig.destroy
    }

    public static toLocalSpace(point: Vector2D, transform: Transform): Vector2D {
        const { x, y } = point
        const { x: tx, y: ty } = transform.localPosition
        const { x: sx, y: sy } = transform.localScale
        const { x: ax, y: ay } = transform.anchor

        const localX = (x - tx) / sx - ax
        const localY = (y - ty) / sy - ay

        return {
            x: localX,
            y: localY,
        }
    }

    public static toWorldSpace(point: Vector2D, transform: Transform): Vector2D {
        const { x, y } = point
        const { x: tx, y: ty } = transform.localPosition
        const { x: sx, y: sy } = transform.localScale
        const { x: ax, y: ay } = transform.anchor

        const worldX = (x + ax) * sx + tx
        const worldY = (y + ay) * sy + ty

        return {
            x: worldX,
            y: worldY,
        }
    }

    // getters and setters for gameObject
    public get gameObject(): GameObject | undefined {
        return this._gameObject
    }

    public set gameObject(value: GameObject | undefined) {
        this._gameObject = value
    }

    // getters and setters for worldPosition
    public get worldPosition(): Vector2D {
        return this.getWorldPosition(this.localPosition)
    }

    // getters and setters for width and height
    public get width(): number {
        return this.localSize.x
    }
    public set width(value: number) {
        this.localSize.x = value
    }
    public get height(): number {
        return this.localSize.y
    }
    public set height(value: number) {
        this.localSize.y = value
    }

    // getters and setters for scaleX and scaleY
    public get scaleX(): number {
        return this.localScale.x
    }
    public set scaleX(value: number) {
        this.localScale.x = value
    }
    public get scaleY(): number {
        return this.localScale.y
    }
    public set scaleY(value: number) {
        this.localScale.y = value
    }

    // getters and setters for anchorX and anchorY
    public get anchorX(): number {
        return this.anchor.x
    }
    public set anchorX(value: number) {
        this.anchor.x = value
    }
    public get anchorY(): number {
        return this.anchor.y
    }
    public set anchorY(value: number) {
        this.anchor.y = value
    }

    public init(gameObject: GameObject): void {
        this.gameObject = gameObject
    }

    public start(): void {
        if (this._startFn !== undefined) {
            this._startFn()
        }
    }

    public update(_delta: number): void {
        if (this._updateFn !== undefined) {
            this._updateFn(_delta)
        }
    }

    public destroy(): void {
        if (this._destroyFn !== undefined) {
            this._destroyFn()
        }
    }

    public toLocalSpace(pointInWorldSpace: Vector2D): Vector2D {
        return Transform.toLocalSpace(pointInWorldSpace, this)
    }

    public toWorldSpace(pointInLocalSpace: Vector2D): Vector2D {
        return Transform.toWorldSpace(pointInLocalSpace, this)
    }

    private getWorldPosition(position: Vector2D): Vector2D {
        // if game object is undefined, return position
        if (this.gameObject?.parent === undefined) {
            return this.localPosition
        }

        const parentTransform = this.gameObject.parent.transform

        if (parentTransform === undefined) {
            console.warn('Tried to get world position of game object with undefined transform')
            return this.localPosition
        }

        // get world position by calling parent's getWorldPosition and convert to world space
        const worldPosition = parentTransform.getWorldPosition(position)

        return Transform.toWorldSpace(worldPosition, this)
    }
}
