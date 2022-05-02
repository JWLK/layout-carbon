import React, { FC, useState, useCallback, useEffect } from 'react'

import { column, rowMfr, sortInfo } from '@typings/table'
import { useGlobal } from '@hooks/useGlobal'
import {
    useFilteredRows,
    usePageInfo,
    useRowSelection,
    useSortedRows,
    useSortInfo,
    useUniqueId,
} from '@hooks/useTable'
import { doesRowMatchSearchString, TABLE_SORT_DIRECTION } from '@hooks/useTable/misc'
import {
    Button,
    Pagination,
    PaginationNav,
    Table,
    TableBatchAction,
    TableBatchActions,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableSelectAll,
    TableSelectRow,
    TableToolbar,
    TableToolbarAction,
    TableToolbarContent,
    TableToolbarMenu,
    TableToolbarSearch,
} from 'carbon-components-react'

import { Edit32, EditOff32, Settings32, TrashCan32 } from '@carbon/icons-react'

interface Props {
    columns: column[]
    rows: rowMfr[]
    sortInfo: sortInfo
    hasSelection: boolean
    pageSize: number
    start: number
    onShowModal?: () => void
    update?: () => void
}

const CustomDataTable: FC<Props> = ({
    columns,
    rows: propRows,
    sortInfo: propSortInfo,
    hasSelection: propHasSelection,
    pageSize: propPageSize,
    start: propStart,
    onShowModal,
    update,
}) => {
    const { windowWidth } = useGlobal()
    const [rows, setRows] = useState(propRows)
    const [sortInfo, setSortInfo] = useSortInfo(propSortInfo)

    const { columnId: sortColumnId, direction: sortDirection } = sortInfo

    const handleChangeSort = useCallback(
        (event) => {
            const { currentTarget } = event
            const { columnId, sortCycle, sortDirection: oldDirection } = currentTarget.dataset
            setSortInfo({ columnId, sortCycle, oldDirection })
        },
        [setSortInfo],
    )

    /* Sync Data */
    useEffect(() => {
        setRows(propRows)
    }, [propRows])

    if (propRows === undefined) {
        return <div>Loading...</div>
    }
    /* eslint-disable no-script-url */
    return (
        <TableContainer>
            <Table size={'lg'} isSortable>
                <TableHead>
                    <TableRow>
                        {columns.map(({ id: columnId, sortCycle, title }) => {
                            const sortDirectionForThisCell =
                                sortCycle &&
                                (columnId === sortColumnId
                                    ? sortDirection
                                    : TABLE_SORT_DIRECTION.NONE)
                            return (
                                <TableHeader
                                    key={columnId}
                                    isSortable={Boolean(sortCycle)}
                                    isSortHeader={Boolean(sortCycle) && columnId === sortColumnId}
                                    sortDirection={sortDirectionForThisCell}
                                    data-column-id={columnId}
                                    data-sort-cycle={sortCycle}
                                    data-sort-direction={sortDirectionForThisCell}
                                    onClick={handleChangeSort}
                                >
                                    {title}
                                </TableHeader>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => {
                        const { id: rowId } = row
                        return (
                            <TableRow key={rowId} data-row-id={rowId}>
                                {columns.map(({ id: columnId }) => (
                                    <TableCell key={columnId}>
                                        {row[columnId] !== null ? row[columnId] : '-'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomDataTable
