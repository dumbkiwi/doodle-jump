import ICollider from '../game-component/collider/Collider'
import { Game } from '../game/Game'

export default class Physics {
    private activeColliders: ICollider[] = []

    public registerCollider(collider: ICollider): number {
        return this.activeColliders.push(collider) - 1
    }

    public unregisterCollider(index: number): void {
        this.activeColliders.splice(index, 1)
    }

    public GetActiveColliders(): ICollider[] {
        return this.activeColliders
    }

    private game: Game
    constructor(game: Game) {
        this.game = game

        game.events.on('start', () => {
            this.startChecking()
        })
    }

    public startChecking() {
        this.game.events.on('update', () => {
            this.collisionCheck()
        })
    }

    public collisionCheck() {
        for (const collider of this.activeColliders) {
            for (const other of this.activeColliders) {
                if (collider.colliderId === other.colliderId) continue

                let isColliding = collider.isCollidingWith(other)
                const collidingColliders = collider.getCollidingColliders()

                if (!collider.getActive() || !other.getActive()) {
                    isColliding = false
                }

                if (isColliding && collidingColliders.find((c) => c.colliderId === other.colliderId) === undefined) {
                    // if they were not colliding, emit collisionEnter
                    collider.addCollidingCollider(other)
                    collider.emitCollision('collisionEnter', { self: collider, other })
                } else if (isColliding && collidingColliders.find((c) => c.colliderId === other.colliderId) !== undefined) {
                    // if they were colliding, emit collisionStay
                    collider.emitCollision('collisionStay', { self: collider, other })
                } else if (!isColliding && collidingColliders.find((c) => c.colliderId === other.colliderId) !== undefined) {
                    // if they are not colliding, emit collisionExit
                    collider.removeCollidingCollider(other.colliderId)
                    collider.emitCollision('collisionExit', { self: collider, other })
                }
            }
        }
    }
}
