import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Navigate, Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import gravatar from 'gravatar'
import loadable from '@loadable/component'
//Components
import SideMenuLeft from '@components/SideMenuLeft'
import SideMenuRight from '@components/SideMenuRight'
// import Menu from '@components/Menu'
// import Modal from '@components/Modal'
// import CreateChannelModal from '@components/CreateChannelModal'
// import InviteWorkspaceModal from '@components/InviteWorkspaceModal'
// import ChannelList from '@components/ChannelList'
// import DMList from '@components/DMList'
//Pages
// const Channel = loadable(() => import('@pages/Channel'))
// const DirectMessage = loadable(() => import('@pages/DirectMessage'))

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import useSocket from '@hooks/useSocket'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

import {
    Fade32,
    OpenPanelLeft20,
    OpenPanelFilledLeft20,
    Search20,
    Notification20,
    AppSwitcher20,
    User20,
} from '@carbon/icons-react'
import {
    Header,
    HeaderName,
    SkipToContent,
    HeaderMenuButton,
    HeaderGlobalAction,
    HeaderGlobalBar,
    SideNav,
    SideNavItem,
    SideNavMenu,
    SideNavMenuItem,
    Grid,
    Row,
    Column,
} from 'carbon-components-react'

const Workspace = () => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()

    /* SWR */
    const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher)

    const { data: channelData } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null,
        fetcher,
    )

    /* Soket */
    const [socket, disconnect] = useSocket(workspace)

    /* State */
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('')
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('')

    /* Event UI */
    /*SideMenu-Left : Channel List*/
    const [sideNavExpanded, setSideNavExpand] = useState(true)
    const onClickSideNavExpand = useCallback(() => {
        setSideNavExpand((prev) => !prev)
    }, [])
    /*SideMenu-Right : Profile*/
    const [showUserMenu, setShowUserMenu] = useState(false)
    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev)
    }, [])

    /*Modal Control*/
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false)
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false)
        setShowCreateChannelModal(false)
        setShowInviteWorkspaceModal(false)
    }, [])

    /*Workspace*/
    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true)
    }, [])
    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev)
    }, [])

    /*Channel*/
    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true)
    }, [])

    /*Invite*/
    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true)
    }, [])

    /* Loading useEffect */
    useEffect(() => {
        if (channelData && userData && socket) {
            socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) })
            // console.log('login socket', socket);
        }
    }, [socket, channelData, userData])

    useEffect(() => {
        return () => {
            disconnect()
        }
    }, [workspace, disconnect])

    /* Event Axios */
    const onLogOut = useCallback(() => {
        axios
            .post('/api/users/logout')
            .then(() => {
                revalidateUser()
            })
            .catch((error) => {
                console.dir(error)
                toast.error(error.response?.data, { position: 'bottom-center' })
            })
    }, [revalidateUser])

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
        [newWorkspace, newUrl, revalidateUser, setNewWorkspace, setNewUrl],
    )

    /* Navigate Redirection */
    // console.log('param-workspace : ' + workspace);

    if (userData === false) {
        return <Navigate replace to="/login" />
    } else if (userData != undefined && !userData.Workspaces.find((v) => v.url === workspace)) {
        return <Navigate replace to="/workspace" />
    }

    return (
        <div>
            <Header aria-label="CARBON Platform Name">
                <SkipToContent />

                {sideNavExpanded ? (
                    <HeaderGlobalAction
                        aria-label="Close menu"
                        onClick={onClickSideNavExpand}
                        isActive={sideNavExpanded}
                    >
                        <OpenPanelFilledLeft20 />
                    </HeaderGlobalAction>
                ) : (
                    <HeaderGlobalAction
                        aria-label="Open menu"
                        onClick={onClickSideNavExpand}
                        isActive={sideNavExpanded}
                    >
                        <OpenPanelLeft20 />
                    </HeaderGlobalAction>
                )}
                <HeaderName prefix="CARBON">
                    <Link to="/">[Platform]</Link>
                </HeaderName>
                <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                        <Search20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                        <Notification20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                        aria-label="Account"
                        onClick={onClickUserProfile}
                        tooltipAlignment="end"
                        isActive={showUserMenu}
                    >
                        <User20 />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
                <SideMenuRight show={showUserMenu} onLogOut={onLogOut} />
                <SideMenuLeft show={sideNavExpanded} />
            </Header>
            <div style={{ display: 'flex', flex: 1 }}>
                <div
                    style={{
                        flex: 1,
                        marginTop: '3rem',
                        paddingLeft: sideNavExpanded ? '16rem' : '3rem',
                    }}
                >
                    TEST
                </div>
            </div>
        </div>
    )
}

export default Workspace
