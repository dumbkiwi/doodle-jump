import { NOOP } from '../utils/NOOP'

export class RequestAnimationFrame {
    public isRunning: boolean
    /* adds delay and the option to use setTimeout
     instead of RAF to provide delayed start */
    public timeOutID: number | null
    public callback: RAFCallback

    constructor() {
        this.isRunning = false
        this.timeOutID = null
        this.callback = NOOP
        this.step = this.step.bind(this) // bind the step function to the RAF instance
    }

    public step(time: number) {
        this.callback(time)

        if (this.isRunning) {
            this.timeOutID = window.requestAnimationFrame(this.step)
        }
    }

    public start(callback: RAFCallback) {
        if (this.isRunning) {
            return
        }

        this.isRunning = true
        this.callback = callback
        this.timeOutID = window.requestAnimationFrame(this.step)
    }

    public stop() {
        this.isRunning = false

        if (this.timeOutID) {
            window.cancelAnimationFrame(this.timeOutID)
            this.timeOutID = null
        } else {
            console.warn('RequestAnimationFrame: stop() called before start()')
        }
    }

    public destroy() {
        this.stop()
        this.callback = NOOP
    }
}
