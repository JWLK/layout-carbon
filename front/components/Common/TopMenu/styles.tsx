import styled from '@emotion/styled'

export const TopMenuWrapper = styled.ul`
    display: flex;
    margin-inline: 0.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);

    & li a {
        width: 13rem;
    }
    & > button {
        margin-left: -48px;
        height: 44px;
        min-height: 43px;
    }
    :hover {
        background: #222;
        border-bottom: 2px solid rgba(255, 255, 255, 0.8);
    }

    & [aria-current]:not([aria-current='false']) {
        color: #fff;
        border-bottom: 0px solid rgba(255, 255, 255, 0.8);
        :hover {
            border-bottom: 0px solid rgba(255, 255, 255, 0.8);
        }
        ::after {
            left: -2px;
            width: 103%;
        }
    }
`
