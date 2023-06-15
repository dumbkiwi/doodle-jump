import { RectangleCollider } from '../../game-component/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../GameObject'
import { Game } from '../../game/Game'
import { Transform } from '../../game-component/transform/Transform'
import Rigibody from '@/engine/game-component/rigidbody/Rigidbody'

export class ScrollView extends GameObjectDecorator {
    private viewGameObject: GameObject
    private viewTransform: Transform
    private smoothing: number
    private playerCollider: RectangleCollider
    private triggerCollider: RectangleCollider
    private viewportSize: Vector2D
    private scrollDistance: number

    constructor(config: ScrollViewConfig) {
        const scrollView = new GameObject({})
        const triggerCollider = new RectangleCollider({
            size: { x: config.triggerArea.size.x, y: config.triggerArea.size.y },
            position: { x: config.triggerArea.position.x, y: config.triggerArea.position.y },
            tag: 'Ceiling',
        })

        const gameObject = new GameObject({
            startActive: config.startActive,
            children: [...(config.children ?? []), scrollView],
            components: [...(config.components ?? []), triggerCollider],
        })

        super(gameObject)

        this.viewGameObject = scrollView
        this.viewTransform = scrollView.getTransform()
        this.smoothing = config.smoothing
        this.playerCollider = config.playerCollider
        this.viewportSize = config.viewportSize
        this.scrollDistance = 0
        this.triggerCollider = triggerCollider

        this.triggerCollider.onCollision('collisionStay', ({ other }) => {
            const rigidbody = other.getGameObject()?.getComponent<Rigibody>('Rigidbody')

            if (rigidbody && other.tag === 'Player' && rigidbody.velocity.y < 0) {
                this.addScrollDistance(-rigidbody.velocity.y)
            }
        })
    }

    public override init(game: Game) {
        super.init(game)
        this.scrollDistance = 0

        this.on('update', () => {
            this.move()
        })
    }

    private move() {
        if (!this.viewTransform) {
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
