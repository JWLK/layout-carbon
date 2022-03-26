import styled from '@emotion/styled'
import { NavLinkProps } from 'react-router-dom'
import {
    SideNav,
    SideNavItem,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
} from 'carbon-components-react'

export const SideNavBlack = styled(SideNav)`
    background-color: #161616 !important;
    border-right: 1px solid #393939;
    border-left: 1px solid #393939;
`
export const SideNavItemBlack = styled(SideNavItem)`
    & svg {
        fill: #c6c6c6;
    }
    & span {
        color: #c6c6c6 !important;
        display: flex;
        align-items: center;
    }
    & span > svg {
        width: 10px;
        height: auto;
        margin-right: 0.25rem;
    }

    button:hover,
    a:hover {
        background-color: #222 !important;
        cursor: pointer;
    }
    a:focus {
        outline: 2px solid #fff;
    }
    [aria-current]:not([aria-current='false']) {
        font-weight: bold;
        background-color: #222 !important;
        & svg {
            fill: #fff;
        }
        & span {
            color: #fff !important;
        }
    }
`
