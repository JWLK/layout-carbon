import React, { FC, useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { NavLinkProps, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

//Hooks & Util & Type
import useInput from '@hooks/useInput'

import { Fade32, Template32, Dashboard32, DotMark32 } from '@carbon/icons-react'
import { SideNavLink, SideNavMenu, SideNavMenuItem, SideNavDivider } from 'carbon-components-react'
import { SideNavBlack, SideNavItemBlack } from './styles'
import ChannelList from './ChannelList'
import DMList from './DMList'

interface Props {
    show: boolean
}

const SideMenuLeft: FC<Props> = ({ show }) => {
    /* Parameter */
    const { workspace } = useParams<{ workspace?: string }>()

    return (
        <>
            <SideNavBlack aria-label="Side navigation" isRail expanded={show}>
                <SideNavItemBlack>
                    <ul>
                        {/* <SideNavLink<NavLinkProps>
                            element={NavLink}
                            renderIcon={Template32}
                            large
                            to={`/workspace/${workspace}/contentslayout/`}
                        >
                            Contents Layout
                        </SideNavLink> */}
                        <SideNavLink<NavLinkProps>
                            element={NavLink}
                            renderIcon={Dashboard32}
                            large
                            to={`/workspace/${workspace}/`}
                        >
                            DashBoard
                        </SideNavLink>
                        <SideNavDivider />
                        <SideNavLink<NavLinkProps>
                            element={NavLink}
                            renderIcon={DotMark32}
                            large
                            to={`/workspace/${workspace}/initwallvalue/`}
                        >
                            01. Initial Wall Value
                        </SideNavLink>
                        <SideNavLink<NavLinkProps>
                            element={NavLink}
                            renderIcon={DotMark32}
                            large
                            to={`/workspace/${workspace}/wallbodysection/`}
                        >
                            02. Wall Body Section
                        </SideNavLink>
                        <SideNavDivider />
                        <SideNavLink<NavLinkProps>
                            element={NavLink}
                            renderIcon={Fade32}
                            large
                            to={`/workspace/${workspace}/project/`}
                        >
                            Project
                        </SideNavLink>
                        <SideNavDivider />
                        <ChannelList />
                        <SideNavDivider />
                        <DMList />
                    </ul>
                </SideNavItemBlack>
            </SideNavBlack>
        </>
    )
}

export default SideMenuLeft
