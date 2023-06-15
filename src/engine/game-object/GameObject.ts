import { GameComponent } from '../game-component/GameComponent'
import { Game } from '../game/Game'
import { IRuntimeObject } from '../runtime-object/IRuntimeObject'
import { Transform } from '../transform/Transform'

export interface IGameObject extends IRuntimeObject {
    // fields TODO: move to decorator
    // isActive: boolean
    // isDestroyed: boolean
    // game: Game | undefined
    // parent: GameObject | undefined
    // children: GameObject[]
    // components: GameComponent[]
    // transform: Transform
    // onStart: (() => void) | undefined
    // onUpdate: ((delta: number) => void) | undefined
    // onDestroy: (() => void) | undefined

    // methods
    //// runtime
    on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void
    init(game: Game): void
    destroy(): void

    //// utils
    getTransform(): Transform
    getGame(): Game | undefined

    //// components
    getComponent<T extends GameComponent>(type: GameComponentType): T | undefined
    getComponents<T extends GameComponent>(type: GameComponentType): T[]
    getAllComponents(): GameComponent[]
    getComponentsInChildren<T extends GameComponent>(type: GameComponentType): T[]
    addComponent(component: GameComponent): GameComponent
    removeComponent(component: GameComponent): GameComponent
    addChildren(gameObject: IGameObject): IGameObject
    removeChildren(gameObject: IGameObject): IGameObject
    getChildren(): IGameObject[]
    getParent(): IGameObject | undefined
    setParent(parent: IGameObject | undefined): void
}

export class GameObject implements IGameObject {
    // state
    private isActive: boolean
    private isDestroyed: boolean

    // relationship
    private game: Game | undefined
    private parent: IGameObject | undefined
    private children: IGameObject[]
    private components: GameComponent[]

    // cached components
    private transform: Transform

    constructor(config: Partial<GameObjectConfig>) {
        this.isDestroyed = false

        this.isActive = config.startActive ?? true
        this.parent = config.parent
        this.children = []
        this.components = []

        // find transform in config
        const transform = config.components?.find((component) => component instanceof Transform)
        if (transform instanceof Transform) {
            this.transform = transform
        } else {
            this.transform = this.createDefaultTransform()
        }

        // add children
        const children = config.children ?? []
        children.forEach((child) => this.addChildren(child))

        // add components
        const components = [...(config.components ?? []), this.transform]
        components.forEach((component) => this.addComponent(component))
    }

    private createDefaultTransform(): Transform {
        return new Transform({
            position: { x: 0, y: 0 },
            rotation: 0,
            scale: { x: 1, y: 1 },
        })
    }

    // runtime
    public on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.game?.events.on(event, callback)
    }

    public once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.game?.events.once(event, callback)
    }

    public off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.game?.events.off(event, callback)
    }

    public init(game: Game): void {
        // if destroyed, throw error
        if (this.isDestroyed) {
            throw new Error('Cannot initialize a destroyed game object')
        }

        this.game = game

        // init all components
        this.components.forEach((component) => component.init(this))

        // init all children
        this.children.forEach((child) => child.init(game))
    }

    public destroy(): void {
        // if destroyed, throw error
        if (this.isDestroyed) {
            throw new Error('Cannot destroy a destroyed game object')
        }

        this.game = undefined

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

        // set components active
        this.components.forEach((component) => component.setActive(active))

        // set children active
        this.children.forEach((child) => child.setActive(active))
    }
    public getActive(): boolean {
        return this.isActive
    }
    public getTransform(): Transform {
        return this.transform
    }
    public getGame(): Game | undefined {
        return this.game
    }
    //// components
    public getComponent<T extends GameComponent>(type: GameComponentType): T | undefined {
        return this.components.find<T>((component): component is T => component.getType() === type)
    }
    public getComponents<T extends GameComponent>(type: GameComponentType): T[] {
        return this.components.filter<T>(
            (component): component is T => component.getType() === type
        )
    }
    public getAllComponents(): GameComponent[] {
        return this.components
    }
    public getComponentsInChildren<T extends GameComponent>(type: GameComponentType): T[] {
        return this.children.reduce<T[]>((components, child) => {
            return [...components, ...child.getComponentsInChildren<T>(type)]
        }, this.getComponents<T>(type))
    }
    public addComponent(component: GameComponent): GameComponent {
        this.components.push(component)
        component.setGameObject(this)
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
    public addChildren(gameObject: IGameObject): IGameObject {
        this.children.push(gameObject)
        gameObject.setParent(this)
        return gameObject
    }
    public removeChildren(gameObject: IGameObject): IGameObject {
        gameObject.setParent(undefined)
        const index = this.children.indexOf(gameObject)
        if (index === -1) {
            throw new Error('Cannot remove a game object that does not exist')
        }

        return this.children.splice(index, 1)[0]
    }
    public getChildren(): IGameObject[] {
        return this.children
    }
    public getParent(): IGameObject | undefined {
        return this.parent
    }
    public setParent(parent: IGameObject | undefined): void {
        this.parent = parent
    }
}

export class GameObjectDecorator implements IGameObject {
    protected wrappee: IGameObject

    constructor(wrappee: IGameObject) {
        this.wrappee = wrappee
    }

    // runtime
    on(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrappee.on(event, callback)
    }

    once(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrappee.once(event, callback)
    }

    off(event: GameEvent, callback: (() => void) | ((delta: number) => void)): void {
        this.wrappee.off(event, callback)
    }

    init(game: Game): void {
        this.wrappee.init(game)
    }

    destroy(): void {
        this.wrappee.destroy()
    }

    // utils
    /// runtime
    setActive(active: boolean): void {
        this.wrappee.setActive(active)
    }
    getActive(): boolean {
        return this.wrappee.getActive()
    }
    getTransform(): Transform {
        return this.wrappee.getTransform()
    }
    getGame(): Game | undefined {
        return this.wrappee.getGame()
    }
    //// components
    getComponent<T extends GameComponent>(type: GameComponentType): T | undefined {
        return this.wrappee.getComponent<T>(type)
    }
    getComponents<T extends GameComponent>(type: GameComponentType): T[] {
        return this.wrappee.getComponents<T>(type)
    }
    getAllComponents(): GameComponent[] {
        return this.wrappee.getAllComponents()
    }
    getComponentsInChildren<T extends GameComponent>(type: GameComponentType): T[] {
        return this.wrappee.getComponentsInChildren<T>(type)
    }
    addComponent(component: GameComponent): GameComponent {
        return this.wrappee.addComponent(component)
    }
    removeComponent(component: GameComponent): GameComponent {
        return this.wrappee.removeComponent(component)
    }
    //// game objects
    addChildren(gameObject: IGameObject): IGameObject {
        return this.wrappee.addChildren(gameObject)
    }
    removeChildren(gameObject: IGameObject): IGameObject {
        return this.wrappee.removeChildren(gameObject)
    }
    getChildren(): IGameObject[] {
        return this.wrappee.getChildren()
    }
    getParent(): IGameObject | undefined {
        return this.wrappee.getParent()
    }
    setParent(parent: IGameObject | undefined): void {
        this.wrappee.setParent(parent)
    }
}
