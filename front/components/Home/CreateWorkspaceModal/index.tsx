import React, { FC, useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IUser, IChannel } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

//Css
import { Modal, Tooltip, TextInput } from 'carbon-components-react'

interface Props {
    show: boolean
    onCloseModal: () => void
    setShowCreateWorkspaceModal: (flag: boolean) => void
}

const CreateWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowCreateWorkspaceModal }) => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()
    /* SWR */
    const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher)

    /* Event */
    const [newWorkspace, setNewWorkspace] = useState('')
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('')

    const onChangeNewWorkspace = useCallback(
        (e) => {
            const getValue = e.target.value
            setNewWorkspace(getValue)
            const urlValue = getValue.toLowerCase().replace(/\s/gi, '')
            setNewUrl(urlValue)
            console.log(urlValue)
        },
        [newWorkspace, newUrl],
    )
    const onCreateWorkspace = useCallback(
        (e) => {
            e.preventDefault()
            if (!newWorkspace || !newWorkspace.trim()) {
                return
            }
            if (!newUrl || !newUrl.trim()) {
                return
            }
            axios
                .post('/api/workspaces', {
                    workspace: newWorkspace,
                    url: newUrl,
                })
                .then(() => {
                    revalidateUser()
                    setShowCreateWorkspaceModal(false)
                    setNewWorkspace('')
                    setNewUrl('')
                })
                .catch((error) => {
                    console.dir(error)
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        },
        [newWorkspace, newUrl],
    )

    return (
        <Modal
            modalHeading="Add Workspace"
            modalLabel="Workspace"
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            open={show}
            onRequestClose={onCloseModal}
            onRequestSubmit={onCreateWorkspace}
        >
            <div style={{ marginBottom: '2rem' }}>
                Create Workspace.
                <Tooltip tooltipBodyId="tooltip-body">
                    <p id="tooltip-body">Create a simple topic in the form of a hashtag.</p>
                </Tooltip>
            </div>
            <TextInput
                data-modal-primary-focus
                id="workspace-name"
                labelText="Workspace name"
                placeholder="New Workspace Project"
                style={{ marginBottom: '1rem' }}
                value={newWorkspace}
                onChange={onChangeNewWorkspace}
            />
            <TextInput
                data-modal-primary-focus
                id="workspace-url"
                labelText="Workspace Url (Auto Insert)"
                placeholder="(Auto Created)"
                style={{ marginBottom: '1rem' }}
                value={newUrl}
                onChange={onChangeNewUrl}
                disabled
            />
        </Modal>
    )
}

export default CreateWorkspaceModal
