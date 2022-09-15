import React from 'react'
import BookmarkProvider from '../context/BookmarkProvider'
import LayoutProvider from '../context/LayoutProvider'
import Header from './Header'
import TbmSidebar from './TbmSidebar'

function Layout(props: React.PropsWithChildren<{}>) {
    return (
        <BookmarkProvider>
            <LayoutProvider>
                <div id="apptab" className='h-screen relative flex'>
                    <div className="flex-grow-0 sticky top-0 left-0 z-50">
                        <TbmSidebar></TbmSidebar>
                    </div>
                    <div className="flex-grow overflow-y-auto overflow-x-hidden">
                        <Header />
                        <div id="main-app">
                            {props.children}
                        </div>
                    </div>
                </div>
            </LayoutProvider>
        </BookmarkProvider>
    )
}

export default Layout