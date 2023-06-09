import { canvasSize } from '../canvasSize'
import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObjectNew } from '../game-object/GameObject'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'

export class Platform extends GameObjectNew {
    constructor(config: PlatformConfig) {
        const platformChildren = [
            new SpriteRenderer(config.spriteRendererConfig),
            new RectangleCollider({
                tag: 'Platform',
                x: 0, // offset from this transform
                y: 0, // offset from this transform
                width: config.size.x,
                height: config.size.y,
                onCollisionEnter: (other: Collider) => {
                    if (other.tag === 'Player') {
                        // if player is falling down
                        if (other.velocity.y > 0) {
                            // set player position to the top of the platform
                            other.y = this.transform.worldPosition.y + config.size.y / 2

                            // bounce player by setting its velocity to the opposite of bounciness
                            other.velocity.y = -config.bounciness

                            // set scroll distance to be the distance between the platform to the bottom of the canvas
                            config.scrollView?.setScrollDistance(
                                -this.transform.worldPosition.y +
                                    canvasSize.y -
                                    config.size.y -
                                    (config.scrollViewPadding ?? 0)
                            )
                        }
                    }
                },
            }),
        ]

        super({
            startActive: config.startActive,
            parent: config.parent,
            children: [
                config.children ? [...config.children, ...platformChildren] : platformChildren,
            ],
            components: config.components,
        })

        // set transform position to config
        this.transform.localPosition.x = config.position.x
        this.transform.localPosition.y = config.position.y
    }
}
