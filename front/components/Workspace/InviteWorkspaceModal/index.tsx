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
    setShowInviteWorkspaceModal: (flag: boolean) => void
}

const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
    const { workspace } = useParams<{ workspace: string; channel: string }>()
    const [newMember, onChangeNewMember, setNewMember] = useInput('')
    const { data: userData } = useSWR<IUser>('/api/users', fetcher)
    const { mutate: revalidateMember } = useSWR<IUser[]>(
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher,
    )

    const onInviteMember = useCallback(
        (e) => {
            e.preventDefault()
            if (!newMember || !newMember.trim()) {
                return
            }
            axios
                .post(`/api/workspaces/${workspace}/members`, {
                    email: newMember,
                })
                .then(() => {
                    revalidateMember()
                    setShowInviteWorkspaceModal(false)
                    setNewMember('')
                })
                .catch((error) => {
                    console.dir(error)
                    toast.error(error.response?.data, { position: 'bottom-center' })
                })
        },
        [newMember, workspace, revalidateMember, setShowInviteWorkspaceModal, setNewMember],
    )

    return (
        <Modal
            modalHeading="Add Member"
            modalLabel="Workspace Member"
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            open={show}
            onRequestClose={onCloseModal}
            onRequestSubmit={onInviteMember}
        >
            <div style={{ marginBottom: '2rem' }}>
                Invite New Member in This Workspace.
                <Tooltip tooltipBodyId="tooltip-body">
                    <p id="tooltip-body">Create a simple topic in the form of a hashtag.</p>
                </Tooltip>
            </div>
            <TextInput
                data-modal-primary-focus
                id="workspace-member-email"
                labelText="Member Email"
                placeholder="guest@gmail.com"
                style={{ marginBottom: '1rem' }}
                value={newMember}
                onChange={onChangeNewMember}
            />
        </Modal>
    )
}

export default InviteWorkspaceModal
