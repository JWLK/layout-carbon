import React, { useState, useCallback } from 'react'
import CustomDataTable from './CustomDataTable'
import CustomDataModal from './CustomDataModal'
import {
    rowsMany as demoRowsMany,
    columnsProtocol as demoColumns,
    sortInfo as demoSortInfo,
} from './table-data'

const CustomTable = () => {
    const [showCustomDataModal, setShowCustomDataModal] = useState(false)
    const onClickAddCustomDataModal = useCallback(() => {
        setShowCustomDataModal(true)
    }, [])
    /* Close Modal */
    const onCloseModal = useCallback(() => {
        setShowCustomDataModal(false)
    }, [])

    return (
        <>
            <CustomDataTable
                columns={demoColumns}
                rows={demoRowsMany}
                sortInfo={demoSortInfo}
                hasSelection={false}
                pageSize={10}
                start={0}
                onShowModal={onClickAddCustomDataModal}
            />
            <CustomDataModal
                show={showCustomDataModal}
                onCloseModal={onCloseModal}
                setShowModal={setShowCustomDataModal}
            />
        </>
    )
}

export default CustomTable
