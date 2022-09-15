import React, { createContext, useState } from 'react';

export type LayoutContextParams = {
    isSidebarOpen: boolean;
    toggleSideBar?: () => void;
    setSidebar?: (isOpen: boolean) => void;
}


export const LayoutContext = createContext<LayoutContextParams>({ isSidebarOpen: false });


const LayoutProvider = (props: React.PropsWithChildren<{}>) => {
    const [isSidebarOpen, setSidebar] = useState<boolean>(false);

    const toggleSideBar = () => {
        setSidebar((isSidebarOpen) => !isSidebarOpen);
    }

    return (
        <LayoutContext.Provider value={{
            isSidebarOpen,
            setSidebar,
            toggleSideBar
        }}>
            {props.children}
        </LayoutContext.Provider>
    );
}

export default LayoutProvider;