import React, { useContext } from 'react'
import { ThemeContext, ThemeItem } from '../context/ThemeProvider'


function ThemeCard({ theme }: { theme: ThemeItem }) {
    const { activeTheme, setTheme } = useContext(ThemeContext);

    const onSelect = () => {
        setTheme && setTheme(theme.name);
    }
    return (
        <div onClick={onSelect} className={`flex mb-2 items-center text-base capitalize p-2 rounded-md cursor-pointer overflow-hidden ${activeTheme && activeTheme.name === theme.name ? 'border border-black' : ''}`} style={{ backgroundColor: theme.theme.bg }}>
            <span className='line-clamp-1 flex-grow block' style={{ color: theme.theme.color }}>{theme.name}</span>
            <span className='flex gap-1 h-full'>
                <span className='w-5 h-5 rounded block' style={{ backgroundColor: theme.theme.primary }}></span>
                <span className='w-5 h-5 rounded block' style={{ backgroundColor: theme.theme.secondary }}></span>
                <span className='w-5 h-5 rounded block' style={{ backgroundColor: theme.theme.accent }}></span>
            </span>
        </div>
    )
}

export default ThemeCard