import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeProvider'
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import ThemeCard from './ThemeCard';

function ThemeSwitcher() {
    const { themeList, activeTheme, setTheme } = useContext(ThemeContext);
    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn ">
                {/* <span className="flex-grow"> */}
                <span className='text-2xl tooltip' data-tip="Themes"><HiOutlineColorSwatch /></span>

                {/* </span> */}
                {/* <span className="inline-flex text-2xl"><RiArrowDropDownLine /></span> */}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-60">
                {
                    themeList?.map((th, index) => {
                        return <ThemeCard key={index} theme={th} />
                    })
                }
            </ul>
        </div>
    )
}

export default ThemeSwitcher