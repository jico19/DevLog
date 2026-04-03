import { useState, useRef, useEffect } from "react"
import { Ellipsis } from "lucide-react"

export default function EllipsisMenu({ items = [] }) {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => setOpen(prev => !prev)}
                className="
                    p-1.5 rounded-md
                    text-zinc-500 hover:text-zinc-900
                    hover:bg-zinc-100
                    dark:hover:bg-zinc-800
                    transition
                "
            >
                <Ellipsis size={16} />
            </button>

            {open && (
                <div
                    className="
                        absolute right-0 mt-2 w-32
                        bg-white dark:bg-zinc-900
                        border border-zinc-200 dark:border-zinc-700
                        rounded-lg shadow-lg
                        py-1 z-50
                    "
                >
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                item.onClick()
                                setOpen(false)
                            }}
                            className="
                                w-full text-left px-3 py-2 text-sm text-white
                                hover:bg-zinc-100 dark:hover:bg-zinc-800
                            "
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}