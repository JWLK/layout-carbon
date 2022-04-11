//Tower Element
import {
    ObjPoint,
    ObjSquare,
    TWInitialValue,
    TWRawData,
    TWSectionsData,
    TWPartsData,
} from 'typings/object'

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
    sections: [{ top: 4950, bottom: 7300, height: 100000 }],
    parts: [],
}

export const SectionsValue: TWPartsData = {
    sections: [],
    parts: [],
}

export const PartsValue: TWPartsData = {
    sections: [],
    parts: [],
}

export const RawSaveValue: TWPartsData = {
    sections: [],
    parts: [],
}
