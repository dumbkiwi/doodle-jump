import { IGameObject } from '../game-object/GameObject'
import { IRuntimeObject } from '../runtime-object/IRuntimeObject'

export abstract class GameComponent implements IRuntimeObject {
    protected isActive: boolean
    protected isDestroyed: boolean
    protected gameObject: IGameObject | undefined
    protected onStart: (() => void) | undefined
    protected onUpdate: ((delta: number) => void) | undefined
    protected onDestroy: (() => void) | undefined

    constructor() {
        this.isDestroyed = false
        this.isActive = true

        // binds
        this.start = this.start.bind(this)
        this.update = this.update.bind(this)
    }

    public abstract getType(): GameComponentType
    public getGameObject(): IGameObject | undefined {
        return this.gameObject
    }
    public setGameObject(value: IGameObject | undefined): void {
        this.gameObject = value
    }
    public init(gameObject: IGameObject): void {
        this.gameObject = gameObject

        this.gameObject.getGame()?.events.on('start', this.start.bind(this))
        this.gameObject.getGame()?.events.on('update', this.update.bind(this))

        if (this.isActive) {
            this.setActive(true)
        }
    }
    private start(): void {
        // if not active, return
        if (!this.isActive) {
            return
        }
        this.onStart?.()
    }
    private update(delta: number): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        this.onUpdate?.(delta)
    }
    public destroy(): void {
        if (this.isDestroyed) {
            throw new Error('Cannot destroy a destroyed game component')
        }

        this.isDestroyed = true

        this.onDestroy?.()
    }
    public setActive(value: boolean): void {
        this.isActive = value
    }
    public getActive(): boolean {
        return this.isActive
    }
}

