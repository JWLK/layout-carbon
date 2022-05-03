import { TABLE_SORT_DIRECTION } from '@hooks/useTable/misc'

export const sortInfo = {
    columnId: 'index',
    direction: TABLE_SORT_DIRECTION.DESCENDING,
}

export const columnsParts = [
    {
        id: 'no',
        title: 'Part No',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'height',
        title: 'Length [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'thickness',
        title: 'Thickness [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameterUpperOutside',
        title: 'Upper outside Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameterUpperInside',
        title: 'Upper inside Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameterLowerOutside',
        title: 'Lower outside Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameterLowerInside',
        title: 'Lower inside Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'weight',
        title: 'Weight [Ton]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'thickness',
        title: 'Thickness [mm]',
        sortCycle: 'tri-states-from-ascending',
    },
]
