import React, { FC } from 'react'

import { toRadian, toAngle } from '@objects/Tools/Cartesian'

interface Props {
    top: number
    bottom: number
    height: number
}

function MRound(v: number) {
    v = Math.round(v * 100) / 100
    return v
}

function height_TrcatedCone_To_OriginCone(top: number, btm: number, height: number) {
    // x : top = x+height : btm
    // btm*x = top(x+height)
    // btm*x = top*x + top*height
    // btm*x - top*x = top*height
    // (btm-top) * x = top*height
    // x = (top*height) / (btm-top)

    const coneHeight = MRound(height + (top * height) / (btm - top))

    return coneHeight
}

const Planar: FC<Props> = ({ top, bottom, height }) => {
    var originConeHeight = height_TrcatedCone_To_OriginCone(top, bottom, height)
    var trancatedConeHeight = height
    var topConeHeight = originConeHeight - trancatedConeHeight

    var originConeHypo = MRound(Math.sqrt(Math.pow(originConeHeight, 2) + Math.pow(bottom / 2, 2)))
    var topConeHypo = MRound(Math.sqrt(Math.pow(topConeHeight, 2) + Math.pow(top / 2, 2)))
    var trancatedConeHypo = MRound(
        Math.sqrt(Math.pow(Math.abs(bottom - top) / 2, 2) + Math.pow(height, 2)),
    )

    //View Scale Setting
    const viewHeight = originConeHeight * 1.2
    const viewWidth = viewHeight * 0.6
    const viewCenterMargin = -viewWidth * 0.5
    const textSize = viewWidth * 0.02
    return (
        <svg viewBox={`${viewCenterMargin} 0 ${viewWidth} ${viewHeight}`} fill="#fff">
            <g transform={`translate(${viewCenterMargin}, 1000) rotate(0)`}>
                <text x={1000} y={textSize} fill="eee" fontSize={textSize}>
                    ORI Object [Height: {originConeHeight}, Hypo: {originConeHypo}, BTM: {bottom}]
                </text>
                <text x={1000} y={textSize * 3} fill="#11ff55" fontSize={textSize}>
                    TOP Object [Height: {topConeHeight}, Hypo: {topConeHypo}, BTM: {top}]
                </text>
                <text x={1000} y={textSize * 5} fill="#fe00ee" fontSize={textSize}>
                    BTM Object [Height: {trancatedConeHeight}, Hypo: {trancatedConeHypo}, TOP: {top}
                    , BTM: {bottom}]
                </text>
            </g>
            <g transform={`translate(0, ${textSize * 10}) rotate(0)`}>
                <path
                    d={`M0,0 l${bottom / 2},${originConeHeight} h${-bottom} Z`}
                    fill="none"
                    stroke={'#eee'}
                    stroke-linecap="butt"
                    stroke-width="30"
                    stroke-opacity="0.5"
                />

                <path
                    d={`M0,0 l${top / 2},${topConeHeight} h${-top} Z`}
                    fill={'#11ff55'}
                    fill-opacity="0.1"
                />

                <path
                    d={`M0,${topConeHeight} h${top / 2} l${
                        Math.abs(top - bottom) / 2
                    },${trancatedConeHeight} h${-bottom} l${
                        Math.abs(top - bottom) / 2
                    },${-trancatedConeHeight} Z`}
                    fill="none"
                    stroke={'#fe00ee'}
                    stroke-linecap="butt"
                    stroke-width="50"
                    stroke-opacity="0.5"
                />
            </g>
        </svg>
    )
}

export default Planar
