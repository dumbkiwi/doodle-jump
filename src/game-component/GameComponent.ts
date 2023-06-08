import { GameObject } from '../game-object/GameObject'

export abstract class GameComponent {
    public abstract get type(): GameComponentType
    public abstract get gameObject(): GameObject | undefined
    public abstract set gameObject(value: GameObject | undefined)
    public abstract init(gameObject: GameObject): void
    public abstract start(): void
    public abstract update(delta: number): void
    public abstract destroy(): void
}
