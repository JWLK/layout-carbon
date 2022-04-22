import React, { FC } from 'react'
import { polarToCartesian } from '@objects/Tools/Cartesian'

interface props {
    angle: number
    rangeTop: number
    rangeBottom: number
    color: string
    strokeSize: number
}

const Paper: FC<props> = ({ angle, rangeTop, rangeBottom, color, strokeSize }) => {
    let arcTopStart = polarToCartesian(rangeTop, -angle / 2)
    let arcTopEnd = polarToCartesian(rangeTop, angle / 2)
    let arcBtmStart = polarToCartesian(rangeBottom, -angle / 2)
    let arcBtmEnd = polarToCartesian(rangeBottom, angle / 2)

    let largeArc = angle > 180 ? '1' : '0'
    return (
        <path
            d={`
                M${arcTopStart.x},${arcTopEnd.y}
                A${rangeTop}, ${rangeTop}, 0, ${largeArc}, 1, ${arcTopEnd.x}, ${arcTopEnd.y}
                L${arcBtmEnd.x},${arcBtmEnd.y}
                A${rangeBottom}, ${rangeBottom}, 0, ${largeArc}, 0, ${arcBtmStart.x}, ${arcBtmStart.y}
                Z
            `}
            // fill="rgba(255,255,255,0.5)"
            // fill-opacity="0.5"
            stroke={color}
            stroke-linecap="butt"
            stroke-width={strokeSize}
            fill="none"
        />
    )
}

export default Paper
