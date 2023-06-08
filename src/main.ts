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
import { Platform, PlatformConfig } from './platform/Platform'
import { SpriteRenderer } from './sprite-renderer/SpriteRenderer'
import { PlatformSpawner } from './gameplay/PlatformSpawner'
import { Transform } from './transform/Transform'
import { ScoreCounter } from './score-counter/ScoreCounter'

// ceiling to simulate camera movement
const ceilingGameObject = new GameObject({
    components: [
        new RectangleCollider({
            tag: 'Ceiling',
            x: 0,
            y: -canvasSize.y,
            width: canvasSize.x,
            height: canvasSize.y / 6,
        }),
    ],
})

const scrollViewGameObject = new ScrollView({
    smoothing: 0.07,
    playerCollider: player.getComponent('Collider') as RectangleCollider,
    ceilingObject: ceilingGameObject,
    viewportSize: {
        x: canvasSize.x,
        y: canvasSize.y,
    },
})

// platform template
const platformTemplate: PlatformConfig = {
    scrollView: scrollViewGameObject,
    scrollViewPadding: 50,
    x: 0,
    y: 0,
    color: 'black',
    width: 100,
    height: 20,
    bounciness: 8,
} as const

// helper platforms
const defaultPlatform = new Platform({
    ...platformTemplate,
    x: canvasSize.x / 2 - 50,
    y: canvasSize.y / 2 + 200,
})

const defaultPlatform2 = new Platform({
    ...platformTemplate,
    x: canvasSize.x / 2 - 150,
    y: canvasSize.y / 2,
})

const defaultPlatform3 = new Platform({
    ...platformTemplate,
    x: canvasSize.x / 2 + 50,
    y: canvasSize.y / 2 - 200,
})

const defaultPlatform4 = new Platform({
    ...platformTemplate,
    x: canvasSize.x / 2 - 100,
    y: canvasSize.y / 2 - 400,
})

// adds playable objects: platforms and player to the scrollView
const playables = [player, defaultPlatform, defaultPlatform2, defaultPlatform3, defaultPlatform4]
playables.forEach((playable) => {
    scrollViewGameObject.addGameObject(playable)
})

// platform spawner
// spawner's spawn collider
const spawnColliderGameObject = new GameObject({
    components: [
        new Transform({
            position: {
                x: 0,
                y: -240,
            },
        }),
        new RectangleCollider({
            tag: 'PlatformSpawner',
            x: 0,
            // above the screen
            y: -240,
            width: canvasSize.x - 100,
            height: 240,
        }),
    ],
})

// spawner's destroy collider
const destroyColliderGameObject = new GameObject({
    components: [
        new Transform({
            position: {
                x: 0,
                y: canvasSize.y + 100,
            },
        }),
        new RectangleCollider({
            tag: 'PlatformSpawner',
            x: 0,
            y: canvasSize.y,
            width: canvasSize.x,
            height: canvasSize.y,
        }),
        // debug sprite
        new SpriteRenderer({
            baseColor: 'red',
            size: {
                x: canvasSize.x,
                y: canvasSize.y,
            },
        }),
    ],
})

// platform spawner
const platformSpawnerGameObject = new PlatformSpawner({
    scrollViewObject: scrollViewGameObject,
    spawnParentObject: scrollViewGameObject,
    spawnColliderObject: spawnColliderGameObject,
    destroyColliderObject: destroyColliderGameObject,
    platformTemplate,
    minimumDistanceBetweenPlatforms: 50,
    minimunNumberOfPlatforms: 1,
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
        platformSpawnerGameObject,
        spawnColliderGameObject,
        destroyColliderGameObject,
        ceilingGameObject,
    ],
    canvasSize
)

doodle.init()

doodle.start()
