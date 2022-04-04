import React, { FC, useMemo } from 'react'
import { ObjPoint, ObjSquare, ObjData } from 'typings/db'

import RenderTypeA from '@objects/Tools/RenderTypeA'

interface Props {
    base: ObjPoint
    draws: ObjSquare[]
    margin: number
}

const Sections: FC<Props> = ({ base, draws, margin }) => {
    const saved: number[] = [base.y]
    const baseShift: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = base.x
                const y = saved[index] + (index > 0 ? draws[index - 1].height : 0) + margin
                saved.push(y)
                return { x: x, y: y }
            }),
        [],
    )
    return (
        <>
            {draws.map((draw, index) => (
                <RenderTypeA
                    key={index}
                    base={baseShift[index]}
                    draw={draw}
                    guideX={base.x + draws[0].bottom / 2}
                />
            ))}
        </>
    )
}

export default Sections
