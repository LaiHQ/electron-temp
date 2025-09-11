
export function debounce(fn: Function, delay: number) {
    let timer = 0
    return function (this: any, ...args: any[]) {
        const context = this
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}