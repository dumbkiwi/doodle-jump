import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { Game } from '../game/Game'
import { Platform } from '../platform/Platform'

export type PlatformSpawnerConfig = Partial<GameObjectConfig> & {
    canvasSize: Vector2D
    spawnArea: {
        size: Vector2D
        position: Vector2D
    }
    despawnArea: {
        size: Vector2D
        position: Vector2D
    }
    spawnParentObject: GameObject
    platformTemplate: PlatformConfig
}

export class PlatformSpawner extends GameObject {
    private spawnParentObject: GameObject
    private spawnCollider: Collider
    private despawnCollider: Collider
    private platformTemplate: PlatformConfig
    private platformDistanceRange: [number, number]
    private spawned: Platform[]
    private pool: Platform[]

    constructor(config: PlatformSpawnerConfig) {
        const spawnCollider = new RectangleCollider({
            tag: 'PlatformSpawner',
            position: { x: config.spawnArea.position.x, y: config.spawnArea.position.y },
            size: { x: config.spawnArea.size.x, y: config.spawnArea.size.y },
        })

        const despawnCollider = new RectangleCollider({
            tag: 'PlatformSpawner',
            position: { x: config.despawnArea.position.x, y: config.despawnArea.position.y },
            size: { x: config.despawnArea.size.x, y: config.despawnArea.size.y },
        })

        spawnCollider.on('collisionExit', (other) => {
            if (other.tag === 'Platform') {
                // if a platform leaves, spawn a platform
                this.trySpawnPlatform()
            }
        })

        despawnCollider.on('collisionEnter', (other) => {
            // if it is a platform and it was created by this spawner
            const gameObject = other.getGameObject()
            if (
                other.tag === 'Platform' &&
                gameObject instanceof Platform &&
                this.spawned.includes(gameObject)
            ) {
                // if a platform enters, despawn it
                this.recyclePlatform(gameObject)
            }
        })

        super({
            startActive: config.startActive,
            parent: config.parent,
            children: config.children
                ? [...config.children, spawnCollider, despawnCollider]
                : [spawnCollider, despawnCollider],
        })

        this.spawnCollider = spawnCollider
        this.despawnCollider = despawnCollider
        this.spawnParentObject = config.spawnParentObject
        this.platformTemplate = config.platformTemplate
        this.spawned = []
    }

    protected override onStart = (): void => {
        // game should be set already
        if (this.game === undefined) {
            throw new Error('Game is not set')
        }

        // spawn initial platforms
        this.spawnPlatform(this.game)
    }

    private trySpawnPlatform() {
        // game should be set already
        if (this.game === undefined) {
            throw new Error('Game is not set')
        }

        // if there's no game object,
        // if there is no platform colling with the spawn collider
        if (
            !this.spawnCollider.collidingColliders.some((collider) => collider.tag === 'Platform')
        ) {
            this.spawnPlatform(this.game)
        }
    }

    private spawnPlatform(game: Game) {
        // set spawn range to be the same as the collider's range
        const spawnRange = {
            x: [this.spawnCollider.left, this.spawnCollider.right],
            y: [this.spawnCollider.top, this.spawnCollider.bottom],
        }

        const spawnPosition = {
            x: Math.random() * (spawnRange.x[1] - spawnRange.x[0]) + spawnRange.x[0],
            y: Math.random() * (spawnRange.y[1] - spawnRange.y[0]) + spawnRange.y[0],
        }

        // get platform from the pool
        let platform = this.spawned.pop()

        if (platform === undefined) {
            platform = new Platform({
                ...this.platformTemplate,
                position: spawnPosition,
            })
        }

        //   init the platform
        platform.init(game)

        // add the platform to the spawned platforms array
        // and add it to the parent object
        this.spawned.push(platform)
        this.spawnParentObject.addChildren(platform)
    }

    private recyclePlatform(platform: Platform) {
        // if platform is in the spawned platforms array
        // remove it from the parent object and add it to the platform pool
        // else do nothing
        if (this.spawned.includes(platform)) {
            // set platform to be inactive
            platform.setActive(false)

            // remove the platform from the parent object
            this.RemovePlatformFromParent(platform)

            // remove the platform from the spawned platforms array
            this.spawned.splice(this.spawned.indexOf(platform), 1)

            // add the platform to the pool
            this.pool.push(platform)
        }
    }

    private RemovePlatformFromParent(platform: Platform) {
        if (platform.getParent() !== undefined) {
            platform.removeChildren(platform)
        }
    }
}
