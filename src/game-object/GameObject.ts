import { GameComponent } from '../game-component/GameComponent'
import { Game } from '../game/Game'
import { IRuntimeObject } from '../runtime-object/IRuntimeObject'
import { Transform } from '../transform/Transform'

export class GameObject implements IRuntimeObject {
    protected isActive: boolean
    protected isDestroyed: boolean
    protected game: Game | undefined
    protected parent: GameObject | undefined
    protected children: GameObject[]
    protected components: GameComponent[]
    protected transform: Transform
    protected onStart: (() => void) | undefined
    protected onUpdate: ((delta: number) => void) | undefined
    protected onDestroy: (() => void) | undefined

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
            this.transform = this.createTransform()
        }

        // add children
        const children = [...(config.children ?? [])]
        children.forEach((child) => this.addChildren(child))

        // add components
        const components = [...(config.components ?? []), this.transform]
        components.forEach((component) => this.addComponent(component))

        // binds
        this.start = this.start.bind(this)
        this.update = this.update.bind(this)
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

        this.game.events.on('start', this.start)
        this.game.events.on('update', this.update)

        // init all components
        this.components.forEach((component) => component.init(this))

        // init all children
        this.children.forEach((child) => child.init(game))
    }

    private start(): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        this.children.forEach((child) => child.start())
        this.onStart?.()
    }

    private update(delta: number): void {
        // if not active, return
        if (!this.isActive) {
            return
        }

        this.children.forEach((child) => child.update(delta))

        this.onUpdate?.(delta)
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

        this.onDestroy?.()
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
    public addChildren(gameObject: GameObject): GameObject {
        this.children.push(gameObject)
        gameObject.setParent(this)
        return gameObject
    }
    public removeChildren(gameObject: GameObject): GameObject {
        gameObject.setParent(undefined)
        const index = this.children.indexOf(gameObject)
        if (index === -1) {
            throw new Error('Cannot remove a game object that does not exist')
        }

        return this.children.splice(index, 1)[0]
    }
    public getChildren(): GameObject[] {
        return this.children
    }
    public getParent(): GameObject | undefined {
        return this.parent
    }
    public setParent(parent: GameObject | undefined): void {
        this.parent = parent
    }
}
