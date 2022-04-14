//Tower Element
import { ObjPoint, ObjSquare, TWInitialValue, TWRawData, TWSection, TWParts } from 'typings/object'
import { toRadian, toAngle } from '@objects/Tools/Cartesian'

export const InitSection: TWSection = {
    index: 0,
    section: { top: 4950, bottom: 7300, height: 100000 },
    tapered: true,
}

export const InitParts: TWParts = {
    index: 0,
    parts: [{ top: 4950, bottom: 7300, height: 100000 }],
    angle: toAngle(Math.PI / 2 - Math.atan(100000 / 7300)),
}

export const RawData: TWRawData = {
    initial: {
        topUpperOutDia: 4950,
        bottomLowerOutDia: 7300,
        totalHeight: 100000,
        offset: 10,
        maxHeight: 110000,
        divided: 1,
        custom: false,
    },
    sectionData: [InitSection],
    partsData: [InitParts],
}
