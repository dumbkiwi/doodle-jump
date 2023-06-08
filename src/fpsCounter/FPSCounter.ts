import { GameObject } from '../game-object/GameObject'
import { Label } from '../label/Label'

export class FPSCounter extends Label {
    private fps: number
    private lastTime: number
    private frameCount: number

    constructor(config: LabelConfig) {
        super({
            ...config,
            text: `FPS: ${0}`,
        })

        this.fps = 0
        this.lastTime = 0
        this.frameCount = 0
    }

    public override init(gameObject: GameObject): void {
        super.init(gameObject)
        this.lastTime = performance.now()
    }

    public override update(delta: number): void {
        this.frameCount++
        const now = performance.now()
        const elapsed = now - this.lastTime
        if (elapsed > 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed)
            this.config.text = `FPS: ${this.fps}`
            this.frameCount = 0
            this.lastTime = now
        }

        super.update(delta)
    }
}
