import React, { useContext } from 'react'
import { ThemeContext, ThemeItem } from '../context/ThemeProvider'


function ThemeCard({ theme }: { theme: string }) {
    const { activeTheme, setTheme } = useContext(ThemeContext);

    const onSelect = () => {
        setTheme && setTheme(theme);
    }
    return (
        
            <div onClick={onSelect} data-theme={theme} className={`flex items-center text-base capitalize p-2 rounded-md cursor-pointer bg-base-100 overflow-hidden ${activeTheme && activeTheme === theme ? 'border border-primary' : 'border'}`} >
                <span className='line-clamp-1 flex-grow block' >{theme}</span>
                <span className='flex gap-1 h-full'>
                    <span className='w-5 h-5 rounded block bg-primary' ></span>
                    <span className='w-5 h-5 rounded block bg-secondary' ></span>
                    <span className='w-5 h-5 rounded block bg-accent' ></span>
                </span>
            </div>
    )
}

export default ThemeCard