import { RequestAnimationFrame } from '../dom/RequestAnimationFrame'
import { EventManager } from '../event/Event'
import { GameObject } from '../game-object/GameObject'

export class Game {
    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D
    public events: EventManager<RuntimeEvent, number>
    public runtimeState: RuntimeEvent = 'update' // TODO: implement runtime state

    private _gameObjects: GameObject[]
    private raf: RequestAnimationFrame
    private lastFrameTime: number

    private hasInitialized: boolean

    public get gameObjects(): GameObject[] {
        return this._gameObjects
    }

    constructor(gameObjects: GameObject[], viewportSize?: Vector2D) {
        this.events = new EventManager<RuntimeEvent, number>()
        this.raf = new RequestAnimationFrame()

        this.hasInitialized = false

        // initialize the game objects
        this._gameObjects = gameObjects

        // initialize the canvas
        this.canvas = this.initCanvas(viewportSize ?? { x: 0, y: 0 })
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

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
        // stop the game if the runtime state is error
        if (this.runtimeState === 'error') {
            console.error('Runtime state is error')
            this.stop()
            return
        }

        // clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
