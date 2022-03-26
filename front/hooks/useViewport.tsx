import React, { createContext, FC, useContext, useEffect, useState } from 'react'
import { debounce } from 'lodash'
interface IViewport {
    width: number
}
const ViewportContext = createContext<IViewport>({
    width: window.innerWidth,
})
export const ViewportProvider: FC = ({ children }) => {
    const [width, setWidth] = useState(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    useEffect(() => {
        window.addEventListener('resize', debounce(handleResize, 100))
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return <ViewportContext.Provider value={{ width }}>{children}</ViewportContext.Provider>
}

export const useViewport = () => {
    return useContext<IViewport>(ViewportContext)
}
