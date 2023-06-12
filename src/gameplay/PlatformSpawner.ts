import { Collider } from '../collider/Collider'
import { RectangleCollider } from '../collider/RectangleCollider'
import { GameObject } from '../game-object/GameObject'
import { Game } from '../game/Game'
import { Platform } from '../platform/Platform'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'
import { Transform } from '../transform/Transform'

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
    minimumPlatformDistance: number
    spawnParentObject: GameObject
    platformTemplate: PlatformConfig
}

export class PlatformSpawner extends GameObject {
    private spawnParentObject: GameObject
    private spawnCollider: Collider
    private bufferCollider: Collider
    private platformTemplate: PlatformConfig
    private minimumPlatformDistance: number
    private spawned: Platform[]
    private pool: Platform[]

    constructor(config: PlatformSpawnerConfig) {
        const spawnCollider = new RectangleCollider({
            tag: 'PlatformSpawner',
            position: {
                x: config.spawnArea.position.x,
                y: config.spawnArea.position.y - config.minimumPlatformDistance,
            },
            size: { x: config.spawnArea.size.x, y: config.spawnArea.size.y },
        })

        // to aid in spawn area platform distancing
        const bufferCollider = new RectangleCollider({
            tag: 'PlatformSpawner',
            position: {
                x: config.spawnArea.position.x,
                y: config.spawnArea.position.y - config.minimumPlatformDistance,
            },
            size: {
                x: config.spawnArea.size.x,
                y: config.spawnArea.size.y + config.minimumPlatformDistance,
            },
        })

        const despawnCollider = new RectangleCollider({
            tag: 'PlatformSpawner',
            position: { x: config.despawnArea.position.x, y: config.despawnArea.position.y },
            size: { x: config.despawnArea.size.x, y: config.despawnArea.size.y },
        })

        const debugs = [
            // debug buffer collider by creating a gameobject with a sprite rendere to have the same size and position as the collider
            new GameObject({
                components: [
                    new Transform({
                        position: {
                            x: config.spawnArea.position.x,
                            y: config.spawnArea.position.y - config.minimumPlatformDistance,
                        },
                    }),
                    new SpriteRenderer({
                        baseColor: 'green',
                        size: {
                            x: config.spawnArea.size.x,
                            y: config.spawnArea.size.y + config.minimumPlatformDistance,
                        },
                    }),
                ],
                parent: config.parent,
                children: [...(config.children ?? [])],
            }),
            // debug spawn collider by creating a gameobject with a sprite rendere to have the same size and position as the collider
            new GameObject({
                components: [
                    new Transform({
                        position: {
                            x: config.spawnArea.position.x,
                            y: config.spawnArea.position.y - config.minimumPlatformDistance,
                        },
                    }),
                    new SpriteRenderer({
                        baseColor: 'red',
                        size: {
                            x: config.spawnArea.size.x,
                            y: config.spawnArea.size.y,
                        },
                    }),
                ],
                parent: config.parent,
                children: [...(config.children ?? [])],
            }),
            // debug despawn collider by creating a gameobject with a sprite rendere to have the same size and position as the collider
            new GameObject({
                components: [
                    new Transform({
                        position: {
                            x: config.despawnArea.position.x,
                            y: config.despawnArea.position.y,
                        },
                        size: {
                            x: config.despawnArea.size.x,
                            y: config.despawnArea.size.y,
                        },
                    }),
                    new SpriteRenderer({
                        baseColor: 'blue',
                        size: {
                            x: config.despawnArea.size.x,
                            y: config.despawnArea.size.y,
                        },
                    }),
                ],
                parent: config.parent,
                children: [...(config.children ?? [])],
            }),
        ]

        bufferCollider.on('collisionExit', (other) => {
            // if it is a platform and it was created by this spawner
            const gameObject = other.getGameObject()
            if (other.tag === 'Platform' && gameObject instanceof Platform) {
                // if a platform exits, spawn a new one
                this.trySpawnPlatform()
            }
        })

        despawnCollider.on('collisionEnter', (other) => {
            // if it is a platform and it was created by this spawner
            const gameObject = other.getGameObject()
            if (other.tag === 'Platform' && gameObject instanceof Platform) {
                // if a platform enters, despawn it
                this.recyclePlatform(gameObject)
            }
        })

        super({
            startActive: config.startActive,
            parent: config.parent,
            children: [...(config.children ?? []), ...debugs],
            components: [
                ...(config.components ?? []),
                spawnCollider,
                despawnCollider,
                bufferCollider,
            ],
        })

        this.minimumPlatformDistance = config.minimumPlatformDistance
        this.bufferCollider = bufferCollider
        this.spawnCollider = spawnCollider
        this.spawnParentObject = config.spawnParentObject
        this.platformTemplate = config.platformTemplate
        this.spawned = []
        this.pool = []
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
        // if there is no platform colling with the buffer collider
        if (
            !this.bufferCollider.collidingColliders.some((collider) => collider.tag === 'Platform')
        ) {
            this.spawnPlatform(this.game)
        }
    }

    private spawnPlatform(game: Game) {
        // get a random world position inside the spawn collider
        const spawnRange = {
            x: [this.spawnCollider.left, this.spawnCollider.right - this.platformTemplate.size.x],
            y: [this.spawnCollider.top, this.spawnCollider.bottom],
        }

        const spawnPosition = {
            x: Math.random() * (spawnRange.x[1] - spawnRange.x[0]) + spawnRange.x[0],
            y: Math.random() * (spawnRange.y[1] - spawnRange.y[0]) + spawnRange.y[0],
        }

        // calculate local position in the spawn parent object
        spawnPosition.x -= this.spawnParentObject.getTransform().worldPosition.x
        spawnPosition.y -= this.spawnParentObject.getTransform().worldPosition.y

        // get platform from the pool
        let platform = this.pool.pop()

        if (platform === undefined) {
            platform = new Platform({
                ...this.platformTemplate,
                position: spawnPosition,
            })
        } else {
            platform.getTransform().localPosition = spawnPosition
        }

        //   init the platform
        platform.init(game)

        // set active
        platform.setActive(true)

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
        const parent = platform.getParent()
        if (parent !== undefined) {
            parent.removeChildren(platform)
        }
    }
}
