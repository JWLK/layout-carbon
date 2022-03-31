import styled from '@emotion/styled'
import { HeaderPanel } from 'carbon-components-react'

export const HeaderPanelTransparent = styled(HeaderPanel)<{ trans: string }>`
    ${({ trans }) =>
        trans === 'true' &&
        `
        background: rgba(0, 0, 0, 0.1);
    `};
`

export const ProfileMenu = styled.div`
    display: flex;
    padding: 1.5rem 1rem;

    & img {
        display: flex;
    }

    & > div {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    & #profile-name {
        font-weight: bold;
        display: inline-flex;
    }

    & #profile-active {
        font-size: 13px;
        display: inline-flex;
    }
`
