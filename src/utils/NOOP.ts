export const NOOP: RAFCallback = function (delta: number) {
    console.warn(`NOOP called with delta: ${delta}`)
}
