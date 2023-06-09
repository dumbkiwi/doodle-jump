import { RequestAnimationFrame } from '../dom/RequestAnimationFrame'
import { EventManager } from '../event/Event'
import { GameComponent } from '../game-component/GameComponent'
import { GameObject } from '../game-object/GameObject'
import { Transform } from '../transform/Transform'

export abstract class GameObjectNew {
    protected isActive: boolean
    protected isDestroyed: boolean
    protected game: Game | undefined
    protected parent: GameObjectNew | undefined
    protected children: GameObjectNew[]
    protected components: GameComponent[]
    protected transform: Transform
    protected onStart: (() => void) | undefined
    protected onUpdate: ((delta: number) => void) | undefined
    protected onStop: (() => void) | undefined

    constructor(config: Partial<GameObjectConfig>) {
        this.isDestroyed = false

        this.isActive = config.startActive ?? true
        this.parent = config.parent
        this.children = [...(config.children ?? [])]
        this.components = [...(config.components ?? [])]
        this.transform = this.createTransform()
    }

    protected createTransform(): Transform {
        return new Transform({
            position: { x: 0, y: 0 },
            rotation: 0,
            scale: { x: 1, y: 1 },
        })
    }

    // runtime
    public init(game: Game): void {
        // if destroyed, throw error
        if (this.isDestroyed) {
            throw new Error('Cannot initialize a destroyed game object')
        }

        this.game = game

        // TODO: subscribe start, update and stop to game events
    }

    private start(): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        this.components.forEach((component) => component.start())
        this.onStart?.()
    }

    private update(delta: number): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        this.components.forEach((component) => component.update(delta))

        this.children.forEach((child) => child.update(delta))

        this.onUpdate?.(delta)
    }

    private stop(): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        // TODO: implement stop for components
        // this.components.forEach((component) => component.stop())

        this.children.forEach((child) => child.stop())
        this.onStop?.()
    }

    public destroy(): void {
        // if destroyed, throw error
        if (this.isDestroyed) {
            throw new Error('Cannot destroy a destroyed game object')
        }

        // destroy all children
        this.children.forEach((child) => child.destroy())

        // destroy all components
        this.components.forEach((component) => component.destroy())

        // remove from parent
        this.parent?.removeChildren(this)

        // set destroyed
        this.isDestroyed = true
    }

    // utils
    /// runtime
    public setActive(active: boolean): void {
        this.isActive = active
    }
    public getActive(): boolean {
        return this.isActive
    }
    public getTranform(): Transform {
        return this.transform
    }
    public getGame(): Game | undefined {
        return this.game
    }
    //// components
    public getComponent<T extends GameComponent>(type: GameComponentType): T | undefined {
        return this.components.find<T>((component): component is T => component.type === type)
    }
    public getComponents<T extends GameComponent>(type: GameComponentType): T[] {
        return this.components.filter<T>((component): component is T => component.type === type)
    }
    public addComponent(component: GameComponent): GameComponent {
        this.components.push(component)
        return component
    }
    public removeComponent(component: GameComponent): GameComponent {
        const index = this.components.indexOf(component)
        if (index === -1) {
            throw new Error('Cannot remove a component that does not exist')
        }

        return this.components.splice(index, 1)[0]
    }
    //// game objects
    public addChildren(gameObject: GameObjectNew): GameObjectNew {
        this.children.push(gameObject)
        gameObject.setParent(this)
        return gameObject
    }
    public removeChildren(gameObject: GameObjectNew): GameObjectNew {
        gameObject.setParent(undefined)
        const index = this.children.indexOf(gameObject)
        if (index === -1) {
            throw new Error('Cannot remove a game object that does not exist')
        }

        return this.children.splice(index, 1)[0]
    }
    public getChildren(): GameObjectNew[] {
        return this.children
    }
    public getParent(): GameObjectNew | undefined {
        return this.parent
    }
    public setParent(parent: GameObjectNew | undefined): void {
        this.parent = parent
    }
}

export class Game {
    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D
    public events: EventManager<GameEvent, number>

    private runtimeEventManager: EventManager<RuntimeEvent, string> = new EventManager<
        RuntimeEvent,
        string
    >()
    private _gameObjects: GameObject[]
    private raf: RequestAnimationFrame
    private lastFrameTime: number

    private hasInitialized: boolean

    public get gameObjects(): GameObject[] {
        return this._gameObjects
    }

    constructor(gameObjects: GameObject[], viewportSize?: Vector2D) {
        this.runtimeEventManager.on('error', (error) => {
            console.trace(`Game stopped be cause of a fatal: ${error}. Stack trace:`)
            this.stop()
        })
        this.events = new EventManager<GameEvent, number>()
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
