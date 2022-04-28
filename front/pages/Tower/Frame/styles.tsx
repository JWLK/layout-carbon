import styled from '@emotion/styled'
import { NumberInput, Slider } from 'carbon-components-react'

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
    background: rgba(0, 0, 0, 1);
    @media (max-width: 1000px) {
        width: 100%;
        max-width: 100%;
        height: 600px;
        padding: 10px 15px;
    }
`
export const GraphicViewOrigin = styled.div`
    width: 100%;
    height: calc(100% - 20px);
    max-width: 320px;
    max-height: 1000px;
    // border: 0.1px solid #eee;
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
    flex-direction: column;
    flex-wrap: wrap;
    overflow-y: auto;
    width: 40%;
    max-width: 1000px;
    min-height: 600px;
    height: calc(100vh - 48px);
    background: rgba(0, 100, 0, 0);
    padding: 1rem 25px;

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
    // border: 0.1px solid #eee;
`

/* Setting Component */
export const SettingTitle = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.3;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
`

export const InputLabel = styled.div`
    color: #c6c6c6;
    font-size: 1rem;
    font-weight: regular;
    line-height: 1.5;
    margin-bottom: 1rem;
`
export const InputDivider = styled.div`
    width: 100%;
    height: 1px;
    margin: 1.3rem auto 1.5rem auto;
    background-color: #393939;
`

/* Custom Carbon Design Component */

export const NumberInputCustom = styled(NumberInput)`
    .bx--number__input-wrapper input {
        // height: inherit;
        font-size: 1rem;
    }
`
export const SliderCustom = styled.div`
    .bx--slider-container {
        width: 100%;
    }
    .bx--slider__range-label {
        font-size: 1rem;
    }
    .bx--slider-text-input {
        width: 10rem;
        font-size: 1rem;
    }
    .bx--slider {
        min-width: 5rem;
    }

    @media (max-width: 500px) {
        .bx--slider__range-label {
            font-size: 0.8rem;
        }
        .bx--slider-text-input {
            width: 5rem;
            font-size: 0.8rem;
        }
        .bx--slider {
            min-width: 5rem;
        }
    }
`
