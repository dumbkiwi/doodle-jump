import { canvasSize } from "@/canvasSize"
import { RectangleCollider } from "@/engine/collider/RectangleCollider"
import { GameObject, GameObjectDecorator } from "@/engine/game-object/GameObject"
import { BackgroundGameObject } from "./backgroundObject"
import { ScrollView } from "@/engine/scrollView/ScrollView"
import { Collider } from "@/engine/collider/Collider"

export class GameOverTrigger extends GameObjectDecorator {
    private background: BackgroundGameObject
    private scrollview: ScrollView
    private collider: Collider

    constructor(config: {
        background: BackgroundGameObject
        backgroundHeight: number
        scrollview: ScrollView
    }) {
        const gameOverCollider = new RectangleCollider({
            tag: 'GameOverTrigger',
            position: {
                x: 0,
                y: config.backgroundHeight,
            },
            size: {
                x: canvasSize.x,
                y: 1,
            },
            // debug: true
        })

        gameOverCollider.on('collisionEnter', (other) => {
            if (other.tag === 'Player') {
                console.log('game over')
                
                this.background.setGameOver(true)
                this.scrollview.setScrollDistance(-600)
                
                this.collider.setActive(false)
            }
        })

        const gameObject = new GameObject({
            components: [
                // collider beneath the screen
                gameOverCollider,     
            ],
        })

        super(gameObject)

        this.background = config.background
        this.scrollview = config.scrollview
        this.collider = gameOverCollider
    }
}
