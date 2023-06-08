import { GameComponent } from '../game-component/GameComponent'
import { GameObject } from '../game-object/GameObject'

export class Label extends GameComponent {
    public config: LabelConfig

    // extends gameComponent
    private _type: GameComponentType = 'Label'
    private _gameObject: GameObject | undefined = undefined

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
        if (!this._gameObject) {
            console.error('Label.render: gameObject is undefined')
            return
        }

        if (!this._gameObject.transform) {
            console.error('Label.render: transform is undefined')
            return
        }

        context.fillStyle = this.config.color ?? 'black'
        context.font = `${this.config.size ?? '12px'} ${this.config.fontFamily ?? 'Arial'}`
        context.fillText(
            this.config.text ?? 'Sample Text',
            this._gameObject.transform.worldPosition.x,
            this._gameObject.transform.worldPosition.y
        )
    }

    // extends gameComponent
    public override init(gameObject: GameObject) {
        this._gameObject = gameObject
    }

    public override start() {
        // do nothing
    }

    public override update(_delta: number) {
        if (!this._gameObject) {
            console.error('Label.update: gameObject is undefined')
            return
        }

        this.render(this._gameObject.game?.context as CanvasRenderingContext2D)
    }

    public override destroy() {
        // do nothing
    }
}
