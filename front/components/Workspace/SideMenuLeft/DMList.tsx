import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { NavLinkProps, NavLink } from 'react-router-dom'

//Hooks & Util & Type
import useSocket from '@hooks/useSocket'
import fetcher from '@utils/fetcher'
import { IUser, IUserWithOnline } from '@typings/db'
//Request
import useSWR from 'swr'

import { Fade32, Collaborate32, CircleDash16, CircleFilled16 } from '@carbon/icons-react'
import { SideNavMenu, SideNavMenuItem } from 'carbon-components-react'

const DMList = () => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()
    const [socket] = useSocket(workspace)
    /* SWR */
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
        dedupingInterval: 2000, // 2초
    })
    const { data: memberData } = useSWR<IUserWithOnline[]>(
        userData ? `/api/workspaces/${workspace}/members` : null,
        fetcher,
    )
    /* State */
    const [onlineList, setOnlineList] = useState<number[]>([])

    /* useEffect */
    useEffect(() => {
        console.log('DMList - Change Workspace : ', workspace)
        setOnlineList([])
    }, [workspace])

    useEffect(() => {
        socket?.on('onlineList', (data: number[]) => {
            setOnlineList(data)
        })
        console.log('DMList - Soket ON', socket?.hasListeners('dm'), socket)
        return () => {
            console.log('DMList - Soket OFF', socket?.hasListeners('dm'))
            socket?.off('onlineList')
        }
    }, [socket])

    return (
        <>
            <SideNavMenu title="DirectMessage" renderIcon={Collaborate32} large defaultExpanded>
                {memberData?.map((member) => {
                    const isOnline = onlineList.includes(member.id)
                    return (
                        <SideNavMenuItem<NavLinkProps>
                            key={member.id}
                            element={NavLink}
                            to={`/workspace/${workspace}/dm/${member.id}`}
                        >
                            {isOnline ? (
                                <CircleFilled16 style={{ fill: '#24a148' }} />
                            ) : (
                                <CircleDash16 style={{ fill: '#8d8d8d' }} />
                            )}
                            <span>{member.nickname}</span>
                            {member.id === userData?.id && <span>(me)</span>}
                        </SideNavMenuItem>
                    )
                })}
            </SideNavMenu>
        </>
    )
}

export default DMList
