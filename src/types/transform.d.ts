type TransformConfig = {
    position?: Vector2D
    size?: Vector2D
    rotation?: number
    scale?: Vector2D
    anchor?: Vector2D
    start?: () => void | undefined
    update?: (delta: number) => void | undefined
    destroy?: () => void | undefined
}
