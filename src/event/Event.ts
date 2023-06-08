export class EventManager<T extends GameEvent, A extends Object | undefined = undefined> {
    private _listeners: {
        [key: string]: {
            once: boolean
            callback: (...args: A[]) => void
        }[]
    }
    constructor() {
        this._listeners = {}
    }

    public addListener(
        event: T,
        listener: (...args: A[]) => void,
        config: { once: boolean }
    ): void {
        this._listeners[event] = this._listeners[event] ?? []
        this._listeners[event].push({
            once: config.once,
            callback: listener,
        })
    }

    public removeListener(event: T, listener: (...args: A[]) => void): void {
        // remove listener from event array throw error if not found
        const index = this._listeners[event].findIndex((l) => l.callback === listener)

        if (index === -1) {
            throw new Error('Listener not found')
        }

        this._listeners[event].splice(index, 1)
    }

    public on(event: T, listener: (...args: A[]) => void): void {
        this.addListener(event, listener, { once: false })
    }

    public once(event: T, listener: (...args: A[]) => void): void {
        this.addListener(event, listener, { once: true })
    }

    public off(event: T, listener: (...args: A[]) => void): void {
        this.removeListener(event, listener)
    }

    public emit(event: T, ...args: A[]): void {
        this.invoke(event, ...args)
    }

    private invoke(event: T, ...args: A[]): void {
        for (const listener of this._listeners[event] ?? []) {
            listener.callback(...args)
            if (listener.once) {
                this.removeListener(event, listener.callback)
            }
        }
    }
}
