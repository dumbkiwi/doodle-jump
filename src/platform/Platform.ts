import { canvasSize } from '../canvasSize'
import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../game-object/GameObject'
import { Game } from '../game/Game'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'

export class Platform extends GameObjectDecorator {
    constructor(config: PlatformConfig) {
        super(
            new GameObject({
                startActive: config.startActive,
                parent: config.parent,
                children: [],
                components: [],
            })
        )

        const platformComponents = [
            new SpriteRenderer(config.spriteRendererConfig),
            new RectangleCollider({
                tag: 'Platform',
                position: {
                    x: 0,
                    y: 0,
                },
                size: config.size,
                onCollisionEnter: (other: Collider) => {
                    if (other.tag === 'Player') {
                        // if player is falling down
                        if (other.velocity.y > 0) {
                            // set player position to the top of the platform
                            other.y = this.getTransform().worldPosition.y + config.size.y / 2

                            // bounce player by setting its velocity to the opposite of bounciness
                            other.velocity.y = -config.bounciness

                            // set scroll distance to be the distance between the platform to the bottom of the canvas
                            config.scrollView?.setScrollDistance(
                                -this.getTransform().worldPosition.y +
                                    canvasSize.y -
                                    config.size.y -
                                    (config.scrollViewPadding ?? 0)
                            )
                        }
                    }
                },
            }),
        ]

        // add components to game object
        platformComponents.forEach((component) => {
            this.addComponent(component)
        })

        // set transform position to config
        this.getTransform().localPosition.x = config.position.x
        this.getTransform().localPosition.y = config.position.y
    }

    public override init(game: Game): void {
        super.init(game)

        this.getAllComponents().forEach((component) => {
            component.init(this) // pass this game object to component
        })
    }
}
