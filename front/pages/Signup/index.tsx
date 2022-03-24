import React, { useCallback, useState, VFC } from 'react'
import { Link, Navigate } from 'react-router-dom'

import useInput from '@hooks/useInput'

import axios from 'axios'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'

import { Success, Form, Error, InputWrapper, Input, LinkContainer, Header } from './styles'
import { Login32, CheckmarkOutline32 } from '@carbon/icons-react'
import { TextInput, ButtonSet, Button } from 'carbon-components-react'

const Signup = () => {
    const { data: userData, error } = useSWR('/api/users', fetcher)

    const [email, onChangeEmail] = useInput('')
    const [nickname, onChangeNickname] = useInput('')
    const [password, , setPassword] = useInput('')
    const [passwordCheck, , setPasswordCheck] = useInput('')

    /*Error Check*/
    const [mismatchError, setMismatchError] = useState(false)
    const [signUpError, setSignUpError] = useState('')
    const [signUpSuccess, setSignUpSuccess] = useState(false)

    const onChangePassword = useCallback(
        (e) => {
            setPassword(e.target.value)
            setMismatchError(e.target.value !== passwordCheck)
        },
        [passwordCheck],
    )

    const onChangePasswordCheck = useCallback(
        (e) => {
            setPasswordCheck(e.target.value)
            setMismatchError(e.target.value !== password)
        },
        [password],
    )

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            console.log(email, nickname, password, passwordCheck)

            if (!mismatchError && nickname) {
                console.log('회원가입 진행')

                /*Initialized Reset*/
                setSignUpSuccess(false)
                setSignUpError('')

                axios
                    .post('/api/users', {
                        email,
                        nickname,
                        password,
                    })
                    .then((res) => {
                        // console.log(res);
                        setSignUpSuccess(true)
                    })
                    .catch((error) => {
                        console.log(error.response)
                        setSignUpError(error.response.data)
                    })
                    .finally(() => {})
            }
        },
        [email, nickname, password, passwordCheck],
    )

    if (userData === undefined) {
        return <div>Loading...</div>
    }

    /* Navigate Redirection */
    // console.log(error, userData);
    if (!error && userData) {
        console.log('Aleady Login Completed', userData)
        return <Navigate replace to="/workspace/sleact/channel/일반" />
    }

    return (
        <div id="container">
            <Header>
                Singup
                <LinkContainer>
                    Already a member?&nbsp;
                    <Link to="/login">Go to Login</Link>
                </LinkContainer>
            </Header>
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
                <InputWrapper id="nickname-label">
                    <div>
                        <TextInput
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={nickname}
                            onChange={onChangeNickname}
                            labelText="Nick Name"
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
                </InputWrapper>
                <InputWrapper id="password-check-label">
                    <div>
                        <TextInput
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                            labelText="Password Check"
                            placeholder=""
                        />
                    </div>
                    {mismatchError && <Error>Passwords do not match.</Error>}
                    {!nickname && <Error>Please enter your nickname.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                </InputWrapper>
                <ButtonSet style={{ marginBottom: '30px' }}>
                    <Button kind="secondary" as={Link} to="/login" renderIcon={Login32}>
                        Go to Login
                    </Button>
                    <Button type="submit" renderIcon={CheckmarkOutline32}>
                        Complete
                    </Button>
                </ButtonSet>
                {signUpSuccess && <Success>You are registered! Please Login.</Success>}
            </Form>
        </div>
    )
}

export default Signup
