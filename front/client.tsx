// //client.tsx
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { SWRDevTools } from 'swr-devtools'

import axios from 'axios'

import App from '@layouts/App'
import './global.scss'

axios.defaults.withCredentials = true
axios.defaults.baseURL =
    process.env.NODE_ENV === 'production' ? 'https://production.com' : 'http://localhost:3090'
console.log('env', process.env.NODE_ENV === 'production')
render(
    <BrowserRouter>
        {process.env.NODE_ENV === 'production' ? (
            <App />
        ) : (
            <SWRDevTools>
                <App />
            </SWRDevTools>
        )}
    </BrowserRouter>,
    document.querySelector('#app'),
)
