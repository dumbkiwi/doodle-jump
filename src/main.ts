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
            x: 100,
            y: 20,
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
        x: 100,
        y: 20,
    },
    bounciness: 8,
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
            x: canvasSize.x - 100,
            y: 240,
        },
        position: {
            x: 0,
            y: -240,
        },
    },
    despawnArea: {
        size: {
            x: canvasSize.x,
            y: canvasSize.y,
        },
        position: {
            x: 0,
            y: canvasSize.y,
        },
    },
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
        new ScoreCounter(scrollViewGameObject, {
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
        instructionsGameObject,
        titleGameObject,
        fpsCounterGameObject,
        scoreCounterObject,
        scrollViewGameObject,
        spawner,
    ],
    canvasSize
)

doodle.init()

doodle.start()
