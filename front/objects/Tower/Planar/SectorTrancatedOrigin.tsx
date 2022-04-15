import React, { FC } from 'react'

import { toRadian, toAngle } from '@objects/Tools/Cartesian'

import Sector from '@objects/Tools/Sector'

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

function angle_Cone_To_Sector(under: number, hypo: number) {
    // Cone Bottom Circle Arc = Sector Arc
    // 2 * Math.PI * r = R_Hypo * {?}
    // {?} =  2 * Math.PI * r  / R_Hypo
    var sectorAngle = toAngle((2 * Math.PI * (under / 2)) / hypo)
    return sectorAngle
}

const Planar: FC<Props> = ({ top, bottom, height }) => {
    //Height
    var originConeHeight = height_TrcatedCone_To_OriginCone(top, bottom, height)
    var trancatedConeHeight = height
    var topConeHeight = originConeHeight - trancatedConeHeight

    //Hypo
    var originConeHypo = MRound(Math.sqrt(Math.pow(originConeHeight, 2) + Math.pow(bottom / 2, 2)))
    var topConeHypo = MRound(Math.sqrt(Math.pow(topConeHeight, 2) + Math.pow(top / 2, 2)))
    var trancatedConeHypo = MRound(
        Math.sqrt(Math.pow(Math.abs(bottom - top) / 2, 2) + Math.pow(height, 2)),
    )

    //Angle
    var originSectorAngle = MRound(angle_Cone_To_Sector(bottom, originConeHypo))

    //Sector Length
    var originConeArcLength = MRound(2 * Math.PI * (bottom / 2))
    var topConeArcLength = MRound(2 * Math.PI * (top / 2))

    const viewHeight = originConeHeight * 1.5
    const viewWidth = viewHeight * 1
    const viewCenterMargin = -viewWidth * 0.5
    const textSize = viewWidth * 0.02
    return (
        <svg viewBox={`${viewCenterMargin} 0 ${viewWidth} ${viewHeight}`} fill="#fff">
            <g transform={`translate(${viewCenterMargin}, 1000) rotate(0)`}>
                <text x={1000} y={textSize * 2} fill="eee" fontSize={textSize}>
                    Angle: {originSectorAngle}
                </text>
                <text x={1000} y={textSize * 4} fill="eee" fontSize={textSize}>
                    ORI Object [Height: {originConeHeight}, Hypo: {originConeHypo}, BTM: {bottom},
                    Arc: {originConeArcLength}]
                </text>
                <text x={1000} y={textSize * 6} fill="#11ff55" fontSize={textSize}>
                    TOP Object [Height: {topConeHeight}, Hypo: {topConeHypo}, BTM: {top}] Arc:
                    {topConeArcLength}]
                </text>
                <text x={1000} y={textSize * 8} fill="#fe00ee" fontSize={textSize}>
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
                    fill="none"
                    stroke={'#11ff55'}
                    stroke-linecap="butt"
                    stroke-width="50"
                    stroke-opacity="0.5"
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
                <Sector
                    angle={originSectorAngle}
                    range={originConeHypo}
                    color={'#eee'}
                    strokeSize={50}
                />
                <Sector
                    angle={originSectorAngle}
                    range={topConeHypo}
                    color={'#11ff55'}
                    strokeSize={50}
                />
            </g>
        </svg>
    )
}

export default Planar
