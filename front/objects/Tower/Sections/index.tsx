import React, { FC, useMemo } from 'react'
import { ObjPoint, ObjSquare, ObjData } from 'typings/db'

import RenderTypeA from '@objects/Tools/RenderTypeA'
import RenderTypeB from '@objects/Tools/RenderTypeB'
// import RenderTypeC from '@objects/Tools/RenderTypeC'

interface Props {
    Type: number
    Object: ObjData[]
}

const Sections: FC<Props> = ({ Type, Object }) => {
    if (Type === 1) {
        return (
            <>
                {Object.map((r) => (
                    <RenderTypeA {...r} />
                ))}
            </>
        )
    } else if (Type === 2) {
        return (
            <>
                {Object.map((r) => (
                    <RenderTypeB {...r} />
                ))}
            </>
        )
    }
    return <></>
}

export default Sections
