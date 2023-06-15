import { GameComponent } from '../GameComponent'

export class Label extends GameComponent {
    public config: LabelConfig

    // extends gameComponent
    public getType = () => 'Label' as GameComponentType

    constructor(config: LabelConfig) {
        super()

        this.config = {
            text: 'Sample Text',
            color: 'black',
            size: '12px',
            fontFamily: 'Arial',
            ...config,
        }
    }

    public render(context: CanvasRenderingContext2D) {
        const gameObject = this.getGameObject()
        if (!gameObject) {
            console.trace()
            throw new Error('Label.render: gameObject is undefined')
        }

        if (!gameObject) {
            console.trace()
            throw new Error('Label.render: gameObject is undefined')
        }

        const transform = gameObject.getTransform()
        context.fillStyle = this.config.color ?? 'black'
        context.font = `${this.config.size ?? '12px'} ${this.config.fontFamily ?? 'Arial'}`
        context.fillText(
            this.config.text ?? 'Sample Text',
            transform.worldPosition.x,
            transform.worldPosition.y
        )
    }

    protected onUpdate = (_delta: number) => {
        this.render(this.getGameObject()?.getGame()?.context as CanvasRenderingContext2D)
    }
}
