import React, { FC, useMemo } from 'react'
import Wall from '@objects/Tools/WallTypeA'
import TextDistance from '@objects/Tools/TextDistanceTypeA'

import { ObjPoint, ObjSquare } from 'typings/db'

interface Props {
    base: ObjPoint
    draw: ObjSquare
}

const WALL_THICKNESS = 10

const RenderLine: FC<Props> = ({ base, draw }) => {
    // console.log(point)
    var point: ObjPoint[] = []
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
        [draw],
    )

    return (
        <g>
            {walls.map(([a, b]) => (
                <Wall
                    key={`wall-${a.x},${a.y}-${b.x},${b.y}`}
                    corner1={a}
                    corner2={b}
                    thickness={WALL_THICKNESS}
                />
            ))}
            {walls.map(([a, b]) => (
                <TextDistance draw={draw} corner1={a} corner2={b} fontSize={350} />
            ))}
        </g>
    )
}

export default RenderLine
