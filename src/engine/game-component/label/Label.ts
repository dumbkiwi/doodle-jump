import { IGameObject } from '@/engine/game-object/GameObject'
import { GameComponent, GameComponentDecorator } from '../GameComponent'
import { RenderEventArgs } from '@/engine/renderer/Renderer'

export class Label extends GameComponentDecorator {
    public config: LabelConfig

    constructor(config: LabelConfig) {
        const base = new GameComponent()
        super(base)

        this.config = {
            text: 'Sample Text',
            color: 'black',
            size: '12px',
            fontFamily: 'Arial',
            ...config,
        }
    }

    public init(gameObject: IGameObject): void {
        super.init(gameObject)
        this.getGameObject()?.getGame()?.renderer.on('render', 'ui', ({context}: RenderEventArgs) => {
            this.render(context)
        })
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
}
