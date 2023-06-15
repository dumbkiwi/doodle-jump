type ScrollViewConfig = Partial<GameObjectConfig> & {
    triggerArea: {
        size: Vector2D
        position: Vector2D
    }
    smoothing: number
    playerCollider: RectangleCollider
    viewportSize: Vector2D
}
