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

const SectorTC: FC<Props> = ({
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
    var viewHeight = 0
    var viewWidth = 0
    var viewObject = 0
    if (trancatedConeHeight > originConeArcLength) {
        viewObject = trancatedConeHeight + 3000
        viewHeight = trancatedConeHeight + 6000
        viewWidth = originConeArcLength * 3
    } else {
        viewObject = trancatedConeHeight + 5000
        viewHeight = trancatedConeHeight + 6000
        viewWidth = originConeArcLength * 1.1
    }
    const viewCenterMargin = -viewWidth * 0.5
    const textSize = viewWidth * 0.02
    return (
        <svg viewBox={`${viewCenterMargin} ${0} ${viewWidth} ${viewHeight}`} fill="#fff">
            <g transform={`translate(${viewCenterMargin}, 1000) rotate(0)`}>
                {/* <text x={1000} y={viewHeight - 8000 + textSize * 6} fill="eee" fontSize={textSize}>
                    so.a.i : {topConeArcLength}, su.a.i: {originConeArcLength}, φi: {degree} deg /{' '}
                    {radian} rad ,
                </text>
                <text x={1000} y={viewHeight - 8000 + textSize * 8} fill="eee" fontSize={textSize}>
                    Wi : {trancatedConeHypo}, wi : {trancatedMargin} , δ : {paperMargin},
                </text>
                <text x={1000} y={viewHeight - 8000 + textSize * 10} fill="eee" fontSize={textSize}>
                    Worg.i: {paperOriginWidth}, Horgi : {paperOriginHeight}, Wsheet.i :
                    {paperSheetWidth}, Hsheet.i : {paperSheetHeight}
                </text> */}
            </g>
            {/* ORIGIN Planar */}
            <g transform={`translate(0, ${-originConeHeight + viewObject}) rotate(0)`}></g>
            {/* Sector Planar */}
            <g transform={`translate(0, ${-originConeHeight + viewObject}) rotate(0)`}>
                <PaperTCSector
                    angle={degree * 2}
                    rangeTop={topConeHypo}
                    rangeBottom={originConeHypo}
                    color={'#eee'}
                    strokeSize={50}
                />
                <Sector angle={degree * 2} range={originConeHypo} color={'#eee'} strokeSize={10} />
                <Sector angle={degree * 2} range={topConeHypo} color={'#11ff55'} strokeSize={10} />
            </g>
            {/* Paper Outline */}
            {/* <g transform={`translate(0, ${-originConeHeight + viewObject}) rotate(0)`}>
                <PaperSheet
                    center={{
                        x: 0,
                        y: -topConeHypo - trancatedConeHypo,
                    }}
                    draw={{
                        top: paperSheetHeight,
                        bottom: paperSheetHeight,
                        height: paperSheetWidth,
                    }}
                    lineColor={'#ffff00'}
                    lineWidth={30}
                    guideEnable={false}
                />
            </g> */}
        </svg>
    )
}

export default SectorTC
