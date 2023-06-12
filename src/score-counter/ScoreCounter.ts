import { Label } from '../label/Label'
import { ScrollView } from '../scrollView/ScrollView'
import { Transform } from '../transform/Transform'

export class ScoreCounter extends Label {
    private scrollViewTransform: Transform
    constructor(scrollViewObject: ScrollView, config: LabelConfig) {
        super(config)

        this.scrollViewTransform = scrollViewObject.getTranform()
    }

    protected onUpdate = (_delta: number) => {
        this.config.text = `Score: ${Math.floor(
            Math.round(this.scrollViewTransform.localPosition.y / 100)
        )}`
    }
}
