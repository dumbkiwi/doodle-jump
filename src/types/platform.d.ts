type PlatformConfig = Partial<GameObjectConfig> & {
    spriteRendererConfig: SpriteRendererConfig
    scrollView?: ScrollView
    scrollViewPadding?: number
    position: Vector2D
    size: Vector2D
    color: string
    bounciness: number
}
