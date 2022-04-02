import React, { FC, useMemo } from 'react'
import Wall from '@objects/Tools/Wall'
import Corner from '@objects/Tools/Corner'

import { ObjPoint } from 'typings/db'

interface Props {
    id: string
    coords: ObjPoint[]
}

const WALL_THICKNESS = 100

const RenderLine: FC<Props> = ({ id, coords }) => {
    const walls = useMemo(
        () =>
            coords.map((_, i) => {
                const a = coords[i]
                const b = coords[(i + 1) % coords.length]
                return [a, b]
            }),
        [coords],
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
            {coords.map((coord) => (
                <Corner
                    key={`corner-${coord.x},${coord.y}`}
                    at={coord}
                    thickness={WALL_THICKNESS}
                />
            ))}
        </g>
    )
}

export default RenderLine
