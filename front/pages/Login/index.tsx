import React, { useCallback, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import useInput from '@hooks/useInput'

import axios from 'axios'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { Error, Form, Header, InputWrapper, LinkContainer } from '@pages/Signup/styles'
import { UserAccess32, UserIdentification32, Login32 } from '@carbon/icons-react'
import { TextInput, ButtonSet, Button } from 'carbon-components-react'

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
        return <div>Loading...</div>
    }

    /* Navigate Redirection */
    // console.log(error, userData);
    if (!error && userData) {
        console.log('Login Success', userData)
        return <Navigate replace to="/workspace/sleact/channel/일반" />
    }

    return (
        <div id="container">
            <Header>Login</Header>
            <Form onSubmit={onSubmit}>
                <InputWrapper id="email-label">
                    <div>
                        <TextInput
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChangeEmail}
                            labelText="E-mail"
                            placeholder=""
                        />
                    </div>
                </InputWrapper>
                <InputWrapper id="password-label">
                    <div>
                        <TextInput
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                            labelText="Password"
                            placeholder=""
                        />
                    </div>
                    {logInError && <Error>Email and password combinations do not match.</Error>}
                </InputWrapper>
                <ButtonSet>
                    <Button
                        kind="secondary"
                        as={Link}
                        to="/signup"
                        renderIcon={UserIdentification32}
                    >
                        Signup
                    </Button>
                    <Button type="submit" renderIcon={Login32}>
                        Login
                    </Button>
                </ButtonSet>
            </Form>
        </div>
    )
}

export default Login
