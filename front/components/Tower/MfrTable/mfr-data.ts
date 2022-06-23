import { TABLE_SORT_DIRECTION } from '@hooks/useTable/misc'

export const sortInfo = {
    columnId: 'country',
    direction: TABLE_SORT_DIRECTION.DESCENDING,
}

export const columns = [
    {
        id: 'name',
        title: 'Name',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'country',
        title: 'Country',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'length',
        title: 'Length [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameter',
        title: 'Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'weight',
        title: 'Weight [Ton]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'extraWeight',
        title: 'Extra Weight [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'thickness',
        title: 'Thickness [mm]',
        sortCycle: 'tri-states-from-ascending',
    },
]

export const columWithStatus = [
    {
        id: 'name',
        title: 'Name',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'country',
        title: 'Country',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'length',
        title: 'Length [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameter',
        title: 'Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'weight',
        title: 'Weight [Ton]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'extraWeight',
        title: 'Extra Weight [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'thickness',
        title: 'Thickness [mm]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'status',
        title: 'Status',
        sortCycle: 'tri-states-from-ascending',
    },
]

export const columMaxInfo = [
    {
        id: 'name',
        title: 'Name',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'country',
        title: 'Country',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'length',
        title: 'Length [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'diameter',
        title: 'Diameter [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'weight',
        title: 'Weight [Ton]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'extraWeight',
        title: 'Extra Weight [m]',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'thickness',
        title: 'Thickness [mm]',
        sortCycle: 'tri-states-from-ascending',
    },
]

export const rows = [
    {
        id: 1,
        name: 'CS Wind',
        country: 'KR',
        length: 42,
        diameter: 10,
        weight: 200,
        extraWeight: 0,
        thickness: 0,
        remark: '공장에서 항구까지 운반 조건 포함',
    },
    {
        id: 2,
        name: 'Steel Flower',
        country: 'KR',
        length: 0,
        diameter: 6,
        weight: 60,
        extraWeight: 0,
        thickness: 100,
        remark: '',
    },
    {
        id: 3,
        name: 'Win&P',
        country: 'KR',
        length: 32,
        diameter: 6.3,
        weight: 60,
        extraWeight: 150,
        thickness: 100,
        remark: '외부크레인 사용시 150Ton 까지 운반가능',
    },
    {
        id: 4,
        name: 'Chengxi',
        country: 'CN',
        length: 42,
        diameter: 8,
        weight: 260,
        extraWeight: 0,
        thickness: 0,
        remark: '36m length의 Painting room 8개 보유, 단, 2개씩 연결 되어있어 80m length의 room이 4개라 봐도 됨',
        selected: true,
    },
    {
        id: 5,
        name: 'Chengxi Shipyard',
        country: 'CN',
        length: 50,
        diameter: 8,
        weight: 200,
        extraWeight: 0,
        thickness: 0,
        remark: '',
        selected: true,
    },
    {
        id: 6,
        name: 'Qingdao Tianneng',
        country: 'CN',
        length: 42,
        diameter: 10,
        weight: 200,
        extraWeight: 0,
        thickness: 0,
        remark: '',
    },
    {
        id: 7,
        name: 'Qingdao Wuxiao',
        country: 'CN',
        length: 31,
        diameter: 7.5,
        weight: 120,
        extraWeight: 0,
        thickness: 0,
        remark: '',
    },
]

export const rowCapcity = [
    {
        id: 0,
        name: 'Production Capcity',
        country: Array.from(
            new Set(rows.filter((row) => row.selected).map((r) => r.country)),
        ).toString(),
        length: Math.min(
            ...rows.filter((row) => row.selected && row.length > 0).map((r) => r.length),
        ),
        diameter: Math.min(
            ...rows.filter((row) => row.selected && row.diameter > 0).map((r) => r.diameter),
        ),
        weight: Math.min(
            ...rows.filter((row) => row.selected && row.weight > 0).map((r) => r.weight),
        ),
        extraWeight: Math.min(
            ...rows.filter((row) => row.selected && row.extraWeight > 0).map((r) => r.extraWeight),
        ),
        thickness: Math.min(
            ...rows.filter((row) => row.selected && row.thickness > 0).map((r) => r.thickness),
        ),
        remark: '',
    },
]
export const rowsInit = {
    capacity: rowCapcity,
    selected: rows.filter((row) => row.selected),
    total: rows,
}

export const rowsMany = Array.from(new Array(50))
    .map((_item, i) =>
        rows.map((row, j) => ({
            ...row,
            id: i * 3 + j,
            name: `Load Balancer ${String(i * 3 + j + 1).padStart(3, '0')}`,
        })),
    )
    .flat()
