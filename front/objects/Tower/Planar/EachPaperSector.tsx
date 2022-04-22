import React, { FC, useMemo } from 'react'

import { toRadian, toAngle } from '@objects/Tools/Cartesian'

import Sector from '@objects/Element/Sector'
import PaperTCSector from '@objects/Element/PaperTCSector'
import PaperSheet from '@objects/Element/PaperSheet'
import { ObjPoint, ObjSquare, ObjSector, TWSector, TWSectors } from '@typings/object'

interface Props {
    draw: ObjSector
}

function MRound(v: number) {
    v = Math.round(v * 1000) / 1000
    return v
}

const EachPaperSector: FC<Props> = ({
    draw: {
        degree,
        radian,
        originConeHeight,
        originConeHypo,
        originConeArcLength,
        topConeHeight,
        topConeHypo,
        topConeArcLength,
        trancatedConeHeight,
        trancatedConeHypo,
        trancatedMargin,
        paperOriginWidth,
        paperOriginHeight,
        paperMargin,
        paperSheetWidth,
        paperSheetHeight,
    },
}) => {
    var viewWidth = 500
    var viewHeight = 350
    var viewObject = 0

    const viewCenterMarginX = -viewWidth * 0.5
    const viewCenterMarginY = 0
    const textSize = viewWidth * 0.02
    return (
        <svg
            viewBox={`${viewCenterMarginX} ${viewCenterMarginY} ${viewWidth} ${viewHeight}`}
            fill="#fff"
        >
            <g transform={`translate(0, ${viewCenterMarginY}}) rotate(0)`}>
                <PaperTCSector
                    angle={100}
                    rangeTop={100}
                    rangeBottom={200}
                    color={'#ffff00'}
                    strokeSize={1}
                />
                <Sector angle={100} range={100} color={'#11ff55'} strokeSize={0.5} />
            </g>
            <g transform={`translate(0,0) rotate(0)`}>
                <PaperSheet
                    center={{
                        x: 0,
                        y: 0,
                    }}
                    draw={{
                        top: 1000,
                        bottom: 1000,
                        height: 1000,
                    }}
                    lineColor={'#ffff00'}
                    lineWidth={1}
                    guideEnable={false}
                />
            </g>
        </svg>
    )
}

export default EachPaperSector
