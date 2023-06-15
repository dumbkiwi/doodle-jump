import { RectangleCollider } from '../engine/game-component/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '../engine/game-object/GameObject'
import { Game } from '../engine/game/Game'
import { SpriteRenderer } from '../engine/game-component/sprite-renderer/SpriteRenderer'

import platformImage from '#/doodle-jump/platform-base@2x.png'
import { Transform } from '@/engine/game-component/transform/Transform'
import ICollider, { CollisionEventArgs } from '@/engine/game-component/collider/Collider'
import Rigibody from '@/engine/game-component/rigidbody/Rigidbody'

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

            const collider = new RectangleCollider({
                tag: 'Platform',
                position: {
                    x: 0,
                    y: -18,
                },
                size: {
                    x: 60,
                    y: 20,
                },
            })

            collider.onCollision('collisionEnter', ({other}: CollisionEventArgs) => {
                if (other.tag === 'Player') {
                    const rigidbody = other.getGameObject()?.getComponent<Rigibody>("Rigidbody")
                    if (!rigidbody) return
                    // if player is falling down
                    if (rigidbody.velocity.y > 0) {
                        // set player's position to the top of the platform
                        const otherTransform = other.getGameObject()?.getTransform()
                        const otherParentTransform = other.getGameObject()?.getParent()?.getTransform()
                        const thisCollider = this.getComponent<ICollider>("Collider")
                        if (otherTransform && otherParentTransform && thisCollider) {
                            otherTransform.localPosition.y = Transform.toLocalSpace({x: 0, y: thisCollider.top}, otherParentTransform).y - thisCollider.height * 2
                        }

                        // add bounciness
                        rigidbody.velocity.y = 0
                        rigidbody.addForce({x: 0, y: -config.bounciness})
                    }
                }
            })

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
            collider,
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
