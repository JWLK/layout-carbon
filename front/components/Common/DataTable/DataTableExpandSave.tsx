import React, { FC, useState, useCallback, useEffect } from 'react'
//Current Page Parameter
import { useParams } from 'react-router'

import { column, rowProtocol, sortInfo, protocolList } from '@typings/table'
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
    TableExpandedRow,
    TableExpandHeader,
    TableExpandRow,
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

import { Edit32, EditOff32, Settings32, TrashCan32, Save32 } from '@carbon/icons-react'
import useRowExpand from '@hooks/useTable/useRowExpand'

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
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-protocalData`
    if (localStorage.getItem(keyRawData) === null) {
        alert(`${keyRawData} Data Load Error`)
    }

    const { windowWidth } = useGlobal()
    const [hasSelection, setHasSelection] = useState(propHasSelection)
    const [rows, setRows] = useState(propRows)
    const [sortInfo, setSortInfo] = useSortInfo(propSortInfo)
    const [filteredRows, searchString, setSearchString] = useFilteredRows(rows)
    const [setRowSelection] = useRowSelection(filteredRows, searchString, setRows)
    const [setRowExpand] = useRowExpand(filteredRows, searchString, setRows)
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
    // Only Data Selected -> BatchAction Active - Using Delete Item
    // const hasBatchActions = hasSelection && selectedRowsCountInFiltered > 0

    // If not Data Selcted -> BatchAction Passive Active Link to hasSelection State -> Using Edit Seleted Item
    const hasBatchActions = hasSelection
    const [batchActionsInit, setBatchActionInit] = useState(false)
    const [beforeRows, setBeforeRows] = useState(propRows)
    const { columnId: sortColumnId, direction: sortDirection } = sortInfo
    const selectionAllName = !hasSelection
        ? undefined
        : `__custom-data-table_select-all_${elementId}`

    const handleChangeSearchString = useCallback(
        ({ target }) => {
            setSearchString(target.value)
        },
        [setSearchString],
    )

    const handleChangeExpand = useCallback(
        (event, expanded) => {
            const { currentTarget } = event
            const row = currentTarget.closest('tr')
            if (row) {
                setRowExpand(Number(row.dataset.rowId), !expanded)
            }
        },
        [setRowExpand],
    )

    const buttonChangeSelection = useCallback(
        (rowId, checked) => {
            if (hasSelection === false) {
                setHasSelection(true)
            }
            setRowSelection(Number(rowId), !checked)
        },
        [hasSelection, setRowSelection],
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

    //Using Edit Seleted Item
    useEffect(() => {
        if (batchActionsInit === false) {
            setBatchActionInit(true)
            setBeforeRows(rows)
        }
    }, [batchActionsInit, rows])

    const handleCancelSelection = useCallback(() => {
        setRows(beforeRows)
        setBatchActionInit(false)
        setHasSelection(false)
    }, [beforeRows])

    const handleSaveRows = useCallback(() => {
        setBatchActionInit(false)
        setHasSelection(false)
        //LocalStorage Sync
        tableDataSaveSync(rows)
    }, [rows])

    const tableDataSaveSync = (rowsData: rowProtocol[]) => {
        var protocolDataObject = {} as protocolList
        protocolDataObject.total = rowsData
        protocolDataObject.selected = rowsData.filter((row) => row.selected)
        localStorage.setItem(keyRawData, JSON.stringify(protocolDataObject))
        update && update()
    }
    //Using Delete Item
    // const handleCancelSelection = useCallback(() => {
    //     setRowSelection(undefined, false)
    // }, [setRowSelection])

    // const handleDeleteRows = useCallback(() => {
    //     setRows(rows.filter((row) => !row.selected || !doesRowMatchSearchString(row, searchString)))
    // }, [rows, searchString])

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

    /* Sync Data */
    useEffect(() => {
        setRows(propRows)
    }, [propRows])

    /* eslint-disable no-script-url */
    return (
        <TableContainer>
            <TableToolbar>
                <TableBatchActions
                    shouldShowBatchActions={hasBatchActions}
                    totalSelected={selectedRowsCountInFiltered}
                    onCancel={handleCancelSelection}
                >
                    <TableBatchAction
                        tabIndex={hasBatchActions ? 0 : -1}
                        renderIcon={Save32}
                        onClick={handleSaveRows}
                    >
                        Save
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
                        <TableExpandHeader />
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
                        const { id: rowId, selected, expanded } = row
                        const selectionName = !hasSelection
                            ? undefined
                            : `__custom-data-table_${elementId}_${rowId}`
                        return (
                            <>
                                <TableExpandRow
                                    key={rowId}
                                    isSelected={hasSelection && selected}
                                    data-row-id={rowId}
                                    isExpanded={expanded}
                                    onExpand={(e) => handleChangeExpand(e, expanded)}
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
                                    {columns.map(({ id: columnId }) =>
                                        columnId !== 'status' ? (
                                            <TableCell key={columnId}>{row[columnId]}</TableCell>
                                        ) : (
                                            <TableCell key={columnId}>
                                                {row['selected'] == true ? (
                                                    <Button
                                                        kind="ghost"
                                                        style={{ color: '#22ff00' }}
                                                        onClick={() =>
                                                            buttonChangeSelection(rowId, selected)
                                                        }
                                                    >
                                                        Selected
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        kind="ghost"
                                                        style={{ color: '#ccc' }}
                                                        onClick={() =>
                                                            buttonChangeSelection(rowId, selected)
                                                        }
                                                    >
                                                        Not Selected
                                                    </Button>
                                                )}
                                            </TableCell>
                                        ),
                                    )}
                                </TableExpandRow>
                                {expanded && (
                                    <TableExpandedRow colSpan={columns.length + 2}>
                                        {row.detail}
                                    </TableExpandedRow>
                                )}
                            </>
                        )
                    })}
                </TableBody>
            </Table>
            {typeof pageSize !== 'undefined' &&
                Math.ceil(filteredRows.length / pageSize) > 1 &&
                (windowWidth > 671 ? (
                    <PaginationNav
                        itemsShown={10}
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
