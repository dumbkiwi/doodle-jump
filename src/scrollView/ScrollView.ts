import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { Game } from '../game/Game'
import { Transform } from '../transform/Transform'

class View extends GameObject {}

export class ScrollView extends GameObject {
    private viewGameObject: GameObject
    private viewTransform: Transform
    private smoothing: number
    private playerCollider: RectangleCollider
    private triggerCollider: RectangleCollider
    private viewportSize: Vector2D
    private scrollDistance: number

    constructor(config: ScrollViewConfig) {
        const scrollView = new View({})
        const triggerCollider = new RectangleCollider({
            size: { x: config.triggerArea.size.x, y: config.triggerArea.size.y },
            position: { x: config.triggerArea.position.x, y: config.triggerArea.position.y },
            tag: 'Ceiling',
        })

        super({
            startActive: config.startActive,
            children: [...(config.children ?? []), scrollView],
            components: [...(config.components ?? [triggerCollider])],
        })

        this.viewGameObject = scrollView
        this.viewTransform = scrollView.getTransform()
        this.smoothing = config.smoothing
        this.playerCollider = config.playerCollider
        this.viewportSize = config.viewportSize
        this.scrollDistance = 0
        this.triggerCollider = triggerCollider
    }

    public override init(game: Game) {
        // init scroll distance
        this.scrollDistance = 0

        this.triggerCollider.on('collisionEnter', (other) => {
            if (other.tag === 'Player') {
                this.addScrollDistance(other.velocity.y)
            }
        })

        // added last because there was changes to the list of components
        super.init(game)
    }

    protected override onUpdate = (_delta: number) => {
        if (!this.transform) {
            return
        }

        // move the platform group downwards to deplete the scroll distance
        this.viewTransform.localPosition.y += this.scrollDistance * this.smoothing
        this.scrollDistance *= 1 - this.smoothing
    }

    // utils
    public addScrollDistance(distance: number) {
        this.scrollDistance += distance
    }

    public getScrollDistance(): number {
        return this.scrollDistance
    }

    public setScrollDistance(distance: number) {
        this.scrollDistance = distance
    }

    public getSmoothing(): number {
        return this.smoothing
    }

    public getScrollViewGameObject(): GameObject {
        return this.viewGameObject
    }
}
