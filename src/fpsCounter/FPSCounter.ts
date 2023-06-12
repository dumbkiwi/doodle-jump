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

    protected onStart = () => {
        this.lastTime = performance.now()
    }

    protected override onUpdate = (_delta: number) => {
        this.render(this.getGameObject()?.getGame()?.context as CanvasRenderingContext2D)
        this.frameCount++
        const now = performance.now()
        const elapsed = now - this.lastTime
        if (elapsed > 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed)
            this.config.text = `FPS: ${this.fps}`
            this.frameCount = 0
            this.lastTime = now
        }
    }
}
