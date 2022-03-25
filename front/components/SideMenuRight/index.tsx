import React, { FC } from 'react'
import gravatar from 'gravatar'
//Hooks & Util & Type
import fetcher from '@utils/fetcher'
import { IUser } from '@typings/db'
//Request
import useSWR from 'swr'
//CSS
import { ProfileMenu } from './styles'
import { HeaderPanel, Switcher, SwitcherItem, SwitcherDivider } from 'carbon-components-react'

interface Props {
    show: boolean
    onLogOut: () => void
}

const SideMenuRight: FC<Props> = ({ show, onLogOut }) => {
    /* SWR */
    const { data: userData } = useSWR<IUser | false>('/api/users', fetcher)
    return (
        <>
            {userData && (
                <HeaderPanel aria-label="Header Panel" expanded={show}>
                    <ProfileMenu>
                        <img
                            src={gravatar.url(userData.email, {
                                s: '40px',
                                d: 'retro',
                            })}
                            alt={userData.nickname}
                        />
                        <div>
                            <span id="profile-name">{userData.nickname}</span>
                            <span id="profile-active">Active</span>
                        </div>
                    </ProfileMenu>
                    <Switcher aria-label="Account Container">
                        <SwitcherDivider />
                        <SwitcherItem onClick={onLogOut} aria-label="LOGOUT">
                            LOGOUT
                        </SwitcherItem>
                    </Switcher>
                </HeaderPanel>
            )}
        </>
    )
}

export default SideMenuRight
