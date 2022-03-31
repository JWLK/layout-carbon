import React, { FC, useCallback, useEffect, useRef } from 'react'
import autosize from 'autosize'
import gravatar from 'gravatar'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import { IUser } from '@typings/db'

import { SendFilled32 } from '@carbon/icons-react'
import { Button, Grid, Row, Column } from 'carbon-components-react'
import {
    ChatArea,
    Form,
    MentionsTextarea,
    SendButton,
    Toolbox,
    EachMention,
} from '@components/Workspace/ChatBox/styles'

interface Props {
    onSubmitForm: (e: any) => void
    chat?: string
    onChangeChat: (e: any) => void
    placeholder: string
    data?: IUser[]
}
const ChatBox: FC<Props> = ({ onSubmitForm, chat, onChangeChat, placeholder, data }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current)
        }
    }, [])

    const onKeydownChat = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                if (!e.shiftKey) {
                    e.preventDefault()
                    onSubmitForm(e)
                }
            }
        },
        [onSubmitForm],
    )

    const renderUserSuggestion: (
        suggestion: SuggestionDataItem,
        search: string,
        highlightedDisplay: React.ReactNode,
        index: number,
        focused: boolean,
    ) => React.ReactNode = useCallback(
        (member, search, highlightedDisplay, index, focus) => {
            if (!data) {
                return null
            }
            return (
                <EachMention focus={focus}>
                    <img
                        src={gravatar.url(data[index].email, { s: '20px', d: 'retro' })}
                        alt={data[index].nickname}
                    />
                    <span>{highlightedDisplay}</span>
                </EachMention>
            )
        },
        [data],
    )

    return (
        <ChatArea>
            <Form onSubmit={onSubmitForm}>
                <Grid fullWidth narrow style={{ paddingRight: '0px' }}>
                    <Row condensed style={{ alignItems: 'end' }}>
                        <Column sm={3} md={7} lg={11}>
                            <MentionsTextarea
                                id="editor-chat"
                                value={chat}
                                onChange={onChangeChat}
                                onKeyPress={onKeydownChat}
                                placeholder={placeholder}
                                inputRef={textareaRef}
                                allowSuggestionsAboveCursor
                            >
                                <Mention
                                    appendSpaceOnAdd
                                    trigger="@"
                                    data={
                                        data?.map((v) => ({ id: v.id, display: v.nickname })) || []
                                    }
                                    renderSuggestion={renderUserSuggestion}
                                />
                            </MentionsTextarea>
                        </Column>
                        <Column
                            sm={1}
                            md={1}
                            lg={1}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <Button
                                style={{ alignItems: 'strech' }}
                                type="submit"
                                renderIcon={SendFilled32}
                                iconDescription={'Send Meessage'}
                                hasIconOnly
                                disabled={!chat?.trim()}
                            />
                        </Column>
                    </Row>
                </Grid>
            </Form>
        </ChatArea>
    )
}

export default ChatBox
