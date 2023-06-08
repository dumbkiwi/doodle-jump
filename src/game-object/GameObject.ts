import { Collider } from '../collider/Collider'
import { GameComponent } from '../game-component/GameComponent'
import { Game } from '../game/Game'
import { Transform } from '../transform/Transform'

export class GameObject {
    private _components: GameComponent[] = []
    private _game: Game | undefined = undefined
    private _transform: Transform
    private _parent: GameObject | undefined = undefined
    private _children: GameObject[] = []

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

    public get parent(): GameObject | undefined {
        return this._parent
    }

    public set parent(value: GameObject | undefined) {
        this._parent = value
    }

    public get children(): GameObject[] {
        return this._children
    }

    public set children(value: GameObject[]) {
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
            this._transform.gameObject = this
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
            component.init(this)
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

    public addGameObject(gameObject: GameObject) {
        this.children.push(gameObject)

        gameObject.parent = this
    }

    public removeGameObject(gameObject: GameObject) {
        const index = this.children.indexOf(gameObject)

        if (index !== -1) {
            this.children.splice(index, 1)
        }
    }
}
