import { Label } from '../label/Label'
import { ScrollView } from '../scrollView/ScrollView'

export class ScoreCounter extends Label {
    private scrollViewObject: ScrollView
    constructor(scrollViewObject: ScrollView, config: LabelConfig) {
        super(config)

        this.scrollViewObject = scrollViewObject
    }

    public override update(delta: number) {
        super.update(delta)

        this.config.text = `Score: ${Math.floor(
            Math.round(this.scrollViewObject.transform.localPosition.y / 100)
        )}`
    }
}
