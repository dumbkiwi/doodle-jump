type RenderingLayer =
    | 'background'
    | 'layer_1'
    | 'layer_2'
    | 'layer_3'
    | 'layer_4'
    | 'layer_5'
    | 'foreground'
    | 'ui'

type RendererConfig = {
    layer: string[]
}
