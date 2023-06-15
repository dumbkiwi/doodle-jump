import { GameComponentDecorator } from '@/engine/game-component/GameComponent'
import { Label } from '../engine/game-component/label/Label'
import { IGameObject } from '@/engine/game-object/GameObject'

export class FPSCounter extends GameComponentDecorator {
    private fps: number
    private lastTime: number
    private frameCount: number
    private label: Label

    constructor(config: LabelConfig) {
        const component = new Label(config)
        super(component)

        this.fps = 0
        this.lastTime = 0
        this.frameCount = 0
        this.label = component
    }

    public init(gameObject: IGameObject): void {
        super.init(gameObject)

        this.on('start', () => {
            this.lastTime = performance.now()
        })

        this.on('update', (delta: number) => {
            this.onUpdate(delta)
        })
    }

    private onUpdate(_delta: number) {
        this.label.render(this.getGameObject()?.getGame()?.context as CanvasRenderingContext2D)
        this.frameCount++
        const now = performance.now()
        const elapsed = now - this.lastTime
        if (elapsed > 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed)
            this.label.config.text = `FPS: ${this.fps}`
            this.frameCount = 0
            this.lastTime = now
        }
    }
}
