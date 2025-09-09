import { useEffect, useState } from "react"

export function useDimension() {
    const [dimension, setDimension] = useState({ x: 0, y: 0 })
    useEffect(() => {
        function onDimension() {
            setDimension({
                x: window.innerWidth,
                y: window.innerHeight
            })
        }

        window.addEventListener('resize', onDimension)
        return () => window.removeEventListener('resize', onDimension)
    }, [])
    return { dimension }
}