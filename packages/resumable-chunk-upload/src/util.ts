export function removeTrailingSlash(str: string): string {
    return str.replace(/\/+$/, '')
}

export function queryParams(query: Record<string, any>): string {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
}

let throttlePause = false
export function throttle<T extends Function>(callback: T, time = 0) {
    return (...args: any[]) => {
        if (throttlePause) return
        throttlePause = true
        setTimeout(() => {
            callback.apply(null, args)
            throttlePause = false
        }, time)
    }
}
