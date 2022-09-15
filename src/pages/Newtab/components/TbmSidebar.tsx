import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi'
import AppContext from '../context/AppContext';
import CreateCollection from './CreateCollection';
import Logo from './Logo';
import TbmSidebarNavItem from './TbmSidebarNavItem';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css'
import { LayoutContext } from '../context/LayoutProvider';

function TbmSidebar() {
    const { isSidebarOpen, toggleSideBar } = useContext(LayoutContext);
    const [colls, setCols] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);

    const init = () => {
        chrome.bookmarks.getTree().then(result => {
            const r = result[0].children?.filter(b => {
                return Object.keys(b).includes('children');
            })
            setCols(r ? [...r] : []);
        })
    }

    useEffect(() => {
        init();
    }, []);


    const sidebarContent =
        <>
            <div className="top-head px-2 py-4 flex items-center justify-center border-b border-b-base-content/40">
                <Logo />
            </div>

            <div className='pt-4'>
                {
                    colls.length > 0 && colls.map((collection, index) => {
                        return (
                            <TbmSidebarNavItem data={collection} key={index} />
                        )
                    })
                }
            </div>
        </>



    return (
        <>
            <div className='w-60 h-full relative border-r border-r-base-200 hidden md:block'>
                {sidebarContent}
            </div>
            <div className="block md:hidden z-50">
                <Drawer
                    open={isSidebarOpen}
                    onClose={toggleSideBar}
                    direction='left'
                    className='bla bla bla'
                >
                    <div className='bg-base-200 h-full'>
                        {sidebarContent}
                    </div>
                </Drawer>
            </div>
        </>

    )
}

export default TbmSidebar


