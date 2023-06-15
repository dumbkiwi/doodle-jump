import { GameObject } from '../engine/game-object/GameObject'
import { Label } from '../engine/label/Label'
import { Transform } from '../engine/transform/Transform'

export class ScoreCounter extends Label {
    private scrollViewTransform: Transform
    constructor(scrollViewObject: GameObject, config: LabelConfig) {
        super(config)

        this.scrollViewTransform = scrollViewObject.getTransform()
    }

    protected onUpdate = (_delta: number) => {
        this.render(this.getGameObject()?.getGame()?.context as CanvasRenderingContext2D)
        this.config.text = `Score: ${Math.floor(
            Math.round(this.scrollViewTransform.localPosition.y / 100)
        )}`
    }
}
