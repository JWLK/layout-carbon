import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
interface IGlobal {
    siteTitle: string
    width: number
}
const GlobalContext = createContext<IGlobal>({
    siteTitle: 'SITE TITLE',
    width: window.innerWidth,
})
export const GlobalProvider: FC = ({ children }) => {
    const siteTitle = 'EVO TOWER'
    const [width, setWidth] = useState(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    useEffect(() => {
        window.addEventListener('resize', debounce(handleResize, 100))
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return <GlobalContext.Provider value={{ siteTitle, width }}>{children}</GlobalContext.Provider>
}

export const useGlobal = () => {
    return useContext<IGlobal>(GlobalContext)
}
