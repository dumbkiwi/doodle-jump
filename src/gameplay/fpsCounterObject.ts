import { FPSCounter } from './fpsCounter/FPSCounter'
import { GameObject } from '../engine/game-object/GameObject'
import { canvasSize } from '../canvasSize'
import { Transform } from '../engine/game-component/transform/Transform'

// fps counter object
export const fpsCounterGameObject = new GameObject({
    components: [
        new Transform({
            position: {
                // bottom right
                x: canvasSize.x - 80,
                y: canvasSize.y - 20,
            },
            rotation: 0,
            scale: {
                x: 1,
                y: 1,
            },
        }),
        new FPSCounter({
            color: 'black',
            size: '16px',
            fontFamily: 'Consolas',
        }),
    ],
})
