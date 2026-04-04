import { useRef, useState, useEffect } from "react"



export default function ResponsiveImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
            { rootMargin: "200px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <div
                className={`absolute inset-0 bg-zinc-100 dark:bg-zinc-800 
                    transition-opacity duration-500 ease-in-out
                    ${loaded ? "opacity-0" : "opacity-100"}`}
            />

            {inView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    className={`max-w-md w-full h-full object-contain transition-opacity duration-500
                        ${loaded ? "opacity-100" : "opacity-0"}`}
                />
            )}
        </div>
    )
}