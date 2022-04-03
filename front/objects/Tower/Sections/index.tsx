import React, { FC, useMemo } from 'react'
import { ObjPoint, ObjSquare, ObjData } from 'typings/db'

import RenderTypeA from '@objects/Tools/RenderTypeA'

interface Props {
    base: ObjPoint
    draws: ObjSquare[]
}

const Sections: FC<Props> = ({ base, draws }) => {
    return (
        <>
            {draws.map((draw, index) => (
                <RenderTypeA key={index} base={base} draw={draw} />
            ))}
        </>
    )
}

export default Sections
