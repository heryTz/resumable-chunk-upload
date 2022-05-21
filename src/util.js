export function removeTrailingSlash(str) {
    return str.replace(/\/+$/, '')
}

export function queryParams(query) {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
}

let throttlePause = false
export function throttle(callback, time = 0) {
    return (...args) => {
        if (throttlePause) return
        throttlePause = true
        setTimeout(() => {
            callback.apply(null, args)
            throttlePause = false
        }, time)
    }
}
