import React, { FC } from 'react'
import { ViewScale, ViewMargin } from '@objects/Base/AxisBase'

import { ObjPoint, ObjSquare } from 'typings/object'

interface Props {
    corner1: ObjPoint
    corner2: ObjPoint
    fontSize: number
}
const TextDistance: FC<Props> = ({ corner1, corner2, fontSize }) => {
    return (
        <text
            x={ViewMargin + (corner1.x + corner2.x) / 2 + 200}
            y={ViewScale - (corner1.y + corner2.y) / 2 + 200}
            fill="white"
            fontSize={fontSize}
        >
            {Math.sqrt((corner2.x - corner1.x) ** 2 + (corner2.y - corner1.y) ** 2)}
        </text>
    )
}

export default TextDistance
