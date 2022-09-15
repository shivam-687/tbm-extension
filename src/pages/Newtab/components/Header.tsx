import React, { useContext } from 'react'
import ThemeSwitcher from './ThemeSwitcher';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { Fade } from 'react-awesome-reveal';
import Search from './Search';
import { LayoutContext } from '../context/LayoutProvider';
import { BookmarkContext } from '../context/BookmarkProvider';

function Header() {
    const { selectedCollection } = useContext(BookmarkContext);
    const { toggleSideBar } = useContext(LayoutContext);
    return (
        <div className="flex item-center justify-between px-5 border-b border-b-base-200 gap-2 py-2">
            <div className=" flex items-center max-w-xs">
                {/* <h2 className="text-lg font-bold line-clamp-none hidden md:line-clamp-1 md:block text-primary">
                    <Fade duration={300}>
                        {selectedCollection?.title}
                    </Fade>
                </h2> */}
                <button className='md:hidden btn text-2xl' onClick={toggleSideBar}><span className='inline-block'><RiMenuUnfoldLine /></span></button>
            </div>
            <div className="flex items-center justify-center w-full">
                <Search />
            </div>
            <div className=" flex items-center">
                <ThemeSwitcher />
            </div>
        </div>
    )
}

export default Header