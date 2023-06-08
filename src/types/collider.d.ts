type ColliderType = 'RectangleCollider'

type ColliderConfig = {
    tag: ColliderTag
    x: number
    y: number
    width: number
    height: number
    top?: number
    bottom?: number
    left?: number
    right?: number
    centerX?: number
    centerY?: number
    halfWidth?: number
    halfHeight?: number
    onCollisionEnter?: (other: Collider) => void | undefined
    onCollisionExit?: (other: Collider) => void | undefined
    onCollisionStay?: (other: Collider) => void | undefined
}

type ColliderTag = 'Default' | 'Player' | 'Platform' | 'Wall' | 'Ceiling' | 'PlatformSpawner'
