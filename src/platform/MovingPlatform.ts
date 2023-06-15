import { Collider } from '@/engine/game-component/collider/Collider'
import { BasicPlatform } from './BasicPlatform'
import { Game } from '@/engine/game/Game'

export class MovingPlatform extends BasicPlatform {
    private movingDirection: 1 | -1
    private speed: number
    private collider: Collider

    constructor(config: MovingPlatformConfig) {
        super(config)

        this.movingDirection = config.startingDirection === 'left' ? -1 : 1
        this.speed = config.speed

        const collider = this.getComponent<Collider>('Collider')

        if (!collider) {
            throw new Error('MovingPlatform requires a Collider')
        }

        this.collider = collider
    }

    public override init(game: Game) {
        super.init(game)

        this.collider.on('collisionEnter', (other: Collider) => {
            // if other is a platform and is on the right of this platform, reverse direction
            if (other.tag === 'Wall') {
                if (other.x > this.collider.x) {
                    this.movingDirection = -1
                } else {
                    this.movingDirection = 1
                }
            }
        })

        this.getGame()?.events.on('update', () => {
            this.move()
        })
    }

    private move() {
        if (this.movingDirection === -1) {
            this.getTransform().localPosition.x -= this.speed
        } else {
            this.getTransform().localPosition.x += this.speed
        }
    }
}
