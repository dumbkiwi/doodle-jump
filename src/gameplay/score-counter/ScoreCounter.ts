import { GameObject, IGameObject } from '../../engine/game-object/GameObject'
import { Label } from '../../engine/game-component/label/Label'
import { Transform } from '../../engine/game-component/transform/Transform'
import { GameComponentDecorator } from '@/engine/game-component/GameComponent'
import { Player } from '@/gameplay/player/Player'

export class ScoreCounter extends GameComponentDecorator {
    private scrollViewTransform: Transform
    private label: Label
    private player: Player

    constructor(scrollViewObject: GameObject, player: Player, config: LabelConfig) {
        const label = new Label(config)
        super(label)

        this.label = label
        this.scrollViewTransform = scrollViewObject.getTransform()
        this.player = player
    }

    public init(gameObject: IGameObject): void {
        super.init(gameObject)

        this.on('update', () => {
            this.label.config.text = `Score: ${Math.floor(
                Math.round(-this.player.getScore() / 10)
            )}`
        })
    }
}
