import { canvasSize } from '../canvasSize'
import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { ScrollView } from '../scrollView/ScrollView'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'

export type PlatformConfig = {
    scrollView?: ScrollView
    scrollViewPadding?: number
    x: number
    y: number
    color: string
    width: number
    height: number
    bounciness: number
}

export class Platform extends GameObject {
    constructor(config: PlatformConfig) {
        super()

        // set transform position to config
        this.transform.localPosition.x = config.x
        this.transform.localPosition.y = config.y

        const spriteRenderer = new SpriteRenderer({
            size: {
                x: config.width,
                y: config.height,
            },
            baseColor: config.color,
        })

        const collider = new RectangleCollider({
            tag: 'Platform',
            x: 0,
            y: 0,
            width: config.width,
            height: config.height,
            onCollisionEnter: (other: Collider) => {
                if (other.tag === 'Player') {
                    // if player is falling down
                    if (other.velocity.y > 0) {
                        // set player position to the top of the platform
                        other.y = this.transform.worldPosition.y + config.height / 2

                        // bounce player by setting its velocity to the opposite of bounciness
                        other.velocity.y = -config.bounciness

                        // set scroll distance to be the distance between the platform to the bottom of the canvas
                        config.scrollView?.setScrollDistance(
                            -this.transform.worldPosition.y +
                                canvasSize.y -
                                config.height -
                                (config.scrollViewPadding ?? 0)
                        )
                    }
                }
            },
        })

        this.components = this.components.concat([spriteRenderer, collider])
    }
}
