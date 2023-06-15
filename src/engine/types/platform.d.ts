type PlatformConfig = Partial<GameObjectConfig> & {
    scrollView?: ScrollView
    scrollViewPadding?: number
    position: Vector2D
    size: Vector2D
    color: string
    bounciness: number
}

type MovingPlatformConfig = PlatformConfig & {
    startingDirection: 'left' | 'right'
    speed: number
}
