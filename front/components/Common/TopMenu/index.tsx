import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, NavLinkProps, NavLink, Routes, Route, Navigate } from 'react-router-dom'

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import { useViewport } from '@hooks/useViewport'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'
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

    if (userData === false) {
        return <Navigate replace to="/login" />
    }

    return (
        <HeaderNavigation aria-label="Workspace">
            <HeaderMenuItem<NavLinkProps>
                element={NavLink}
                to="/home"
                style={(isActive) => ({
                    color: isActive ? 'white' : '',
                })}
            >
                <div style={{ display: 'flex', width: '5rem', textAlign: 'center' }}>
                    <Home16 />
                    <div style={{ marginInline: '0.5rem' }}>HOME</div>
                </div>
            </HeaderMenuItem>
            {userData?.Workspaces.map((ws) => {
                return (
                    <TopMenuWrapper key={ws.id}>
                        <HeaderMenuItem<NavLinkProps>
                            element={NavLink}
                            to={`/workspace/${ws.url}`}
                            // target="_blank"
                        >
                            {ws.name}
                        </HeaderMenuItem>
                        <Button
                            as={Link}
                            to={`/home/manage`}
                            kind="ghost"
                            renderIcon={Close16}
                            tooltipPosition="bottom"
                            tooltipAlignment="end"
                            iconDescription={`Close ${ws.name}`}
                            hasIconOnly
                        />
                    </TopMenuWrapper>
                )
            })}
        </HeaderNavigation>
    )
}

export default TopMenu
