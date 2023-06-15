import { GameComponent } from '../GameComponent'
import { IGameObject } from '../../game-object/GameObject'

export class SpriteRenderer extends GameComponent {
    public layer: RenderingLayer
    public size: Vector2D
    public baseColor: string

    private image: HTMLImageElement
    private imageLoaded: boolean

    private flipX: boolean
    private flipY: boolean

    // extends gameComponent
    public getType = () => 'SpriteRenderer' as GameComponentType

    constructor(config: SpriteRendererConfig) {
        super()

        this.layer = config.layer
        this.size = config.size ?? { x: 1, y: 1 }
        this.baseColor = config.baseColor ?? 'white'
        this.imageLoaded = false

        this.image = new Image()
        this.image.onload = () => {
            this.imageLoaded = true
            this.render(this.getGameObject())
        }

        this.image.src = config.imageSrc ?? ''

        // binds
        this.render = this.render.bind(this)
        this.drawImage = this.drawImage.bind(this)
        this.drawRectangle = this.drawRectangle.bind(this)
    }

    public getFlipX = (): boolean => this.flipX
    public setFlipX = (flipX: boolean): void => {
        this.flipX = flipX
    }

    public getFlipY = (): boolean => this.flipY
    public setFlipY = (flipY: boolean): void => {
        this.flipY = flipY
    }

    public setImageSource = (imageSrc: string): void => {
        // this.imageLoaded = false
        this.image.src = imageSrc
    }

    public getImageSource = () => {
        // this.imageLoaded = false
        return this.image.src
    }

    public override init(gameObject: IGameObject): void {
        // ignore original init, trying to deprecate it
        // super.init(gameObject)

        // add render event
        this.gameObject = gameObject
        this.gameObject.getGame()?.renderer.on('render', this.layer, () => {
            this.render(this.getGameObject())
        })
    }

    private render(gameObject: IGameObject | undefined) {
        if (!gameObject) {
            console.trace()
            throw new Error('SpriteRenderer.render: gameObject is undefined')
        }

        const context = gameObject.getGame()?.context
        if (!context) {
            console.trace()
            throw new Error('SpriteRenderer.render: context is undefined or')
        }

        if (!this.getActive()) {
            return
        }

        // draw a rectangle if no image is provided
        if (this.image && this.imageLoaded) {
            this.drawImage(gameObject, context)
        } else {
            this.drawRectangle(gameObject, context)
        }
    }

    protected onUpdate = (_delta: number): void => {
        this.render(this.getGameObject())
    }

    private drawImage(gameObject: IGameObject, context: CanvasRenderingContext2D): void {
        const transform = gameObject.getTransform()

        if (!this.image) {
            console.trace()
            throw new Error('SpriteRenderer.drawImage: image is undefined')
        }

        context.save() // save the current canvas state
        context.setTransform(
            this.flipX ? -1 : 1,
            0, // set the direction of x axis
            0,
            this.flipY ? -1 : 1, // set the direction of y axis
            this.flipX ? this.image.width : 0, // set the x origin, TODO: add x
            this.flipY ? this.image.height : 0 // set the y origin TODO: add y
        )

        // flip image
        if (this.flipX) {
            context.scale(-1, 1)
        } else {
            context.scale(1, 1)
        }

        context.drawImage(
            this.image,
            transform.worldPosition.x,
            transform.worldPosition.y,
            this.size.x * transform.localScale.x,
            this.size.y * transform.localScale.y
        )

        context.restore() // restore the state as it was when this function was called
    }

    private drawRectangle(gameObject: IGameObject, context: CanvasRenderingContext2D): void {
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
