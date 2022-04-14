import React, { FC } from 'react'
import { polarToCartesian } from '@objects/Tools/Cartesian'

interface props {
    angle: number
    range: number
}

const Sector: FC<props> = ({ angle, range }) => {
    let arcStart = polarToCartesian(range, -angle / 2)
    let arcEnd = polarToCartesian(range, angle / 2)
    let largeArc = angle > 180 ? '1' : '0'
    return (
        <path
            d={`
                M0,0
                L${arcStart.x},${arcStart.y}
                A${range}, ${range}, 0, ${largeArc}, 1, ${arcEnd.x}, ${arcEnd.y}
                Z
            `}
            // fill="rgba(255,255,255,0.5)"
            // fill-opacity="0.5"
            stroke="rgba(255,255,255,0.5)"
            stroke-linecap="round"
            stroke-width="10"
            stroke-dasharray="5,5"
            fill="none"
        />
    )
}

export default Sector
