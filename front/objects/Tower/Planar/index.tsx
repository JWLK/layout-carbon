import React, { FC } from 'react'

import { toRadian, toAngle } from '@objects/Tools/Cartesian'

import Sector from '@objects/Tools/Sector'

interface Props {
    top: number
    bottom: number
    height: number
    angle: number
}

function height_TrcatedCone_To_OriginCone(top: number, btm: number, height: number) {
    // x : top = x+height : btm
    // btm*x = top(x+height)
    // btm*x = top*x + top*height
    // btm*x - top*x = top*height
    // (btm-top) * x = top*height
    // x = (top*height) / (btm-top)

    const coneHeight = height + (top * height) / (btm - top)

    return coneHeight
}

const Planar: FC<Props> = ({ top, bottom, height, angle }) => {
    var originConeHeight = height_TrcatedCone_To_OriginCone(top, bottom, height)
    var trancatedConeHeight = height
    var smallConeHeight = originConeHeight - trancatedConeHeight

    var originConeHypo = Math.sqrt(Math.pow(originConeHeight, 2) + Math.pow(bottom / 2, 2))
    var smallConeHypo = Math.sqrt(Math.pow(smallConeHeight, 2) + Math.pow(top / 2, 2))
    var trancatedConeHypo = Math.sqrt(Math.pow(Math.abs(bottom - top) / 2, 2) + Math.pow(height, 2))
    return (
        <>
            <g>
                <text x={1000} y={1000} fill="eee" fontSize="500">
                    [Height:{originConeHeight}, Hypo:{originConeHypo}, BTM:{bottom}]
                </text>
                <text x={1000} y={2000} fill="#11ff55" fontSize="500">
                    [Height:{smallConeHeight}, Hypo:{smallConeHypo}, BTM:{top}]
                </text>
                <text x={1000} y={3000} fill="#fe00ee" fontSize="500">
                    [Height:{height}, Hypo:{trancatedConeHypo}, TOP:{top}, BTM:{bottom}]
                </text>
            </g>
            <g transform="translate(10000, 5000) rotate(0)">
                <path
                    d={`M0,0 l${bottom / 2},${originConeHeight} h${-bottom} Z`}
                    fill="none"
                    stroke={'#eee'}
                    stroke-width="30"
                />

                <path
                    d={`M0,0 l${top / 2},${smallConeHypo} h${-top} Z`}
                    fill={'#11ff55'}
                    fill-opacity="0.5"
                />

                <rect
                    x={-top / 2}
                    y={smallConeHypo}
                    width={top}
                    height={height}
                    fill="none"
                    stroke={'#fe00ee'}
                    stroke-width="30"
                    stroke-opacity="0.5"
                />
            </g>
        </>
    )
}

export default Planar
