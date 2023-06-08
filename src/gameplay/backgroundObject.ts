import { GameObject } from '../game-object/GameObject'
import { SpriteRenderer } from '../sprite-renderer/SpriteRenderer'
import { Transform } from '../transform/Transform'

// background object
export const backgroundGameObject = new GameObject({
    components: [
        // background transform
        new Transform({
            position: {
                x: 0,
                y: 0,
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1,
            },
        }),
        new SpriteRenderer({
            size: {
                x: 1000,
                y: 1000,
            },
            baseColor: 'white',
        }),
    ],
})
