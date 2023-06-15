import { EventManager, LayeredEventManager } from '@/engine/event/Event'
import { Game } from '@/engine/game/Game'

interface IRenderer {
    on(event: RenderEvent, layer: RenderingLayer, callback: () => void): void
    off(event: RenderEvent, layer: RenderingLayer, callback: () => void): void
    render(): void
}

export interface RenderEventArgs {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
}

export class Renderer implements IRenderer {
    private game: Game
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private renderEventManager: EventManager<RenderEvent, RenderEventArgs>
    private layeredEventManager: LayeredEventManager<RenderEvent, RenderingLayer, RenderEventArgs>

    constructor(game: Game) {
        this.game = game
        this.canvas = game.canvas
        this.context = game.context
        this.renderEventManager = new EventManager<RenderEvent, RenderEventArgs>()
        this.layeredEventManager = new LayeredEventManager<
            RenderEvent,
            RenderingLayer,
            RenderEventArgs
        >()

        this.game.events.on('update', () => {
            this.render()
        })
    }

    public on(
        event: RenderEvent,
        layer: RenderingLayer,
        callback: (...args: RenderEventArgs[]) => void
    ): void {
        this.layeredEventManager.on(event, layer, callback)
    }

    public off(
        event: RenderEvent,
        layer: RenderingLayer,
        callback: (...args: RenderEventArgs[]) => void
    ): void {
        this.layeredEventManager.off(event, layer, callback)
    }

    public render(): void {
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        const arg = {
            canvas: this.canvas,
            context: this.context,
        } as RenderEventArgs

        // emit background render event
        this.layeredEventManager.emit('render', 'background', arg)

        // emit layer render events
        this.layeredEventManager.emit('render', 'layer_1', arg)

        // emit layer render events
        this.layeredEventManager.emit('render', 'layer_2', arg)

        // emit layer render events
        this.layeredEventManager.emit('render', 'layer_3', arg)

        // emit layer render events
        this.layeredEventManager.emit('render', 'layer_4', arg)

        // emit layer render events
        this.layeredEventManager.emit('render', 'layer_5', arg)

        // emit foreground render event
        this.layeredEventManager.emit('render', 'foreground', arg)

        // emit ui render event
        this.layeredEventManager.emit('render', 'ui', arg)
    }
}
