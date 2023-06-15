type PlayerConfig = Partial<GameObjectConfig> & {
    size: Vector2D
    speed: number
    mass: number
    gravity: number
    drag: number
}
