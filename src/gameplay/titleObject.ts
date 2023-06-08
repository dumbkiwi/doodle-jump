import { canvasSize } from '../canvasSize'
import { GameObject } from '../game-object/GameObject'
import { Label } from '../label/Label'
import { Transform } from '../transform/Transform'

// title object
export const titleGameObject = new GameObject({
    components: [
        new Transform({
            position: {
                // top right
                x: canvasSize.x - 160,
                y: 40,
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1,
            },
        }),
        new Label({
            text: 'Doodle Jump',
            color: 'black',
            size: '24px',
            fontFamily: 'Consolas',
        }),
    ],
})
