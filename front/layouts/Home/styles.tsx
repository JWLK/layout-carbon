import styled from '@emotion/styled'

export const Logo = styled.div`
    margin-inline: 1rem;
    font-weight: bold;
    a:hover {
        color: #c6c6c6;
    }
`

export const Wrapper = styled.div`
    display: flex;
    flex: 1;
    height: auto;
    min-height: 100vh;
    background: rgb(36, 53, 58);
    background: linear-gradient(
        240deg,
        rgba(36, 53, 58, 1) 0%,
        rgba(20, 22, 26, 1) 50%,
        rgba(32, 34, 60, 1) 100%
    );
`
export const Contents = styled.div<{ mobile: boolean }>`
    flex: 1;
    margin-top: 3rem;
    padding-left: 3rem;

    ${({ mobile }) =>
        mobile &&
        `
        padding-left: 16rem;
    `};

    @media (max-width: 671px) {
        ${({ mobile }) =>
            mobile &&
            `
            padding-left: 3rem;
        `};
    }
`
