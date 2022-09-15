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

const themeList: ThemeItem[] = [
    {
        name: 'light',
        active: false,
        theme: {
            bg: '#fff',
            primary: '#570DF8',
            secondary: '#F000B8',
            accent: '#37CDBE',
            neutral: '#3D4451',
            color: '#1F2937'
        }
    },
    {
        name: 'dark',
        active: false,
        theme: {
            bg: '#2A303C',
            primary: '#6419E6',
            secondary: '#D926A9',
            accent: '#37CDBE',
            neutral: '#191D24',
            color: '#A6ADBA'
        }
    },
    {
        name: 'cupcake',
        active: false,
        theme: {
            bg: '#FAF7F5',
            primary: '#65C3C8',
            secondary: '#EF9FBC',
            accent: '#EEAF3A',
            neutral: '#291334',
            color: '#291334'
        }
    },
    {
        name: 'bumblebee',
        active: false,
        theme: {
            bg: '#FAF7F5',
            primary: '#E0A82E',
            secondary: '#F9D72F',
            accent: '#18182F',
            neutral: '#2F2F44',
            color: '#333333'
        }
    },
    {
        name: 'emerald',
        active: false,
        theme: {
            bg: '#FFFFFF',
            primary: '#66CC8A',
            secondary: '#377CFB',
            accent: '#EA5234',
            neutral: '#333C4D',
            color: '#333C4D'
        }
    },
    {
        name: 'synthwave',
        active: false,
        theme: {
            bg: '#2D1B69',
            primary: '#E779C1',
            secondary: '#58C7F3',
            accent: '#F3CC30',
            neutral: '#20134E',
            color: '#F9F7FD'
        }
    },
    {
        name: 'retro',
        active: false,
        theme: {
            bg: '#E4D8B4',
            primary: '#EF9995',
            secondary: '#A4CBB4',
            accent: '#EBDC99',
            neutral: '#7D7259',
            color: '#282425'
        }
    },
    {
        name: 'forest',
        active: false,
        theme: {
            bg: '#171212',
            primary: '#1EB854',
            secondary: '#1FD65F',
            accent: '#D99330',
            neutral: '#171212',
            color: '#D7CCCC'
        }
    },
    {
        name: 'night',
        active: false,
        theme: {
            bg: '#0f1729',
            primary: '#3abff8',
            secondary: '#828df8',
            accent: '#f471b5',
            neutral: '#1d283a',
            color: '#b3c5ef'
        }
    },
    {
        name: 'winter',
        active: false,
        theme: {
            bg: '#FFFFFF',
            primary: '#057aff',
            secondary: '#463aa1',
            accent: '#c149ad',
            neutral: '#021431',
            color: '#394e6a'
        }
    },

]


export interface ThemeContextParams {
    themeList?: ThemeItem[],
    activeTheme?: ThemeItem,
    setTheme?: (theme: string) => void
}

export const ThemeContext = React.createContext<ThemeContextParams>({})


const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
    const [activeTheme, setActiveTheme] = useState<ThemeItem | null>(null);

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
            return thm.name === themeName;
        });
        if (!th) return setActiveTheme(null);
        setActiveTheme(th);
        chrome.storage.sync.set({ themeName: th.name })
    }

    return (
        <ThemeContext.Provider value={{ themeList: themeList, setTheme, activeTheme: activeTheme || undefined }}>
            <div data-theme={activeTheme ? activeTheme.name : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;