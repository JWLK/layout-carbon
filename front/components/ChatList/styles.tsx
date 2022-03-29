import styled from '@emotion/styled'

export const ChatZone = styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    background: #222;
    margin-bottom: 10px;
`

export const Section = styled.section`
    margin-top: 20px;
    border-top: 1px solid #222;
`

export const StickyHeader = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
    width: 100%;
    position: sticky;
    top: 14px;

    & button {
        font-weight: bold;
        font-size: 13px;
        height: 28px;
        line-height: 27px;
        padding: 0 16px;
        z-index: 2;
        border-radius: 24px;
        position: relative;
        top: -13px;
        color: #f4f4f4;
        background: #222;
        border: none;
        outline: none;
    }
`
