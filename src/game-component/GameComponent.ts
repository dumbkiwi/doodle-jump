import { GameObject } from '../game-object/GameObject'

export abstract class GameComponentNew {
    protected gameObject: GameObject | undefined
    protected isDestroyed: boolean
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
        this.onStart?.()
    }
    private update(delta: number): void {
        this.onUpdate?.(delta)
    }
    public destroy(): void {
        if (this.isDestroyed) {
            throw new Error('Cannot destroy a destroyed game component')
        }

        this.isDestroyed = true

        this.onDestroy?.()
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
