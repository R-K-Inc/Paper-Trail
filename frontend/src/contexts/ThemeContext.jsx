import { createContext, useContext, useEffect, useState } from "react"
import PropTypes from 'prop-types'

export const ThemeContext = createContext(null)

export function ThemeProvider(props) {
    // Destructure inside the function body for ESLint compatibility
    const {
        children,
        defaultTheme = "system",
        storageKey = "shadcn-ui-theme",
    } = props;

    const [theme, setTheme] = useState(
        () => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(storageKey) ?? defaultTheme
            }
            return defaultTheme
        }
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: (theme) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(storageKey, theme)
                    }
                    setTheme(theme)
                },
            }}>
            {children}
        </ThemeContext.Provider>
    )
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    defaultTheme: PropTypes.string,
    storageKey: PropTypes.string
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (context === null) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return context
}