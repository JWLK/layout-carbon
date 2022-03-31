import styled from '@emotion/styled'

export const PageTypeWide = styled.div`
    margin: 3rem 2rem;
`
export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 150px);
    position: relative;
    > header,
    div {
        max-width: 1000px;
    }
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
        margin-right: 10px;
    }
`

export const DragOver = styled.div`
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100% - 64px);
    background: white;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
`
