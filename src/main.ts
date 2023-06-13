import { Game } from './game/Game'
import { instructionsGameObject } from './gameplay/instructionObject'
import { backgroundGameObject } from './gameplay/backgroundObject'
import { titleGameObject } from './gameplay/titleObject'
import { fpsCounterGameObject } from './gameplay/fpsCounterObject'
import { player } from './gameplay/playerObject'
import { canvasSize } from './canvasSize'
import { ScrollView } from './scrollView/ScrollView'
import { RectangleCollider } from './collider/RectangleCollider'
import { GameObject } from './game-object/GameObject'
import { Platform } from './platform/Platform'
import { PlatformSpawner } from './gameplay/PlatformSpawner'
import { Transform } from './transform/Transform'
import { ScoreCounter } from './score-counter/ScoreCounter'

const scrollViewGameObject = new ScrollView({
    smoothing: 0.07,
    playerCollider: player.getComponent('Collider') as RectangleCollider,
    triggerArea: {
        size: {
            x: canvasSize.x,
            y: canvasSize.y / 2,
        },
        position: {
            x: 0,
            y: canvasSize.y / 2,
        },
    },
    viewportSize: {
        x: canvasSize.x,
        y: canvasSize.y,
    },
})

// platform template
const platformTemplate: PlatformConfig = {
    spriteRendererConfig: {
        baseColor: 'black',
        size: {
            x: 60,
            y: 15,
        },
    },
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
    bounciness: 18,
} as const

// helper platforms
const defaultPlatform = new Platform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 50, y: canvasSize.y / 2 + 200 },
})

const defaultPlatform2 = new Platform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 150, y: canvasSize.y / 2 },
})

const defaultPlatform3 = new Platform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 + 50, y: canvasSize.y / 2 - 200 },
})

const defaultPlatform4 = new Platform({
    ...platformTemplate,
    position: { x: canvasSize.x / 2 - 100, y: canvasSize.y / 2 - 400 },
})

// get scroll view
const view = scrollViewGameObject.getScrollViewGameObject()

// adds playable objects: platforms and player to the scrollView
const playables = [player, defaultPlatform, defaultPlatform2, defaultPlatform3, defaultPlatform4]
playables.forEach((playable) => {
    view.addChildren(playable)
})

// platform spawner
const spawner = new PlatformSpawner({
    canvasSize: canvasSize,
    spawnArea: {
        size: {
            x: canvasSize.x - 40,
            y: 100, // variability between each random y position
        },
        position: {
            x: canvasSize.x / 2 - (canvasSize.x - 40) / 2,
            y: -100, // must match with the negative of spawnParentObject's y position
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
    minimumPlatformDistance: 20, // how far apart does each platform have to be to start spawning
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

// game
// order in gameObjects is also the rendering order
const doodle = new Game(
    [
        backgroundGameObject,
        scrollViewGameObject,
        spawner,
        scoreCounterObject,
        fpsCounterGameObject,
        titleGameObject,
        instructionsGameObject,
    ],
    canvasSize
)

doodle.init()

doodle.start()
