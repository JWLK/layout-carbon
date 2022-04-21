import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, NavLinkProps, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import gravatar from 'gravatar'
import loadable from '@loadable/component'
//Components
import TopMenu from '@components/Common/TopMenu'
import SideMenuRight from '@components/Common/SideMenuRight'
import SideMenuLeft from '@components/Workspace/SideMenuLeft'
// import InviteWorkspaceModal from '@components/InviteWorkspaceModal'

//Pages
const ContentsLayout = loadable(() => import('@pages/Common/ContentsLayout'))
const Dashboard = loadable(() => import('@pages/Workspace/Dashboard'))
const Channel = loadable(() => import('@pages/Workspace/Channel'))
const DirectMessage = loadable(() => import('@pages/Workspace/DirectMessage'))
const Project = loadable(() => import('@pages/Workspace/Project'))
//Tower Pages
const Model_01 = loadable(() => import('@pages/Tower/01_'))
const Model_02 = loadable(() => import('@pages/Tower/02_'))

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import useSocket from '@hooks/useSocket'
import { useGlobal } from '@hooks/useGlobal'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

//Css
import { Logo, Wrapper, Contents } from './styles'
//Carbon
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
    SkipToContent,
    HeaderMenuButton,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
    HeaderGlobalAction,
    HeaderGlobalBar,
} from 'carbon-components-react'

const Workspace = () => {
    /*Size Check*/
    const { siteTitle, width } = useGlobal()

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

    /* Loading useEffect */
    useEffect(() => {
        if (width < 1056 && sideNavExpanded === true) {
            setSideNavExpand(false)
        } else if (width >= 1056 && sideNavExpanded === false) {
            setSideNavExpand(true)
        }
    }, [width])

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

    /* Open LocalStorage */
    if (localStorage.getItem('workspace-open') === null) {
        localStorage.setItem('workspace-open', JSON.stringify([workspace]))
    } else {
        var tabList = JSON.parse(localStorage.getItem('workspace-open')!)
        if (!tabList.includes(workspace)) {
            tabList.push(workspace?.toString())
            localStorage.setItem('workspace-open', JSON.stringify(tabList))
        }
    }

    /* Navigate Redirection */
    // console.log('param-workspace : ' + workspace);
    if (userData === false) {
        return <Navigate replace to="/login" />
    } else if (userData != undefined && !userData.Workspaces.find((v) => v.url === workspace)) {
        return <Navigate replace to="/home" />
    }

    return (
        <>
            <Header aria-label="CARBON Platform">
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
                <Logo>
                    <Link to={`/workspace/${workspace}/`}>{siteTitle} [Platform]</Link>
                </Logo>
                <TopMenu />
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
                <SideMenuRight show={showUserMenu} onLogOut={onLogOut} trans="false" />
                <SideMenuLeft show={sideNavExpanded} />
            </Header>
            <Wrapper>
                <Contents expand={sideNavExpanded}>
                    <Routes>
                        <Route path="/contentslayout/" element={<ContentsLayout />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/project/" element={<Project />} />
                        <Route path="/model_01/" element={<Model_01 />} />
                        <Route path="/model_02/" element={<Model_02 />} />
                        <Route path="/channel/:channel" element={<Channel />} />
                        <Route path="/dm/:id" element={<DirectMessage />} />
                    </Routes>
                </Contents>
            </Wrapper>
        </>
    )
}

export default Workspace
