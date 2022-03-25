import styled from '@emotion/styled'

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
