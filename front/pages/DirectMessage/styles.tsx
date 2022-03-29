import styled from '@emotion/styled'

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 150px);
    flex-flow: column;
    position: relative;
`

export const Header = styled.header`
    height: 64px;
    display: flex;
    width: 100%;
    padding: 20px 16px 20px 20px;
    font-weight: bold;
    align-items: center;
    background: #222;
    margin-bottom: 10px;

    & img {
        margin-right: 5px;
    }
`
