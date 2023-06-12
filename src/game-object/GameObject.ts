import { Collider } from '../collider/Collider'
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

        // add children
        const children = [...(config.children ?? [])]
        children.forEach((child) => this.addChildren(child))

        // add components
        const components = [...(config.components ?? [])]
        components.forEach((component) => this.addComponent(component))

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

        this.children.forEach((child) => child.start())
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

export class GameObjectOld {
    private _components: GameComponent[] = []
    private _game: Game | undefined = undefined
    private _transform: Transform
    private _parent: GameObjectOld | undefined = undefined
    private _children: GameObjectOld[] = []

    public get components(): GameComponent[] {
        return this._components
    }

    public set components(value: GameComponent[]) {
        this._components = value
    }

    public get game(): Game | undefined {
        return this._game
    }

    public set game(value: Game | undefined) {
        this._game = value
    }

    public get transform(): Transform {
        if (this._transform === undefined) {
            // try to find a transform component
            this._transform = this.getComponent('Transform') as Transform
        }
        return this._transform
    }

    public set transform(value: Transform) {
        this._transform = value
    }

    public get parent(): GameObjectOld | undefined {
        return this._parent
    }

    public set parent(value: GameObjectOld | undefined) {
        this._parent = value
    }

    public get children(): GameObjectOld[] {
        return this._children
    }

    public set children(value: GameObjectOld[]) {
        this._children = value
    }

    constructor(config?: GameObjectConfig) {
        // init parent
        this._parent = config?.parent

        if (config?.parent) {
            config?.parent.children.push(this)
        }

        // init components
        this._components = config?.components ?? []

        // init transform
        // try to find a transform component
        const transform = this._components.find<Transform>(
            (component): component is Transform => component.type === 'Transform'
        )

        // if there is no transform component, create one and add to components
        if (transform === undefined) {
            this._transform = new Transform()
            this._components.push(this._transform)
        } else {
            // transform must have been added to components already
            // init the transform component
            this._transform = transform
            // this._transform.gameObject = this
        }

        // init children
        this.children = config?.children ?? []

        this.children.forEach((child) => {
            child.parent = this
        })

        this.init = this.init.bind(this)
        this.start = this.start.bind(this)
        this.update = this.update.bind(this)
        this.getColliders = this.getColliders.bind(this)
        this.getComponent = this.getComponent.bind(this)
        this.addComponent = this.addComponent.bind(this)
        this.removeComponent = this.removeComponent.bind(this)
    }

    public init(game: Game) {
        this.game = game

        for (const component of this.components) {
            // component.init(this)
        }

        for (const child of this.children) {
            child.init(game)
        }

        game.events.on('start', this.start)
        game.events.on('update', this.update)
    }

    public start() {
        for (const child of this.children) {
            child.start()
        }

        for (const component of this.components) {
            component.start()
        }
    }

    public update(delta: number) {
        for (const child of this.children) {
            child.update(delta)
        }

        for (const component of this.components) {
            component.update(delta)
        }
    }

    // utils
    public addComponent(component: GameComponent) {
        this.components.push(component)
    }

    public removeComponent(component: GameComponent) {
        const index = this.components.indexOf(component)

        if (index !== -1) {
            this.components.splice(index, 1)
        }
    }

    public getComponent(type: GameComponentType): GameComponent | undefined {
        const found = this.components.find((component) => component.type === type)

        if (found) {
            return found
        }

        for (const child of this.children) {
            const found = child.getComponent(type)

            if (found) {
                return found
            }
        }

        return undefined
    }

    public getComponents(type: GameComponentType): GameComponent[] {
        return [
            ...this.components.filter((component) => component.type === type),
            ...this.children.flatMap((child) => child.getComponents(type)),
        ]
    }

    public getColliders(): Collider[] {
        return this.getComponents('Collider') as Collider[]
    }

    public addGameObject(gameObject: GameObjectOld) {
        this.children.push(gameObject)

        gameObject.parent = this
    }

    public removeGameObject(gameObject: GameObjectOld) {
        const index = this.children.indexOf(gameObject)

        if (index !== -1) {
            this.children.splice(index, 1)
        }
    }
}
