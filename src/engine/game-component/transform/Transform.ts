import { GameComponent, GameComponentDecorator } from '../GameComponent'
import { GameObject } from '../../game-object/GameObject'

export class Transform extends GameComponentDecorator {
    // TODO: implement world variants
    public localPosition: Vector2D
    public localRotation: number
    public localScale: Vector2D

    public getType = (): GameComponentType => 'Transform' as GameComponentType

    constructor(config?: Partial<TransformConfig>) {
        const base = new GameComponent()
        super(base)

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
        } as TransformConfig

        if (config) {
            // shallow merge
            Object.assign(inferredConfig, config)
        }

        this.localPosition = inferredConfig.position
        this.localRotation = inferredConfig.rotation
        this.localScale = inferredConfig.scale
    }

    public static toLocalSpace(point: Vector2D, transform: Transform): Vector2D {
        const parentTransform = transform.getGameObject()?.getParent()?.getTransform()

        const { x, y } = point
        const { x: tx, y: ty } = parentTransform
            ? Transform.toLocalSpace(transform.worldPosition, parentTransform)
            : transform.worldPosition
        const { x: sx, y: sy } = transform.localScale

        const localX = (x - tx) / sx
        const localY = (y - ty) / sy

        return {
            x: localX,
            y: localY,
        }
    }

    public static toWorldSpace(point: Vector2D, transform: Transform): Vector2D {
        const parentTransform = transform.getGameObject()?.getParent()?.getTransform()

        const { x, y } = point
        const { x: tx, y: ty } = parentTransform
            ? Transform.toWorldSpace(transform.localPosition, parentTransform)
            : transform.localPosition
        const { x: sx, y: sy } = transform.localScale

        const worldX = x * sx + tx
        const worldY = y * sy + ty

        return {
            x: worldX,
            y: worldY,
        }
    }

    // getters and setters for worldPosition
    public get worldPosition(): Vector2D {
        const parentTransform = this.getGameObject()?.getParent()?.getTransform()
        return parentTransform ? Transform.toWorldSpace(this.localPosition, parentTransform) : this.localPosition
    }

    public set worldPosition(value: Vector2D) {
        this.localPosition = Transform.toLocalSpace(value, this)
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

    public init(gameObject: GameObject): void {
        super.init(gameObject)
    }
}
