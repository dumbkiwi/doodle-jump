import { IGameObject } from '../game-object/GameObject'
import { IRuntimeObject } from '../runtime-object/IRuntimeObject'

export interface IGameComponent extends IRuntimeObject {
    // methods
    //// runtime
    on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    init(gameObject: IGameObject): void
    destroy(): void

    //// utils
    getType(): GameComponentType
    getGameObject(): IGameObject | undefined
    setGameObject(value: IGameObject | undefined): void
}

export class GameComponent implements IGameComponent {
    private attachedGameObject: IGameObject | undefined
    private isActive: boolean
    private isDestroyed: boolean

    constructor() {
        this.isDestroyed = false
        this.isActive = true
    }

    //// runtime
    public on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.attachedGameObject?.on(event, callback)
    }

    public once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.attachedGameObject?.once(event, callback)
    }

    public off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.attachedGameObject?.off(event, callback)
    }

    public init(gameObject: IGameObject): void {
        this.attachedGameObject = gameObject

        this.setActive(this.isActive)
    }

    public destroy(): void {
        if (this.isDestroyed) {
            throw new Error('Cannot destroy a destroyed game component')
        }

        this.isDestroyed = true

        this.attachedGameObject = undefined
    }

    // utils
    public setActive(value: boolean): void {
        this.isActive = value
    }

    public getActive(): boolean {
        return this.isActive
    }

    public getType() {
        return 'Forbidden' as GameComponentType
    }
    public getGameObject(): IGameObject | undefined {
        return this.attachedGameObject
    }
    public setGameObject(value: IGameObject | undefined): void {
        this.attachedGameObject = value
    }
}

export class GameComponentDecorator implements IGameComponent {
    protected wrapper: IGameComponent

    constructor(wrapper: IGameComponent) {
        this.wrapper = wrapper
    }

    //// runtime
    public on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrapper.on(event, callback)
    }

    public once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrapper.once(event, callback)
    }

    public off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrapper.off(event, callback)
    }

    public init(gameObject: IGameObject): void {
        this.wrapper.init(gameObject)
    }

    public destroy(): void {
        this.wrapper.destroy()
    }

    // utils
    public setActive(value: boolean): void {
        this.wrapper.setActive(value)
    }

    public getActive(): boolean {
        return this.wrapper.getActive()
    }

    public getType() {
        return this.wrapper.getType()
    }
    public getGameObject() {
        return this.wrapper.getGameObject()
    }
    public setGameObject(value: IGameObject | undefined): void {
        this.wrapper.setGameObject(value)
    }
}
