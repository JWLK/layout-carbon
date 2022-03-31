import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import loadable from '@loadable/component'

import { GlobalProvider } from '@hooks/useGlobal'
const Login = loadable(() => import('@pages/Login'))
const Signup = loadable(() => import('@pages/Signup'))
const Home = loadable(() => import('@layouts/Home'))
const Workspace = loadable(() => import('@layouts/Workspace'))

const App = () => {
    return (
        <GlobalProvider>
            <Routes>
                {/* Exmple Route Replace 
            <Route path="/*" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/workspace/*" element={<Navigate replace to="/workspace/sleact/channel/일반" />} />
            <Route path="/workspace/:workspace/*" element={<Workspace />} />
            */}
                <Route path="/*" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home/*" element={<Home />} />
                <Route path="/workspace/*" element={<Navigate replace to="/home/manage" />} />
                <Route path="/workspace/:workspace/*" element={<Workspace />} />
            </Routes>
        </GlobalProvider>
    )
}

export default App
