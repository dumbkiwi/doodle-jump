import { GameObject } from '../game-object/GameObject'
import { IRuntimeObject } from '../runtime-object/IRuntimeObject'

export abstract class GameComponentNew implements IRuntimeObject {
    protected isActive: boolean
    protected isDestroyed: boolean
    protected gameObject: GameObject | undefined
    protected onStart: (() => void) | undefined
    protected onUpdate: ((delta: number) => void) | undefined
    protected onDestroy: (() => void) | undefined

    constructor() {
        this.isDestroyed = false
    }

    public abstract getType(): GameComponentType
    public getGameObject(): GameObject | undefined {
        return this.gameObject
    }
    public setGameObject(value: GameObject | undefined): void {
        this.gameObject = value
    }
    public init(gameObject: GameObject): void {
        this.gameObject = gameObject

        // TODO: subscribe start, update to game events
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
export abstract class GameComponent {
    public abstract get type(): GameComponentType
    public abstract get gameObject(): GameObject | undefined
    public abstract set gameObject(value: GameObject | undefined)
    public abstract init(gameObject: GameObject): void
    public abstract start(): void
    public abstract update(delta: number): void
    public abstract destroy(): void
}
