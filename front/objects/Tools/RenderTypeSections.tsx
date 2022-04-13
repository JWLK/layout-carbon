import React, { FC, useMemo } from 'react'
import { MX, MY } from '@objects/Base/AxisSections'
import Wall from '@objects/Tools/WallTypeSections'
import TextDistance from '@objects/Tools/TextDistanceTypeSections'
import Spliter from '@objects/Tools/SpliterTypeSections'

import { ObjPoint, ObjSquare } from 'typings/object'

interface Props {
    base: ObjPoint
    draw: ObjSquare
    textGuideX: number
    splitGuideX: number
    guideMargin: number
    splitText: ObjPoint
    thickness: number
    lineWidth: number
    fontSize: number
}

const RenderLine: FC<Props> = ({
    base,
    draw,
    textGuideX,
    splitGuideX,
    guideMargin,
    splitText,
    thickness,
    lineWidth,
    fontSize,
}) => {
    // console.log(point)
    var point: ObjPoint[] = []

    // p1------p2
    // |        |
    // p4------p3
    var p1: ObjPoint = { x: 0, y: 0 },
        p2: ObjPoint = { x: 0, y: 0 },
        p3: ObjPoint = { x: 0, y: 0 },
        p4: ObjPoint = { x: 0, y: 0 }
    p1.x = base.x - draw.top / 2
    p1.y = base.y + draw.height
    p2.x = base.x + draw.top / 2
    p2.y = base.y + draw.height
    p3.x = base.x + draw.bottom / 2
    p3.y = base.y + 0
    p4.x = base.x - draw.bottom / 2
    p4.y = base.y + 0

    point.push(p1, p2, p3, p4)

    const walls = useMemo(
        () =>
            point.map((_, i) => {
                const a = point[i]
                const b = point[(i + 1) % point.length]
                return [a, b]
            }),
        [point],
    )

    return (
        <g>
            {walls.map(([a, b]) => (
                <Wall
                    key={`wall-${a.x},${a.y}-${b.x},${b.y}`}
                    MX={MX}
                    MY={MY}
                    corner1={a}
                    corner2={b}
                    thickness={thickness}
                />
            ))}
            <TextDistance
                MX={MX}
                MY={MY}
                corner1={p2}
                corner2={p3}
                guideX={textGuideX}
                guideMargin={guideMargin}
                text={Math.abs(p2.y - p3.y)}
                lineWidth={lineWidth}
                fontSize={fontSize}
            />
            <Spliter
                MX={MX}
                MY={MY}
                corner1={p1}
                corner2={p4}
                guideX={splitGuideX}
                guideMargin={guideMargin}
                lineWidth={lineWidth}
                fontSize={fontSize}
                text={splitText.y}
            />
        </g>
    )
}

export default RenderLine
