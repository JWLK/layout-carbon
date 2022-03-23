import React, { useCallback, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import useInput from '@hooks/useInput'

import axios from 'axios'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { Error, Form, Header, Input, Label, LinkContainer } from '@pages/Signup/styles'
import { ButtonSet, Button } from 'carbon-components-react'
import { UserAccess32 } from '@carbon/icons-react'

const Login = () => {
    const { data: userData, error, mutate } = useSWR('/api/users', fetcher)

    const [email, onChangeEmail] = useInput('')
    const [password, onChangePassword] = useInput('')

    const [logInError, setLogInError] = useState(false)

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            setLogInError(false)

            axios
                .post(
                    '/api/users/login',
                    { email, password },
                    {
                        withCredentials: true,
                    },
                )
                .then(() => {
                    mutate()
                })
                .catch((error) => {
                    console.log(error.response)
                    setLogInError(error.response?.status === 401)
                })
        },
        [email, password, mutate],
    )

    if (userData === undefined) {
        return <div>로딩중...</div>
    }

    /* Navigate Redirection */
    // console.log(error, userData);
    if (!error && userData) {
        console.log('Login Success', userData)
        return <Navigate replace to="/workspace/sleact/channel/일반" />
    }

    return (
        <div id="container">
            <Header>Carbon</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChangeEmail}
                        />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                        />
                    </div>
                    {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                </Label>
                <ButtonSet>
                    <Button as={Link} to="/signup" renderIcon={UserAccess32} isSelected={true}>
                        회원가입
                    </Button>
                    <Button type="submit" renderIcon={UserAccess32}>
                        로그인
                    </Button>
                </ButtonSet>
            </Form>
        </div>
    )
}

export default Login
