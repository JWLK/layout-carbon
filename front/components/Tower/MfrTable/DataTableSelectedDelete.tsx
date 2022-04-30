import React, { FC, useState, useCallback } from 'react'

import { column, rowProtocol, sortInfo } from '@typings/table'
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
    rows: rowProtocol[]
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
    const [hasSelection, setHasSelection] = useState(propHasSelection)
    const [rows, setRows] = useState(propRows)
    const [sortInfo, setSortInfo] = useSortInfo(propSortInfo)
    const [filteredRows, searchString, setSearchString] = useFilteredRows(rows)
    const [setRowSelection] = useRowSelection(filteredRows, searchString, setRows)
    const [sortedRows] = useSortedRows(filteredRows, sortInfo, new Intl.Collator())
    const [start, pageSize, setStart, setPageSize] = usePageInfo(
        propStart,
        propPageSize,
        filteredRows.length,
    )

    const elementId = useUniqueId('id')
    const selectedRowsCountInFiltered = filteredRows.filter(({ selected }: any) => selected).length
    const selectedAllInFiltered =
        selectedRowsCountInFiltered > 0 && filteredRows.length === selectedRowsCountInFiltered
    const hasBatchActions = hasSelection && selectedRowsCountInFiltered > 0
    const { columnId: sortColumnId, direction: sortDirection } = sortInfo
    const selectionAllName = !hasSelection
        ? undefined
        : `__custom-data-table_select-all_${elementId}`

    const handleCancelSelection = useCallback(() => {
        setRowSelection(undefined, false)
    }, [setRowSelection])

    const handleChangeSearchString = useCallback(
        ({ target }) => {
            setSearchString(target.value)
        },
        [setSearchString],
    )

    const handleChangeSelection = useCallback(
        (event) => {
            const { currentTarget } = event
            const row = currentTarget.closest('tr')
            if (row) {
                setRowSelection(Number(row.dataset.rowId), currentTarget.checked)
            }
        },
        [setRowSelection],
    )

    const handleChangeSelectionAll = useCallback(
        (event) => {
            setRowSelection(undefined, event.currentTarget.checked)
        },
        [setRowSelection],
    )

    const handleChangeSort = useCallback(
        (event) => {
            const { currentTarget } = event
            const { columnId, sortCycle, sortDirection: oldDirection } = currentTarget.dataset
            setSortInfo({ columnId, sortCycle, oldDirection })
        },
        [setSortInfo],
    )

    const handleChangePageSize = useCallback(
        ({ page, pageSize }) => {
            setPageSize(pageSize)
            setStart(pageSize * (page - 1))
        },
        [setPageSize, setStart],
    )

    const handleChangeStart = useCallback(
        (value) => {
            setStart(pageSize * value)
        },
        [pageSize, setStart],
    )

    const handleDeleteRows = useCallback(() => {
        setRows(rows.filter((row) => !row.selected || !doesRowMatchSearchString(row, searchString)))
    }, [rows, searchString])

    /* eslint-disable no-script-url */
    return (
        <TableContainer title="Data Table" description="Using Data Setting Button">
            <TableToolbar>
                <TableBatchActions
                    shouldShowBatchActions={hasBatchActions}
                    totalSelected={selectedRowsCountInFiltered}
                    onCancel={handleCancelSelection}
                >
                    <TableBatchAction
                        tabIndex={hasBatchActions ? 0 : -1}
                        renderIcon={TrashCan32}
                        onClick={handleDeleteRows}
                    >
                        Delete
                    </TableBatchAction>
                </TableBatchActions>

                <TableToolbarContent>
                    <TableToolbarSearch
                        tabIndex={hasBatchActions ? -1 : 0}
                        onChange={handleChangeSearchString}
                    />
                    {/* <TableToolbarMenu tabIndex={hasBatchActions ? -1 : 0} renderIcon={Edit32}>
                        <TableToolbarAction onClick={() => setHasSelection(!hasSelection)}>
                            Edit
                        </TableToolbarAction>
                    </TableToolbarMenu> */}
                    {hasSelection ? (
                        <Button
                            kind="ghost"
                            iconDescription="Edit Table List"
                            hasIconOnly
                            renderIcon={EditOff32}
                            onClick={() => setHasSelection(!hasSelection)}
                        />
                    ) : (
                        <Button
                            kind="ghost"
                            iconDescription="Edit Table List"
                            hasIconOnly
                            renderIcon={Edit32}
                            onClick={() => setHasSelection(!hasSelection)}
                        />
                    )}

                    {onShowModal && (
                        <Button kind="secondary" onClick={onShowModal} renderIcon={Settings32}>
                            Data Setting
                        </Button>
                    )}
                </TableToolbarContent>
            </TableToolbar>
            <Table size={'lg'} isSortable>
                <TableHead>
                    <TableRow>
                        {hasSelection && (
                            <TableSelectAll
                                id={`${elementId}--select-all`}
                                checked={selectedAllInFiltered}
                                indeterminate={
                                    selectedRowsCountInFiltered > 0 && !selectedAllInFiltered
                                }
                                ariaLabel="Select all rows"
                                name={selectionAllName!}
                                onSelect={handleChangeSelectionAll}
                            />
                        )}
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
                    {sortedRows.slice(start, start + pageSize).map((row: any) => {
                        const { id: rowId, selected } = row
                        const selectionName = !hasSelection
                            ? undefined
                            : `__custom-data-table_${elementId}_${rowId}`
                        return (
                            <TableRow
                                key={rowId}
                                isSelected={hasSelection && selected}
                                data-row-id={rowId}
                            >
                                {hasSelection && (
                                    <TableSelectRow
                                        id={`${elementId}--select-${rowId}`}
                                        checked={Boolean(selected)}
                                        name={selectionName!}
                                        ariaLabel="Select row"
                                        onSelect={handleChangeSelection}
                                    />
                                )}
                                {columns.map(({ id: columnId }) => (
                                    <TableCell key={columnId}>{row[columnId]}</TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            {typeof pageSize !== 'undefined' &&
                (windowWidth > 1000 ? (
                    <PaginationNav
                        itemsShown={windowWidth > 1500 ? 7 : 5}
                        onChange={handleChangeStart}
                        totalItems={Math.ceil(filteredRows.length / pageSize)}
                    />
                ) : (
                    <Pagination
                        backwardText="Previous page"
                        forwardText="Next page"
                        itemsPerPageText="Items per page:"
                        onChange={handleChangePageSize}
                        page={1}
                        pageSize={pageSize}
                        pageSizes={[10, 20, 30, 40, 50]}
                        size="md"
                        totalItems={filteredRows.length}
                    />
                ))}
        </TableContainer>
    )
}

export default CustomDataTable
