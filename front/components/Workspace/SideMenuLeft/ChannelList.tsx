import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router'
import { NavLinkProps, NavLink } from 'react-router-dom'

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IUser, IChannel } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'
import { Fade32, BuildingInsights_132, AddFilled32 } from '@carbon/icons-react'
import { SideNavLink, SideNavMenu, SideNavMenuItem } from 'carbon-components-react'
import CreateChannelModal from '../CreateChannelModal'

const ChannelList = () => {
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

    return (
        <>
            <SideNavMenu title="Channel" renderIcon={BuildingInsights_132} large defaultExpanded>
                {channelData?.map((channel) => {
                    return (
                        <SideNavMenuItem<NavLinkProps>
                            key={channel.name}
                            element={NavLink}
                            to={`/workspace/${workspace}/channel/${encodeURI(channel.name)}`}
                        >
                            <span># {channel.name}</span>
                        </SideNavMenuItem>
                    )
                })}
            </SideNavMenu>
            <SideNavLink role="button" onClick={onClickAddChannel} renderIcon={AddFilled32} large>
                Add Channel
            </SideNavLink>
            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
        </>
    )
}

export default ChannelList
