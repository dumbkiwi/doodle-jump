type SpriteRendererConfig = {
    layer: RenderingLayer
    size: Vector2D
    baseColor: string
    imageSrc?: string
}

type Canvas2D = {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
}
