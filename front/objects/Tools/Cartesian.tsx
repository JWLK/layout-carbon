export const REFERENCE_DIRECTION = +90

export const polarToCartesian = (distance: number, angleInDegrees: number) => {
    let angleInRadians = toRadian(REFERENCE_DIRECTION + angleInDegrees)
    return {
        x: distance * Math.cos(angleInRadians),
        y: distance * Math.sin(angleInRadians),
    }
}

export const toRadian = (degrees: number) => {
    var pi = Math.PI
    return degrees * (pi / 180)
}

export const toAngle = (radians: number) => {
    var pi = Math.PI
    return radians * (180 / pi)
}
