import { createContext, useContext, useEffect, useState } from "react"

export const ThemeContext = createContext(null)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ui-theme",
}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) ?? defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handleChange = () => {
                root.classList.add(mediaQuery.matches ? "dark" : "light")
            }
            
            handleChange() // Initial setup
            mediaQuery.addEventListener("change", handleChange)
            
            return () => mediaQuery.removeEventListener("change", handleChange)
        } else {
            root.classList.add(theme)
        }
    }, [theme])

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        },
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === null) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
