import { GameComponent } from '../game-component/GameComponent'
import { GameObject } from '../game-object/GameObject'

export class SpriteRenderer extends GameComponent {
    public size: Vector2D
    public baseColor: string
    public image: HTMLImageElement | null

    // extends gameComponent
    public getType = () => 'SpriteRenderer' as GameComponentType

    constructor(config: SpriteRendererConfig) {
        super()

        this.size = config.size ?? { x: 1, y: 1 }
        this.baseColor = config.baseColor ?? 'white'
        this.image = config.image ?? null

        // binds
        this.render = this.render.bind(this)
        this.drawImage = this.drawImage.bind(this)
        this.drawRectangle = this.drawRectangle.bind(this)
    }

    private render(gameObject: GameObject | undefined) {
        if (!gameObject) {
            console.trace()
            throw new Error('SpriteRenderer.render: gameObject is undefined')
        }

        const context = gameObject.getGame()?.context
        if (!context) {
            console.trace()
            throw new Error('SpriteRenderer.render: context is undefined or')
        }

        // draw a rectangle if no image is provided
        if (!this.image) {
            this.drawRectangle(gameObject, context)
        } else {
            this.drawImage(gameObject, context)
        }
    }

    protected onUpdate = (_delta: number): void => {
        this.render(this.getGameObject())
    }

    private drawImage(gameObject: GameObject, context: CanvasRenderingContext2D): void {
        const transform = gameObject.getTransform()

        if (!this.image) {
            console.trace()
            throw new Error('SpriteRenderer.drawImage: image is undefined')
        }

        // TODO: await implementation of worldScale
        context.drawImage(
            this.image,
            transform.worldPosition.x,
            transform.worldPosition.y,
            this.size.x * transform.localScale.x,
            this.size.y * transform.localScale.y
        )
    }

    private drawRectangle(gameObject: GameObject, context: CanvasRenderingContext2D): void {
        const transform = gameObject.getTransform()

        context.fillStyle = this.baseColor
        context.fillRect(
            transform.worldPosition.x,
            transform.worldPosition.y,
            this.size.x * transform.localScale.x,
            this.size.y * transform.localScale.y
        )
    }
}
