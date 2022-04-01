import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, NavLinkProps, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import dayjs from 'dayjs'

//Hooks & Util & Type
import useInput from '@hooks/useInput'
import fetcher from '@utils/fetcher'
import { IChannel, IUser } from '@typings/db'
//Request
import axios from 'axios'
import useSWR from 'swr'

import { WSTileTitle, WSTileDate } from './styles'

//Carbon
import { Fade20, Launch32 } from '@carbon/icons-react'
import { Grid, Row, Column, Tile, AspectRatio, Button } from 'carbon-components-react'

const WorkspaceList = () => {
    /* SWR */
    const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher)

    if (userData === false) {
        return <Navigate replace to="/login" />
    }

    return (
        <Row as="article" narrow>
            {userData?.Workspaces.map((ws) => (
                //  sm=4/4 md=4/8 lg= 4/12
                <Column key={ws.id} sm={4} md={4} lg={4} style={{ marginBlock: '0.5rem' }}>
                    <Tile>
                        <AspectRatio ratio="16x9">
                            <WSTileTitle>{ws.name}</WSTileTitle>
                            <br />
                            <WSTileDate>
                                <p>Create At</p>
                                <span>{dayjs(ws.createdAt).format('YYYY.MM.DD - h:mm A')}</span>
                            </WSTileDate>
                            <br />
                            <WSTileDate>
                                <p>Updated At</p>
                                <span>{dayjs(ws.updatedAt).format('YYYY.MM.DD - h:mm A')}</span>
                            </WSTileDate>
                            <br />
                            <br />

                            <Button
                                as={Link}
                                to={`/workspace/${ws.url}/`}
                                kind="tertiary"
                                renderIcon={Launch32}
                            >
                                Open {ws.name}
                            </Button>
                        </AspectRatio>
                    </Tile>
                </Column>
            ))}
        </Row>
    )
}

export default WorkspaceList
