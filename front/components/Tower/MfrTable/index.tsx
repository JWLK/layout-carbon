import React, { useState, useCallback, useEffect } from 'react'
//Current Page Parameter
import { useParams } from 'react-router'
//Request
import useSWR from 'swr'
import fetchStore from '@utils/store'

/* @typings */
import { rowProtocol, protocolList } from '@typings/table'

import DataTableSelectedDelete from './DataTableSelectedDelete'
import DataTableModal from './DataTableModal'
import DataTableSelectedSave from './DataTableSelectedSave'
import {
    rowsInitProtocol,
    columns as columnsDefault,
    columWithStatus,
    sortInfo as sortInfoDefault,
} from './table-data'

const CustomTable = () => {
    /* Param */
    const { workspace } = useParams<{ workspace?: string }>()
    /* Localstorage */
    const keyRawData = `${workspace}-protocalData`
    if (localStorage.getItem(keyRawData) === null) {
        localStorage.setItem(keyRawData, JSON.stringify(rowsInitProtocol))
    }
    /* SWR */
    const { data: PD, mutate: mutatePD } = useSWR(keyRawData, fetchStore)

    /* Modal */
    const onCloseModal = useCallback(() => {
        setShowDataTableModal(false)
    }, [])

    const [showDataTableModal, setShowDataTableModal] = useState(false)
    const onClickAddDataTableModal = useCallback(() => {
        setShowDataTableModal(true)
    }, [])

    if (PD === undefined) {
        return <div>Loading...</div>
    }

    return (
        <>
            <DataTableSelectedDelete
                columns={columnsDefault}
                rows={PD.selected}
                sortInfo={sortInfoDefault}
                hasSelection={false}
                pageSize={10}
                start={0}
                onShowModal={onClickAddDataTableModal}
            />
            <DataTableModal show={showDataTableModal} onCloseModal={onCloseModal}>
                <DataTableSelectedSave
                    columns={columWithStatus}
                    rows={PD.total}
                    sortInfo={sortInfoDefault}
                    hasSelection={false}
                    pageSize={10}
                    start={0}
                    update={mutatePD}
                />
            </DataTableModal>
        </>
    )
}

export default CustomTable
