import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { Game } from '../game/Game'

export class ScrollView extends GameObject {
    private config: ScrollViewConfig
    private scrollDistance: number

    constructor(config: ScrollViewConfig) {
        super()

        this.config = config
    }

    public override init(game: Game) {
        // init scroll distance
        this.scrollDistance = 0

        // add listeners
        const ceilingCollider = (this.config.ceilingObject as GameObject).getComponent(
            'Collider'
        ) as RectangleCollider

        ceilingCollider.on('collisionEnter', (other) => {
            if (other.tag === 'Player') {
                // distance of player to the middle of the screen
                const distance = Math.abs(other.y - this.config.viewportSize.y / 2)

                this.addScrollDistance(distance)
            }
        })

        // added last because there was changes to the list of components
        super.init(game)
    }

    public override update(_delta: number) {
        super.update(_delta)
        if (!this.transform) {
            return
        }

        // move the platform group downwards to deplete the scroll distance
        this.transform.localPosition.y += this.scrollDistance * this.config.smoothing
        this.scrollDistance *= 1 - this.config.smoothing
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
        return this.config.smoothing
    }
}
