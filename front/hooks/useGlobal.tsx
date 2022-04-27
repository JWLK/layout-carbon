import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
interface IGlobal {
    siteTitle: string
    windowWidth: number
    windowHeight: number
}
const GlobalContext = createContext<IGlobal>({
    siteTitle: 'SITE TITLE',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
})
export const GlobalProvider: FC = ({ children }) => {
    const siteTitle = 'EVO TOWER'
    const [windowWidth, setWidth] = useState(window.innerWidth)
    const [windowHeight, setHeight] = useState(window.innerHeight)
    const handleResizeWidth = () => setWidth(window.innerWidth)
    const handleResizeHeight = () => setHeight(window.innerHeight)
    useEffect(() => {
        window.addEventListener('resize', debounce(handleResizeWidth, 100))
        return () => window.removeEventListener('resize', handleResizeWidth)
    }, [])
    useEffect(() => {
        window.addEventListener('resize', debounce(handleResizeHeight, 100))
        return () => window.removeEventListener('resizeH', handleResizeHeight)
    }, [])
    return (
        <GlobalContext.Provider value={{ siteTitle, windowWidth, windowHeight }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobal = () => {
    return useContext<IGlobal>(GlobalContext)
}
