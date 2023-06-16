import { canvasSize } from '@/canvasSize'
import { SpriteRenderer } from '@/engine/game-component/sprite-renderer/SpriteRenderer'
import { GameObject, GameObjectDecorator, IGameObject } from '@/engine/game-object/GameObject'
import startingImage from '#/doodle-jump/Default@2x.png'
import playButtonImage from '#/doodle-jump/play@2x.png'
import { Transform } from '@/engine/game-component/transform/Transform'
import { Game } from '@/engine/game/Game'

export default class OverlayObject extends GameObjectDecorator {
    public overlayObject: IGameObject
    constructor() {
        const obj = new GameObject({
            components: [
                new SpriteRenderer({
                    baseColor: 'white',
                    layer: 'ui',
                    size: canvasSize,
                    imageSrc: startingImage,
                }),
            ],
            children: [
                new GameObject({
                    components: [
                        new Transform({
                            position: {
                                x: canvasSize.x / 2 - 95,
                                y: canvasSize.y / 2 - 120,
                            },
                            rotation: 0,
                            scale: {
                                x: 1,
                                y: 1,
                            },
                        }),
                        new SpriteRenderer({
                            baseColor: 'white',
                            layer: 'ui',
                            size: {
                                x: 100,
                                y: 45,
                            },
                            imageSrc: playButtonImage,
                        }),
                    ],
                }),
            ],
        })

        super(obj)

        this.overlayObject = obj
    }

    init(game: Game): void {
        super.init(game)

        this.overlayObject.on('start', () => {
            this.overlayObject.getGame()?.canvas.addEventListener('click', (e) => {
                const canvas = this.overlayObject.getGame()?.canvas
                const rect = canvas?.getBoundingClientRect()

                const x = e.clientX - (rect?.left ?? 0)
                const y = e.clientY - (rect?.top ?? 0)

                if (x > 160 && x < 330 && y > 290 && y < 353) {
                    console.log('clicked')
                    this.setActive(false)
                }
            })
        })
    }
}
