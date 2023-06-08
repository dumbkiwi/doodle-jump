import { GameComponent } from '../game-component/GameComponent'
import { GameObject } from '../game-object/GameObject'

export class SpriteRenderer extends GameComponent {
    public size: Vector2D
    public baseColor: string
    public image: HTMLImageElement | null

    // extends gameComponent
    private _type: GameComponentType = 'SpriteRenderer'
    private _gameObject: GameObject | undefined = undefined

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

    // extends gameComponent
    public get type(): GameComponentType {
        return this._type
    }

    // extends gameComponent
    public get gameObject(): GameObject | undefined {
        return this._gameObject
    }

    // extends gameComponent
    public set gameObject(value: GameObject | undefined) {
        this._gameObject = value
    }

    public render(context: CanvasRenderingContext2D) {
        // draw a rectangle if no image is provided
        if (!this.image) {
            this.drawRectangle(context)
        } else {
            this.drawImage(context)
        }
    }

    public override destroy(): void {
        // do nothing
    }

    public override init(gameObject: GameObject): void {
        this._gameObject = gameObject
    }

    public override start(): void {
        // do nothing
    }

    public override update(_delta: number): void {
        if (!this._gameObject) {
            console.error('SpriteRenderer.update: gameObject is undefined')
            return
        }

        this.render(this._gameObject.game?.context as CanvasRenderingContext2D)
    }

    private drawImage(context: CanvasRenderingContext2D): void {
        // TODO: refactor conditionals
        if (!this._gameObject) {
            console.error('SpriteRenderer.render: gameObject is undefined')
            return
        }

        if (!this._gameObject.transform) {
            console.error('SpriteRenderer.render: gameObject.transform is undefined')
            return
        }

        if (!this.image) {
            console.error('SpriteRenderer.drawImage: image is undefined')
            return
        }

        // TODO: await implementation of worldScale
        context.drawImage(
            this.image,
            this._gameObject.transform.worldPosition.x,
            this._gameObject.transform.worldPosition.y,
            this.size.x * this._gameObject.transform.localScale.x,
            this.size.y * this._gameObject.transform.localScale.y
        )
    }

    private drawRectangle(context: CanvasRenderingContext2D): void {
        if (!this._gameObject) {
            console.error('SpriteRenderer.render: gameObject is undefined')
            return
        }

        if (!this._gameObject.transform) {
            console.error('SpriteRenderer.render: gameObject.transform is undefined')
            return
        }

        context.fillStyle = this.baseColor
        context.fillRect(
            this._gameObject.transform.worldPosition.x,
            this._gameObject.transform.worldPosition.y,
            this.size.x * this._gameObject.transform.localScale.x,
            this.size.y * this._gameObject.transform.localScale.y
        )
    }
}
