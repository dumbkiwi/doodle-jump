import { Game } from './engine/game/Game'
import { instructionsGameObject } from './gameplay/instructionObject'
import { BackgroundGameObject } from './gameplay/backgroundObject'
import { titleGameObject } from './gameplay/titleObject'
import { fpsCounterGameObject } from './gameplay/fpsCounterObject'
import { player } from './gameplay/playerObject'
import { canvasSize } from './canvasSize'
import { ScrollView } from './engine/game-object/scrollView/ScrollView'
import { RectangleCollider } from './engine/game-component/collider/RectangleCollider'
import { GameObject } from './engine/game-object/GameObject'
import { BasicPlatform } from './platform/BasicPlatform'
import { PlatformSpawner } from './gameplay/PlatformSpawner'
import { Transform } from './engine/game-component/transform/Transform'
import { ScoreCounter } from './score-counter/ScoreCounter'
import { MovingPlatform } from './platform/MovingPlatform'
import { Wall } from './gameplay/wallObject'
import { GameOverTrigger } from './gameplay/gameOverObject'

const scrollViewGameObject = new ScrollView({
    smoothing: 0.1,
    playerCollider: player.getComponent('Collider') as RectangleCollider,
    triggerArea: {
        // half of the upper part of the screen
        size: {
            x: canvasSize.x,
            y: canvasSize.y / 2.5,
        },
        position: {
            x: 0,
            y: 0,
        },
    },
    viewportSize: canvasSize,
})

// platform template
const platformTemplate: PlatformConfig = {
    // spriteRendererConfig: {
    //     baseColor: 'black',
    //     size: {
    //         x: 60,
    //         y: 15,
    //     },
    // },
    scrollView: scrollViewGameObject,
    scrollViewPadding: 50,
    position: {
        x: 0,
        y: 0,
    },
    color: 'black',
    size: {
        x: 60,
        y: 20,
    },
    bounciness: 54,
} as const

// helper platforms
const defaultPlatform = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 50, y: canvasSize.y / 2 + 190 },
})

const defaultPlatform2 = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 150, y: canvasSize.y / 2 + 100 },
})

const defaultPlatform3 = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 + 50, y: canvasSize.y / 2 },
})

const defaultPlatform4 = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 100, y: canvasSize.y / 2 - 100 },
})

const defaultPlatform5 = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 + 100, y: canvasSize.y / 2 - 200 },
})

const defaultPlatform6 = new BasicPlatform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 + 50, y: canvasSize.y / 2 - 400 },
})

// get scroll view
const view = scrollViewGameObject.getScrollViewGameObject()

// adds playable objects: platforms and player to the scrollView
const playables = [
    player,
    defaultPlatform,
    defaultPlatform2,
    defaultPlatform3,
    defaultPlatform4,
    defaultPlatform5,
    defaultPlatform6,
]
playables.forEach((playable) => {
    view.addChildren(playable)
})

// platform spawner
const spawner = new PlatformSpawner({
    canvasSize: canvasSize,
    spawnArea: {
        size: {
            x: canvasSize.x - 40,
            y: 40, // variability between each random y position 40
        },
        position: {
            x: canvasSize.x / 2 - (canvasSize.x - 40) / 2,
            y: -40, // must match with the negative of spawnParentObject's y position to stay at the top of the screen 40
        },
    },
    despawnArea: {
        size: {
            x: canvasSize.x,
            y: canvasSize.y,
        },
        position: {
            x: 0,
            y: canvasSize.y + 10, // move off screen a bit to hide the disappearing platforms
        },
    },
    minimumPlatformDistance: 20, // how far apart does each platform have to be to start spawning 20
    spawnParentObject: view,
    platformTemplate: platformTemplate,
})

// score counter
const scoreCounterObject = new GameObject({
    components: [
        new Transform({
            position: {
                // top left
                x: 20,
                y: 40,
            },
        }),
        new ScoreCounter(view, {
            color: 'black',
            size: '24px',
            fontFamily: 'Consolas',
        }),
    ],
})

// test moving platform
// const movingPlatform = new MovingPlatform({
//     ...platformTemplate,
//     position: { x: canvasSize.x / 2 - 50, y: canvasSize.y / 2 + 190 },
//     startingDirection: 'left',
//     speed: 5,
// })

// wall
const wall = new Wall({
    teleportTolerance: 2,
})

const backgroundGameObject = new BackgroundGameObject({
    onGameOverScrollDistance: 750,
    smoothing: 0.1,
})

// game over trigger
const gameOverTrigger = new GameOverTrigger({
    scrollview: scrollViewGameObject,
    background: backgroundGameObject,
    backgroundHeight: 600,
})

// game
// order in gameObjects is also the rendering order
const doodle = new Game(
    [
        backgroundGameObject,
        gameOverTrigger,
        scrollViewGameObject,
        wall,
        spawner,
        // movingPlatform,
        scoreCounterObject,
        fpsCounterGameObject,
        titleGameObject,
        instructionsGameObject,
    ],
    canvasSize
)

doodle.init()

doodle.start()
