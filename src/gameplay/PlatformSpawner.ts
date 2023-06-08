import { Collider } from '../collider/Collider'
import { GameObject } from '../game-object/GameObject'
import { Platform, PlatformConfig } from '../platform/Platform'

const MAX_SPAWN_ATTEMPT = 100

export type PlatformSpawnerConfig = {
    scrollViewObject: GameObject
    spawnParentObject: GameObject
    spawnColliderObject: GameObject
    destroyColliderObject: GameObject
    platformTemplate: PlatformConfig
    minimumDistanceBetweenPlatforms: number
    minimunNumberOfPlatforms: number
}

export class PlatformSpawner extends GameObject {
    private scrollViewObject: GameObject
    private minimumDistanceBetweenPlatforms: number
    private minimunNumberOfPlatforms: number
    private spawnParentObject: GameObject
    private platformPool: Platform[] = []
    private spawnedPlatforms: Platform[] = []
    private platformTemplate: PlatformConfig
    private spawnCollider: Collider

    constructor(config: PlatformSpawnerConfig) {
        super()

        this.spawnParentObject = config.spawnParentObject
        this.platformTemplate = config.platformTemplate
        this.minimumDistanceBetweenPlatforms = config.minimumDistanceBetweenPlatforms
        this.minimunNumberOfPlatforms = config.minimunNumberOfPlatforms
        this.scrollViewObject = config.scrollViewObject

        const spawnCollider = config.spawnColliderObject.getComponent('Collider') as Collider

        if (!spawnCollider) {
            throw new Error('Spawn collider object must have a collider component')
        }

        this.spawnCollider = spawnCollider

        spawnCollider.on('collisionExit', (_other) => {
            const length = spawnCollider.collidingColliders.filter(
                (collider) => collider.tag === 'Platform'
            ).length
            if (length < this.minimunNumberOfPlatforms) {
                this.spawnPlatforms(this.minimunNumberOfPlatforms - length)
            }
        })

        const destroyCollider = config.destroyColliderObject.getComponent('Collider') as Collider

        if (!destroyCollider) {
            throw new Error('Destroy collider object must have a collider component')
        }

        destroyCollider.on('collisionEnter', (other) => {
            if (other.tag === 'Platform') {
                this.recyclePlatform(other.gameObject as Platform)
            }
        })
    }

    public override start() {
        super.start()
        // spawn 1 platform
        this.spawnPlatforms()
    }

    private spawnPlatforms(numberOfPlatforms = 1) {
        // set spawn range to be the same as the collider's range
        const spawnRange = {
            x: [
                this.spawnCollider.left - this.scrollViewObject.transform.localPosition.x,
                this.spawnCollider.right - this.scrollViewObject.transform.localPosition.x,
            ],
            y: [
                this.spawnCollider.top - this.scrollViewObject.transform.localPosition.y,
                this.spawnCollider.bottom - this.scrollViewObject.transform.localPosition.y,
            ],
        }

        for (let i = 0, j = 0; i < MAX_SPAWN_ATTEMPT && j < numberOfPlatforms; i++) {
            const SpawnPosition = {
                x: Math.random() * (spawnRange.x[1] - spawnRange.x[0]) + spawnRange.x[0],
                y: Math.random() * (spawnRange.y[1] - spawnRange.y[0]) + spawnRange.y[0],
            }

            if (this.isOverlappingWithOtherPlatforms(SpawnPosition)) {
                continue
            }

            this.createPlatform(SpawnPosition)
            j++
        }

        if (this.platformPool.length < numberOfPlatforms - 1) {
            console.warn('Failed to spawn platform due to max spawn attempt reached')
        }
    }

    private createPlatform(position: Vector2D) {
        if (!this.game) {
            console.warn('Game is not set on platform spawner')
            return
        }

        // if there are no platforms in the pool
        // create a new platform
        // else get a platform from the pool
        const platform =
            this.platformPool.length === 0
                ? new Platform(this.platformTemplate)
                : (this.platformPool.pop() as Platform)

        //   init the platform
        platform.init(this.game)

        // change the platform's transform position
        platform.transform.localPosition.x = position.x
        platform.transform.localPosition.y = position.y

        // add the platform to the spawned platforms array
        // and add it to the parent object
        this.spawnedPlatforms.push(platform)
        this.spawnParentObject.addGameObject(platform)
    }

    private recyclePlatform(platform: Platform) {
        // if platform is in the spawned platforms array
        // remove it from the parent object and add it to the platform pool
        // else do nothing
        if (this.spawnedPlatforms.includes(platform)) {
            this.tryDisconnectPlatformFromParent(platform)
            this.platformPool.push(platform)
        }
    }

    private tryDisconnectPlatformFromParent(platform: Platform) {
        if (platform.parent) {
            platform.parent?.removeGameObject(platform)
            platform.parent = undefined
        }
    }

    private isOverlappingWithOtherPlatforms(point: Vector2D) {
        // checks if 4 corners of the platform are overlapping with other platforms
        // if so return true
        // else return false

        this.spawnedPlatforms.forEach((platform) => {
            const collider = platform.getComponent('Collider') as Collider
            // topleft
            if (
                collider.isPointInCollider(
                    point.x - this.minimumDistanceBetweenPlatforms,
                    point.y - this.minimumDistanceBetweenPlatforms
                )
            ) {
                return true
            }

            // topright
            if (
                collider.isPointInCollider(
                    point.x + this.platformTemplate.width - this.minimumDistanceBetweenPlatforms,
                    point.y - this.minimumDistanceBetweenPlatforms
                )
            ) {
                return true
            }

            // bottomleft
            if (
                collider.isPointInCollider(
                    point.x + this.minimumDistanceBetweenPlatforms,
                    point.y + this.platformTemplate.height + this.minimumDistanceBetweenPlatforms
                )
            ) {
                return true
            }

            // bottomright
            if (
                collider.isPointInCollider(
                    point.x + this.platformTemplate.width + this.minimumDistanceBetweenPlatforms,
                    point.y + this.platformTemplate.height + this.minimumDistanceBetweenPlatforms
                )
            ) {
                return true
            }
        })

        return false
    }
}
