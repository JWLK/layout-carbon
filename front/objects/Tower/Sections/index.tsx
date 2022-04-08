import React, { FC, useMemo } from 'react'
import { MX, MY } from '@objects/Base/AxisSections'
import { ObjPoint, ObjSquare } from 'typings/object'

import Render from '@objects/Tools/RenderTypeSections'
import TextDistance from '@objects/Tools/TextDistanceTypeSections'

interface Props {
    center: ObjPoint
    draws: ObjSquare[]
    margin: number
}

const WALL_THICKNESS = 100
const LINE_WIDTH = 50
const FONT_SIZE = 2000
const GUIDE_MARGIN = 10000

const Sections: FC<Props> = ({ center, draws, margin }) => {
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
        [draws],
    )
    const splitText: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = center.x
                const y = savedText[index] + draws[index].height
                savedText.push(y)
                return { x: x, y: y }
            }),
        [draws],
    )
    return (
        <>
            {draws.map((draw, index) => (
                <Render
                    key={index}
                    base={centerShiftY[index]}
                    draw={draw}
                    textGuideX={MX + center.x + draws[0].bottom / 2}
                    splitGuideX={MX + center.x - draws[0].bottom / 2}
                    guideMargin={GUIDE_MARGIN}
                    splitText={splitText[index]}
                    thickness={WALL_THICKNESS}
                    lineWidth={LINE_WIDTH}
                    fontSize={FONT_SIZE}
                />
            ))}
            <TextDistance
                corner1={{
                    x: center.x + draws[0].bottom / 2 + GUIDE_MARGIN,
                    y: centerShiftY[centerShiftY.length - 1].y + draws[draws.length - 1].height,
                }}
                corner2={{
                    x: center.x + draws[0].bottom / 2 + GUIDE_MARGIN,
                    y: centerShiftY[0].y,
                }}
                guideX={center.x + draws[0].bottom / 2 + GUIDE_MARGIN * 2}
                guideMargin={GUIDE_MARGIN}
                text={splitText[splitText.length - 1].y}
                lineWidth={LINE_WIDTH}
                fontSize={FONT_SIZE}
            />
        </>
    )
}

export default Sections