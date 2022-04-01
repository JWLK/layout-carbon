import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, NavLinkProps, NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

//Hooks & Util & Type
import fetcher from '@utils/fetcher'
import { IWorkspace, IUser } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

//Css
import { TopMenuWrapper } from './styles'

//Carbon
import { Fade20, Home16, Close16 } from '@carbon/icons-react'
import {
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
    Button,
} from 'carbon-components-react'

const TopMenu = () => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()

    /* SWR */
    const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher)

    //TabList
    const [stateTabList, setTabList] = useState<String[]>(
        JSON.parse(localStorage.getItem('workspace-open')!),
    )

    let navigate = useNavigate()
    const onCloseTab = (ws: IWorkspace) => {
        if (stateTabList.includes(ws.url)!) {
            stateTabList.splice(stateTabList.indexOf(ws.url), 1)
            localStorage.setItem('workspace-open', JSON.stringify(stateTabList))
            setTabList(JSON.parse(localStorage.getItem('workspace-open')!))
        }
        if (stateTabList.length != 0) {
            navigate(`/workspace/${stateTabList[0]}/`)
        } else {
            navigate('/home/manage/')
        }
    }

    //Redirection
    if (userData === false) {
        return <Navigate replace to="/login" />
    }

    return (
        <HeaderNavigation aria-label="Workspace">
            <HeaderMenuItem<NavLinkProps> element={NavLink} to="/home/manage/">
                <div style={{ display: 'flex', width: '5rem', textAlign: 'center' }}>
                    <Home16 />
                    <div style={{ marginInline: '0.5rem' }}>HOME</div>
                </div>
            </HeaderMenuItem>
            {userData?.Workspaces.map((ws) => {
                return (
                    stateTabList?.includes(ws.url) && (
                        <TopMenuWrapper key={ws.id}>
                            <HeaderMenuItem<NavLinkProps>
                                element={NavLink}
                                to={`/workspace/${ws.url}`}
                                // target="_blank"
                            >
                                {ws.name}
                            </HeaderMenuItem>
                            <Button
                                onClick={() => onCloseTab(ws)}
                                kind="ghost"
                                renderIcon={Close16}
                                tooltipPosition="bottom"
                                tooltipAlignment="end"
                                iconDescription={`Close ${ws.name}`}
                                hasIconOnly
                            />
                        </TopMenuWrapper>
                    )
                )
            })}
        </HeaderNavigation>
    )
}

export default TopMenu
