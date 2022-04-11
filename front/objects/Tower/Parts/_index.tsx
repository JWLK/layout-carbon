import React, { FC, useMemo } from 'react'
import { MX, MY } from '@objects/Base/AxisBase'
import { ObjPoint, ObjSquare } from 'typings/object'

import RenderTypeA from '@objects/Tools/RenderTypeA'
import TextDistance from '@objects/Tools/TextDistanceTypeA'

interface Props {
    center: ObjPoint
    draws: ObjSquare[]
    margin: number
}

const Parts: FC<Props> = ({ center, draws, margin }) => {
    const savedShift: number[] = [center.y]
    const savedText: number[] = [0]
    const savedSum: number[] = [center.y]
    const centerShiftY: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = center.x
                const y = savedShift[index] + (index > 0 ? draws[index - 1].height + margin : 0)
                savedShift.push(y)
                return { x: x, y: y }
            }),
        [],
    )
    const splitText: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = center.x
                const y = savedText[index] + draws[index].height
                savedText.push(y)
                return { x: x, y: y }
            }),
        [],
    )
    return (
        <>
            {draws.map((draw, index) => (
                <RenderTypeA
                    key={index}
                    base={centerShiftY[index]}
                    draw={draw}
                    textGuideX={MX + center.x + draws[0].bottom / 2}
                    splitGuideX={MX + center.x - draws[0].bottom / 2}
                    splitText={splitText[index]}
                />
            ))}
            <TextDistance
                corner1={{
                    x: center.x + draws[0].bottom / 2 + 3000,
                    y: centerShiftY[centerShiftY.length - 1].y + draws[draws.length - 1].height,
                }}
                corner2={{
                    x: center.x + draws[0].bottom / 2 + 3000,
                    y: centerShiftY[0].y,
                }}
                guideX={center.x + draws[0].bottom / 2 + 6000}
                text={splitText[splitText.length - 1].y}
                fontSize={500}
            />
        </>
    )
}

export default Parts
