export class RequestAnimationFrame {
    public isRunning = false
    public timeOutID: number | undefined = undefined
    public callback: ((time: number) => void) | undefined = undefined

    constructor() {
        // bind the step function to the RAF instance
        this.step = this.step.bind(this)
    }

    private step(time: number) {
        this.callback?.(time)

        if (this.isRunning) {
            this.timeOutID = window.requestAnimationFrame(this.step)
        }
    }

    public start(callback: (time: number) => void) {
        if (this.isRunning) {
            console.warn('RequestAnimationFrame: start() called while already running')
            return
        }

        this.callback = callback
        this.timeOutID = window.requestAnimationFrame(this.step)

        this.isRunning = true
    }

    public stop() {
        if (!this.isRunning || !this.timeOutID) {
            console.warn('RequestAnimationFrame: stop() called while not running')
            return
        }

        // cancel any pending animation frame requests
        window.cancelAnimationFrame(this.timeOutID)
        this.timeOutID = undefined

        this.isRunning = false
    }

    public destroy() {
        this.stop()
        this.callback = undefined
    }
}
