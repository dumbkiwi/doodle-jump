import { GameObject, GameObjectDecorator } from '../engine/game-object/GameObject'
import { SpriteRenderer } from '../engine/sprite-renderer/SpriteRenderer'
import { Transform } from '../engine/transform/Transform'

import backgroundImage from '#/doodle-jump/bck@2x.png'
import bottomImage from '#/doodle-jump/bottom-tile@2x.png'
import { RectangleCollider } from '@/engine/collider/RectangleCollider'
import { Game } from '@/engine/game/Game'

// background object
export class BackgroundGameObject extends GameObjectDecorator {
    private collider: RectangleCollider
    private transform: Transform
    private scrollDistance: number
    private smoothing: number
    private startingPosition

    constructor(config: {
        onGameOverScrollDistance: number
        smoothing: number
    }) {
        // background collider
        const collider = new RectangleCollider({
            tag: 'Trigger',
            size: {
                x: 400,
                y: 100,
            },
            position: {
                x: 0,
                y: 0,
            },
            // debug: true,
        })
        const obj = new GameObject({
            components: [
                collider
            ],
            children: [
                new GameObject({
                    components: [
                        // black background
                        new Transform({
                            position: {
                                x: 0,
                                y: 0,
                            },
                        }),
                        new SpriteRenderer({
                            layer: 'background',
                            size: {
                                x: 1000,
                                y: 1000,
                            },
                            baseColor: 'black',
                        }),
                    ],
                }),
                new GameObject({
                    components: [
                        // background transform
                        new Transform({
                            position: {
                                x: 0,
                                y: 0,
                            },
                        }),
                        new SpriteRenderer({
                            layer: 'background',
                            size: {
                                x: 400,
                                y: 600,
                            },
                            baseColor: 'white',
                            imageSrc: backgroundImage,
                        }),
                    ],
                }),
                new GameObject({
                    components: [
                        // background transform
                        new Transform({
                            position: {
                                x: 0,
                                y: 600,
                            },
                        }),
                        new SpriteRenderer({
                            layer: 'background',
                            size: {
                                x: 400,
                                y: 600,
                            },
                            baseColor: 'white',
                            imageSrc: backgroundImage,
                        }),
                    ],
                }),
                new GameObject({
                    components: [
                        // out of view bottom
                        new Transform({
                            position: {
                                x: 0,
                                y: 1200,
                            },
                        }),
                        new SpriteRenderer({
                            layer: 'background',
                            size: {
                                x: 400,
                                y: 100,
                            },
                            baseColor: 'white',
                            imageSrc: bottomImage,
                        }),
        
                    ]
                })
            ],
        })
        
        super(obj)
        
        this.collider = collider
        this.transform = obj.getTransform()
        this.scrollDistance = config.onGameOverScrollDistance
        this.smoothing = config.smoothing
        this.startingPosition = this.transform.localPosition.y

    }

    private move() {
        if (this.collider.velocity.y > 0) {
        this.transform.localPosition.y -= this.collider.velocity.y * this.smoothing
        this.collider.velocity.y *= 1 - this.smoothing
        }
    }

    public override init(game: Game) {
        super.init(game)
        this.on("update", () => {
            this.move()
        })
    }

    public setGameOver(state: boolean) {
        if (state) {
            this.collider.velocity.y = this.scrollDistance
        } else {
            this.collider.velocity.y = 0
            this.transform.localPosition.y = this.startingPosition
        }
    }
}

