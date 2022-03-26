import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import loadable from '@loadable/component'

import { ViewportProvider } from '@hooks/useViewport'
const Login = loadable(() => import('@pages/Login'))
const Signup = loadable(() => import('@pages/Signup'))
const Workspace = loadable(() => import('@layouts/Workspace'))

const App = () => {
    return (
        <ViewportProvider>
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
                <Route
                    path="/workspace/*"
                    element={<Navigate replace to="/workspace/sleact/channel/일반" />}
                />
                <Route path="/workspace/:workspace/*" element={<Workspace />} />
            </Routes>
        </ViewportProvider>
    )
}

export default App
