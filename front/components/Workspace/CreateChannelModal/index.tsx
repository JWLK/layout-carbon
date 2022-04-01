import React, { FC, useCallback } from 'react'
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
    setShowCreateChannelModal: (flag: boolean) => void
}

const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()
    /* SWR */
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
        dedupingInterval: 2000, // 2초
    })
    const {
        data: channelData,
        mutate: revalidateChannel,
        error: channelError,
    } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher)

    /* Channel Add */
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('')
    const onCreateChannel = useCallback(
        (e) => {
            e.preventDefault()
            if (!newChannel || !newChannel.trim()) {
                return
            }
            axios
                .post(`/api/workspaces/${workspace}/channels`, {
                    name: newChannel,
                })
                .then(() => {
                    revalidateChannel()
                    setShowCreateChannelModal(false)
                    setNewChannel('')
                })
                .catch((error) => {
                    console.dir(error)
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        },
        [workspace, newChannel, revalidateChannel, setShowCreateChannelModal, setNewChannel],
    )

    return (
        <Modal
            modalHeading="Add Channel"
            modalLabel="Channel"
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            open={show}
            onRequestClose={onCloseModal}
            onRequestSubmit={onCreateChannel}
        >
            <div style={{ marginBottom: '2rem' }}>
                Create channels to communicate related topics within the current project workspace.
                <Tooltip tooltipBodyId="tooltip-body">
                    <p id="tooltip-body">Create a simple topic in the form of a hashtag.</p>
                </Tooltip>
            </div>
            <TextInput
                data-modal-primary-focus
                id="channel"
                labelText="Channel name"
                placeholder="e.g. JustChat"
                style={{ marginBottom: '1rem' }}
                value={newChannel}
                onChange={onChangeNewChannel}
            />
        </Modal>
    )
}

export default CreateChannelModal
