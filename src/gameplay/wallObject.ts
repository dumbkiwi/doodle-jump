import { canvasSize } from '@/canvasSize'
import ICollider from '@/engine/game-component/collider/Collider'
import { RectangleCollider } from '@/engine/game-component/collider/RectangleCollider'
import { GameObject, GameObjectDecorator } from '@/engine/game-object/GameObject'
import { Transform } from '@/engine/game-component/transform/Transform'

export class Wall extends GameObjectDecorator {
    private leftCollider: ICollider
    private rightCollider: ICollider
    private teleportTolerance: number
    constructor(config: { teleportTolerance: number }) {
        const leftCollider = new RectangleCollider({
            tag: 'Wall',
            size: {
                x: 10,
                y: canvasSize.y,
            },
            position: {
                x: 0,
                y: 0,
            },
        })

        const rightCollider = new RectangleCollider({
            tag: 'Wall',
            size: {
                x: 10,
                y: canvasSize.y,
            },
            position: {
                x: 0,
                y: 0,
            },
        })

        const leftWall = new GameObject({
            components: [
                new Transform({
                    position: {
                        x: -10,
                        y: 0,
                    },
                }),
                leftCollider,
            ],
        })

        const rightWall = new GameObject({
            components: [
                new Transform({
                    position: {
                        x: canvasSize.x,
                        y: 0,
                    },
                }),
                rightCollider,
            ],
        })

        super(
            new GameObject({
                children: [leftWall, rightWall],
            })
        )

        leftCollider.onCollision('collisionStay', ({ other }) => {
            this.tryTeleportPlayer(true, other)
        })

        rightCollider.onCollision('collisionStay', ({ other }) => {
            this.tryTeleportPlayer(false, other)
        })

        this.teleportTolerance = config.teleportTolerance
        this.leftCollider = leftCollider
        this.rightCollider = rightCollider
    }

    private tryTeleportPlayer(left: boolean, other: ICollider) {
        const otherTransform = other.getGameObject()?.getTransform()

        if (!otherTransform) {
            // warn
            console.warn('otherTransform is null')
            return
        }

        if (other.tag === 'Player') {
            const otherParentTransform =
                otherTransform.getGameObject()?.getParent()?.getTransform() ?? null

            if (!otherParentTransform) {
                // warn
                console.warn('player parent transform is null')
                return
            }

            // if left and player.right < leftCollider.right
            if (left && this.leftCollider.right - other.right > this.teleportTolerance) {
                otherTransform.localPosition.x =
                    Transform.toLocalSpace(this.rightCollider, otherParentTransform).x -
                    other.width / 2 -
                    this.teleportTolerance
            } else if (!left && other.left - this.rightCollider.left > this.teleportTolerance) {
                otherTransform.localPosition.x =
                    Transform.toLocalSpace(this.leftCollider, otherParentTransform).x -
                    other.width / 2 +
                    this.teleportTolerance
            }
        }
    }
}
