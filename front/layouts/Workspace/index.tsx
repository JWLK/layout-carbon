import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Navigate, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import gravatar from 'gravatar'

import axios from 'axios'
import useSWR from 'swr'

import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'

import { Search20, Notification20, AppSwitcher20, Fade16 } from '@carbon/icons-react'
import {
    Header,
    HeaderName,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
    HeaderPanel,
    Switcher,
    SwitcherItem,
    SwitcherDivider,
    SideNav,
    SideNavItem,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
} from 'carbon-components-react'

const Workspace = () => {
    const params = useParams<{ workspace?: string }>()
    const { workspace } = params

    const {
        data: userData,
        error,
        mutate: revalidateUser,
    } = useSWR<IUser | false>('/api/users', fetcher)
    const { data: channelData } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null,
        fetcher,
    )

    /* state */
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('')
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('')

    /* Menu */
    const [showUserMenu, setShowUserMenu] = useState(false)
    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev)
    }, [])

    /* Modal */
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false)
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false)
        setShowCreateChannelModal(false)
        setShowInviteWorkspaceModal(false)
    }, [])
    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true)
    }, [])
    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true)
    }, [])
    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true)
    }, [])
    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev)
    }, [])

    /* Event */

    /* Request */
    const onLogout = useCallback(() => {
        axios
            .post('/api/users/logout', null, { withCredentials: true })
            .then((response) => {
                revalidateUser(false, false)
            })
            .catch((error) => {
                console.log(error.response)
            })
    }, [])

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

    /* Page Navigation */
    console.log(error, userData)
    if (userData === false) {
        console.log('Logout Completed')
        return <Navigate replace to="/" />
    }

    return (
        <div>
            <Header aria-label="EVONUS TOWER Platform Name">
                <HeaderName href="#" prefix="EVONUS">
                    [Platform]
                </HeaderName>
                <HeaderNavigation aria-label="EVONUS [Platform]">
                    <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
                    <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
                    <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
                    <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                        <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                        <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                        <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
                    </HeaderMenu>
                </HeaderNavigation>
                <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
                        <Search20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
                        <Notification20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="App Switcher" onClick={onClickUserProfile}>
                        <AppSwitcher20 />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
                {showUserMenu && (
                    <HeaderPanel aria-label="Header Panel" expanded>
                        <Switcher aria-label="Switcher Container">
                            <SwitcherItem isSelected aria-label="Link 1" href="#">
                                Link 1
                            </SwitcherItem>
                            <SwitcherDivider />
                            <SwitcherItem href="#" aria-label="Link 2">
                                Link 2
                            </SwitcherItem>
                            <SwitcherItem href="#" aria-label="Link 3">
                                Link 3
                            </SwitcherItem>
                            <SwitcherDivider />
                            <SwitcherItem href="#" aria-label="Link 4">
                                Link 4
                            </SwitcherItem>
                        </Switcher>
                    </HeaderPanel>
                )}
                <SideNav>
                    <SideNavItem>
                        <SideNavMenu renderIcon={Fade16} title="Category title" isActive={true}>
                            <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
                            <SideNavMenuItem aria-current="page" href="javascript:void(0)">
                                Link
                            </SideNavMenuItem>
                            <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
                        </SideNavMenu>
                        <SideNavLink renderIcon={Fade16} href="javascript:void(0)">
                            Link
                        </SideNavLink>
                        <SideNavLink renderIcon={Fade16} href="javascript:void(0)">
                            Link
                        </SideNavLink>
                    </SideNavItem>
                </SideNav>
            </Header>
        </div>
    )
}

export default Workspace
