import { Renderer } from '@/engine/renderer/Renderer'
import { RequestAnimationFrame } from '../dom/RequestAnimationFrame'
import { EventManager } from '../event/Event'
import { IGameObject } from '../game-object/GameObject'

export class Game {
    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D
    public events: EventManager<GameEvent, number>
    public renderer: Renderer

    private runtimeEventManager: EventManager<RuntimeEvent, string>
    private _gameObjects: IGameObject[]
    private raf: RequestAnimationFrame
    private lastFrameTime: number

    private hasInitialized: boolean

    public get gameObjects(): IGameObject[] {
        return this._gameObjects
    }

    constructor(gameObjects: IGameObject[], viewportSize?: Vector2D) {
        this.runtimeEventManager = new EventManager<RuntimeEvent, string>()

        this.runtimeEventManager.on('error', (error) => {
            console.trace(`Game stopped be cause of a fatal: ${error}. Stack trace:`)
            this.stop()
        })
        this.events = new EventManager<GameEvent, number>()
        this.raf = new RequestAnimationFrame()

        this.hasInitialized = false

        // initialize the game objects
        this._gameObjects = gameObjects

        // initialize the canvas to be made deprecated by the renderer
        this.canvas = this.initCanvas(viewportSize ?? { x: 0, y: 0 })
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

        // initialize the renderer
        this.renderer = new Renderer(this)

        this.start = this.start.bind(this)
        this.update = this.update.bind(this)
        this.stop = this.stop.bind(this)
        this.destroy = this.destroy.bind(this)

        // append the canvas to the body
        document.getElementById('game')?.appendChild(this.canvas)
    }

    public init() {
        if (this.hasInitialized) {
            return
        }

        this.hasInitialized = true

        this._gameObjects.forEach((gameObject) => {
            gameObject.init(this)
        })
    }

    public start() {
        if (!this.hasInitialized) {
            console.error('Game has not been initialized')
        }

        this.events.emit('start')
        this.raf.start(this.update)
        this.lastFrameTime = performance.now()
    }

    public update() {
        // clear the canvas
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // calculate the delta time
        const time = performance.now()
        const delta = time - this.lastFrameTime
        this.lastFrameTime = time

        // update the game
        this.events.emit('update', delta)
    }

    public stop() {
        this.events.emit('stop')
        this.raf.stop()
    }

    public destroy() {
        this.events.emit('destroy')
        this.raf.destroy()
    }

    // create the canvas
    private initCanvas(size: Vector2D) {
        const canvas = document.createElement('canvas')
        canvas.width = size ? size.x : window.innerWidth
        canvas.height = size ? size.y : window.innerHeight

        return canvas
    }
}
