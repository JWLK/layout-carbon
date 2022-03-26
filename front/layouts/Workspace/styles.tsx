import styled from '@emotion/styled'

export const Wrapper = styled.div`
    display: flex;
    flex: 1;
`
export const Contents = styled.div<{ expand: boolean }>`
    flex: 1;
    margin-top: 3rem;
    padding-left: 3rem;
    ${({ expand }) =>
        expand &&
        `
        padding-left: 16rem;
    `};
`
