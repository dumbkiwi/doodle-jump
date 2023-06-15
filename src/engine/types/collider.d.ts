type ColliderType = 'RectangleCollider'

type ColliderConfig = {
    tag: ColliderTag
    position: Vector2D
    size: Vector2D
}

type ColliderTag =
    | 'Default'
    | 'Player'
    | 'Platform'
    | 'Wall'
    | 'Ceiling'
    | 'PlatformSpawner'
    | 'Trigger'
    | 'GameOverTrigger'
