import React, { FC, useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { Navigate, Link, LinkProps, NavLinkProps, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IUser, IChannel } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

import {
    Fade32,
    Workspace32,
    Collaborate32,
    Forum32,
    Add32,
    AddFilled32,
} from '@carbon/icons-react'
import {
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    SwitcherDivider,
    Button,
    Modal,
    Tooltip,
    TextInput,
    Select,
    SelectItem,
} from 'carbon-components-react'
import { SideNavBlack, SideNavItemBlack } from './styles'

interface Props {
    show: boolean
}

const SideMenuLeft: FC<Props> = ({ show }) => {
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

    /* Channel Modal */
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false)
    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true)
    }, [])

    /* Close Modal */
    const onCloseModal = useCallback(() => {
        setShowCreateChannelModal(false)
    }, [])

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
        <>
            <SideNavBlack aria-label="Side navigation" isRail expanded={show}>
                <SideNavItemBlack>
                    <SideNavLink<NavLinkProps>
                        element={NavLink}
                        to={`/workspace/${workspace}/channel/`}
                        renderIcon={Workspace32}
                        large
                    >
                        DashBoard
                    </SideNavLink>
                    <SwitcherDivider />
                    <SideNavMenu title="Channel" renderIcon={Collaborate32} large defaultExpanded>
                        {channelData?.map((channel) => {
                            return (
                                <SideNavMenuItem<NavLinkProps>
                                    key={channel.name}
                                    element={NavLink}
                                    to={`/workspace/${workspace}/channel/${encodeURI(
                                        channel.name,
                                    )}`}
                                >
                                    <span># {channel.name}</span>
                                </SideNavMenuItem>
                            )
                        })}
                    </SideNavMenu>
                    <SideNavLink
                        role="button"
                        onClick={onClickAddChannel}
                        renderIcon={AddFilled32}
                        large
                    >
                        Add Channel
                    </SideNavLink>
                    <SwitcherDivider />
                </SideNavItemBlack>
            </SideNavBlack>

            <Modal
                modalHeading="Add Channel"
                modalLabel="Channel"
                primaryButtonText="Add"
                secondaryButtonText="Cancel"
                open={showCreateChannelModal}
                onRequestClose={onCloseModal}
                onRequestSubmit={onCreateChannel}
            >
                <p style={{ marginBottom: '2rem' }}>
                    Create channels to communicate related topics within the current project
                    workspace.
                    <Tooltip tooltipBodyId="tooltip-body">
                        <p id="tooltip-body">Create a simple topic in the form of a hashtag.</p>
                    </Tooltip>
                </p>
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
        </>
    )
}

export default SideMenuLeft
