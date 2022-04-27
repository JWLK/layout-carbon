import styled from '@emotion/styled'

export const FlexWrap = styled.div`
    display: flex;
    @media (max-width: 1000px) {
        flex-direction: column;
    }
`

export const GraphicWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 30%;
    max-width: 400px;
    min-height: 600px;
    height: calc(100vh - 48px);
    background: rgba(100, 0, 0, 0.1);
    @media (max-width: 1000px) {
        width: 100%;
        max-width: 100%;
        height: 600px;
        padding: 10px 15px;
    }
`
export const GraphicViewStretch = styled.div`
    width: 100%;
    height: calc(100% - 20px);
    max-width: 320px;
    max-height: 1000px;
    border: 0.1px solid #eee;
`
export const GraphicViewHarf = styled.div`
    width: 100%;
    height: calc(50% - 10px);
    max-width: 320px;
    max-height: 500px;
    border: 0.1px solid #eee;
`

export const SettingWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40%;
    max-width: 1000px;
    min-height: 600px;
    height: calc(100vh - 48px);
    background: rgba(0, 100, 0, 0.1);
    padding: 0px 25px;

    @media (max-width: 1000px) {
        width: 100%;
        max-width: 100%;
        height: 600px;
        padding: 10px 15px;
    }
`
export const SettingView = styled.div`
    width: 100%;
    height: calc(100% - 20px);
    border: 0.1px solid #eee;
`

export const a = styled.div`
    margin: 2rem 2rem;
`
