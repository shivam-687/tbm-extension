import React, { useEffect, useState } from "react"

export type ThemeItem = {
    name: string,
    active: boolean,
    theme: {
        bg: string,
        primary: string,
        secondary: string,
        accent: string,
        neutral: string,
        color: string
    }
}

const themeList: string[] = [
    'default',
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
]


export interface ThemeContextParams {
    themeList?: string[],
    activeTheme?: string,
    setTheme?: (theme: string) => void
}

export const ThemeContext = React.createContext<ThemeContextParams>({})


const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
    const [activeTheme, setActiveTheme] = useState<string | null>(null);

    useEffect(() => {
        chrome.storage.sync.get('themeName').then(val => {
            const name = val['themeName'];
            if (name) {
                setTheme(name);
            } else {
                setActiveTheme(null);
            }
        })
    }, [])


    const setTheme = (themeName: string) => {
        const th = themeList.find(thm => {
            return thm === themeName;
        });
        if (!th) return setActiveTheme(null);
        setActiveTheme(th);
        chrome.storage.sync.set({ themeName: th })
    }

    return (
        <ThemeContext.Provider value={{ themeList: themeList, setTheme, activeTheme: activeTheme || undefined }}>
            <div data-theme={activeTheme ? activeTheme : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;