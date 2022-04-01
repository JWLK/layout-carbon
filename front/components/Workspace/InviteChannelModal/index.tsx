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
    setShowInviteChannelModal: (flag: boolean) => void
}

const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>()
    const [newMember, onChangeNewMember, setNewMember] = useInput('')
    const { data: userData } = useSWR<IUser>('/api/users', fetcher)
    const { mutate: revalidateMembers } = useSWR<IUser[]>(
        userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher,
    )

    const onInviteMember = useCallback(
        (e) => {
            e.preventDefault()
            if (!newMember || !newMember.trim()) {
                return
            }
            axios
                .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
                    email: newMember,
                })
                .then(() => {
                    revalidateMembers()
                    setShowInviteChannelModal(false)
                    setNewMember('')
                })
                .catch((error) => {
                    console.dir(error)
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        },
        [channel, newMember, revalidateMembers, setNewMember, setShowInviteChannelModal, workspace],
    )

    return (
        <Modal
            modalHeading="Add Member"
            modalLabel="Channel Member"
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            open={show}
            onRequestClose={onCloseModal}
            onRequestSubmit={onInviteMember}
        >
            <div style={{ marginBottom: '2rem' }}>
                Invite New Member in This Channel.
                <Tooltip tooltipBodyId="tooltip-body">
                    <p id="tooltip-body">Create a simple topic in the form of a hashtag.</p>
                </Tooltip>
            </div>
            <TextInput
                data-modal-primary-focus
                id="channel-member-email"
                labelText="Member Email"
                placeholder="guest@gmail.com"
                style={{ marginBottom: '1rem' }}
                value={newMember}
                onChange={onChangeNewMember}
            />
        </Modal>
    )
}

export default InviteChannelModal
