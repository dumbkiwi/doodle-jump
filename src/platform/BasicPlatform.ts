import { Collider } from '../engine/game-component/collider/Collider'
import { RectangleCollider } from '../engine/game-component/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../engine/game-object/GameObject'
import { Game } from '../engine/game/Game'
import { SpriteRenderer } from '../engine/game-component/sprite-renderer/SpriteRenderer'

import platformImage from '#/doodle-jump/platform-base@2x.png'
import { Transform } from '@/engine/game-component/transform/Transform'

export class BasicPlatform extends GameObjectDecorator {
    constructor(config: PlatformConfig) {
        const gameObject = new GameObject({
            startActive: config.startActive,
            parent: config.parent,
            children: [],
            components: [],
        })

        super(
            gameObject  
        )

        const platformComponents = [
            new SpriteRenderer({
                layer: 'layer_1',
                baseColor: 'white',
                size: {
                    x: 75,
                    y: 20,
                },
                imageSrc: platformImage,
            }),
            new RectangleCollider({
                tag: 'Platform',
                position: {
                    x: 0,
                    y: -18,
                },
                size: {
                    x: 60,
                    y: 20,
                },
                onCollisionEnter: (other: Collider) => {
                    if (other.tag === 'Player') {
                        // if player is falling down
                        if (other.velocity.y > 0) {
                            // set player's position to the top of the platform
                            const otherTransform = other.getGameObject()?.getTransform()
                            const otherParentTransform = other.getGameObject()?.getParent()?.getTransform()
                            const thisCollider = this.getComponent<Collider>("Collider")
                            if (otherTransform && otherParentTransform && thisCollider) {
                                otherTransform.localPosition.y = Transform.toLocalSpace({x: 0, y: thisCollider.top}, otherParentTransform).y - thisCollider.height * 2
                            }

                            other.velocity.y -= other.velocity.y

                            // bounce player by setting velocity to negative bounciness
                            other.acceleration.y = -config.bounciness

                            // set player's acceleration to 0
                            // other.acceleration.y = 0
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
