import React, { FC, PropsWithChildren } from 'react'
interface Props {
    show: boolean
    onCloseModal: () => void
}

//Css
import { Modal } from 'carbon-components-react'

const CustomDataModal: FC<PropsWithChildren<Props>> = ({ show, onCloseModal, children }) => {
    return (
        <>
            <Modal
                size="lg"
                modalLabel="Data Setting"
                modalHeading="Select the data to use"
                open={show}
                passiveModal={true}
                // primaryButtonText="Add"
                // secondaryButtonText="Cancel"
                onRequestClose={onCloseModal}
                // onRequestSubmit={onCreateWorkspace}
            >
                {children}
            </Modal>
        </>
    )
}

export default CustomDataModal
