import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { MentionsInput } from 'react-mentions'
import { Button } from 'carbon-components-react'

export const ChatArea = styled.div`
    display: flex;
    width: 100%;
    padding-top: 0;
    background: #222;
`

export const Form = styled.form`
    color: #c6c6c6;
    font-size: 16px;
    width: 100%;
`

export const MentionsTextarea = styled(MentionsInput)`
    font-family: Slack-Lato, appleLogo, sans-serif;
    font-size: 16px;
    padding: 8px 9px;
    margin-bottom: 2px;

    & strong {
        background: skyblue;
    }

    & textarea {
        height: 48px;
        padding: 9px 10px !important;
        outline: none !important;
        border-radius: 0px !important;
        resize: none !important;
        line-height: 21px;
        border: none;
        color: #fff;
    }

    & ul {
        border: 1px solid lightgray;
        max-height: 200px;
        overflow-y: auto;
        padding: 9px 10px;
        background: white;
        border-radius: 0px;
        width: 150px;
    }
`

export const Toolbox = styled.div`
    position: relative;
    background: #222;
    height: 41px;
    display: flex;
    border-top: 1px solid #222);
    align-items: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`

export const SendButton = css`
    position: absolute;
    right: 5px;
    top: 5px;
`

export const EachMention = styled.button<{ focus: boolean }>`
    padding: 4px 20px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    color: rgb(28, 29, 28);
    width: 100%;

    & img {
        margin-right: 5px;
    }

    ${({ focus }) =>
        focus &&
        `
        background: #222;
        color: white;
    `};
`
