import { GameObject } from '../engine/game-object/GameObject'
import { Label } from '../engine/label/Label'
import { canvasSize } from '../canvasSize'
import { Transform } from '../engine/transform/Transform'

// instructions object
export const instructionsGameObject = new GameObject({
    components: [
        // instructions transform
        new Transform({
            position: {
                // bottom left
                x: 20,
                y: canvasSize.y - 20,
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1,
            },
        }),
        // instructions label
        new Label({
            text: 'a/d or ← → to move.',
            color: 'black',
            size: '16px',
            fontFamily: 'Consolas',
        }),
    ],
})
