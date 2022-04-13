import React, { FC, useMemo } from 'react'
import { MX, MY } from '@objects/Base/AxisSections'
import { ObjPoint, ObjSquare } from 'typings/object'

import Render from '@objects/Tools/RenderTypeParts'
import TextDistance from '@objects/Tools/TextDistanceTypeSections'

interface Props {
    center: ObjPoint
    draws: ObjSquare[]
    margin: number
}

const Parts: FC<Props> = ({ center, draws, margin }) => {
    var WALL_THICKNESS = 200
    var LINE_WIDTH = WALL_THICKNESS / 2
    var GUIDE_MARGIN = 15000
    var FONT_SIZE = 2000

    const savedShift: number[] = [center.y]
    const savedText: number[] = [0]

    const centerShiftY: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = center.x
                const y = savedShift[index] + (index > 0 ? draws[index - 1].height + margin : 0)
                savedShift.push(y)
                return { x: x, y: y }
            }),
        [center.x, draws, margin, savedShift],
    )
    const splitText: ObjPoint[] = useMemo(
        () =>
            draws.map((draw, index) => {
                const x = center.x
                const y = savedText[index] + draws[index].height
                savedText.push(y)
                return { x: x, y: y }
            }),
        [center.x, draws, savedText],
    )

    if (splitText[splitText.length - 1].y > 80000) {
        WALL_THICKNESS = 200
        LINE_WIDTH = WALL_THICKNESS / 2
        GUIDE_MARGIN = 15000
        FONT_SIZE = 2000
    } else if (splitText[splitText.length - 1].y > 50000) {
        WALL_THICKNESS = 150
        LINE_WIDTH = WALL_THICKNESS / 2
        GUIDE_MARGIN = 10000
        FONT_SIZE = 1500
    } else if (splitText[splitText.length - 1].y > 25000) {
        WALL_THICKNESS = 30
        LINE_WIDTH = WALL_THICKNESS / 2
        GUIDE_MARGIN = 8000
        FONT_SIZE = 800
    } else if (splitText[splitText.length - 1].y > 15000) {
        WALL_THICKNESS = 30
        LINE_WIDTH = WALL_THICKNESS / 2
        GUIDE_MARGIN = 4000
        FONT_SIZE = 600
    } else {
        WALL_THICKNESS = 20
        LINE_WIDTH = WALL_THICKNESS / 2
        GUIDE_MARGIN = 3000
        FONT_SIZE = 400
    }
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
                MX={MX}
                MY={MY}
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

export default Parts
