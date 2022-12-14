import React from 'react';

export interface AppContextParam {
    selectedCollection?: chrome.bookmarks.BookmarkTreeNode,
    isCollectionEditing?: boolean,
    select?: (collection: chrome.bookmarks.BookmarkTreeNode | null) => void;
    isSidebarOpen?: boolean;
    restoreSelectedCollection?: () => void;
    searchData?: chrome.bookmarks.BookmarkTreeNode[];
    setSearchData?: (data: chrome.bookmarks.BookmarkTreeNode[]) => void;
    searching?: boolean;
    setSearching?: (val: boolean) => void
    setIsCollectionEditing?: (val: boolean) => void,
    currentView?: string,
    setCurrentView?: (viewName: string) => void
}

const AppContext = React.createContext<AppContextParam>({});

export default AppContext;