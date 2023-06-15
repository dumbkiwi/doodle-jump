type ColliderType = 'RectangleCollider'

type ColliderConfig = {
    tag: ColliderTag
    position: Vector2D
    size: Vector2D

    onCollisionEnter?: (other: Collider) => void | undefined
    onCollisionExit?: (other: Collider) => void | undefined
    onCollisionStay?: (other: Collider) => void | undefined
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
