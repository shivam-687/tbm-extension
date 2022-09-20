import React from 'react'
import BookmarkProvider from '../context/BookmarkProvider'
import LayoutProvider from '../context/LayoutProvider'
import Header from './Header'
import QuickAccessCom from './QuickAccessCom'
import TbmSidebar from './TbmSidebar'
import TopSites from './TopSites'

function Layout(props: React.PropsWithChildren<{}>) {
    return (
        <BookmarkProvider>
            <LayoutProvider>
                <div id="apptab" className='h-screen relative flex selection:bg-primary selection:text-primary-content'>
                    <div className="flex-grow-0 sticky top-0 left-0 z-50">
                        <TbmSidebar></TbmSidebar>
                    </div>
                    <div className="flex-grow overflow-y-auto relative overflow-x-hidden scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary scrollbar-thumb-rounded-full">
                        <Header />
                        <div id="main-app">
                            {props.children}
                        </div>
                        <div className="fixed flex items-center justify-center bottom-0 left-0 w-full z-10">
                            <div className='relative w-min backdrop-blur-sm px-5 border rounded border-primary/30'><TopSites /></div>
                        </div>
                    </div>
                    <div className="flex-grow-0">
                        <QuickAccessCom />
                    </div>
                </div>
            </LayoutProvider>
        </BookmarkProvider>
    )
}

export default Layout