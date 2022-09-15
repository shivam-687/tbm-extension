import React from 'react';

export interface AppContextParam {
    selectedCollection?: chrome.bookmarks.BookmarkTreeNode,
    select?: (collection: chrome.bookmarks.BookmarkTreeNode | null) => void;
    isSidebarOpen?: boolean;
    restoreSelectedCollection?: () => void;
    searchData?: chrome.bookmarks.BookmarkTreeNode[];
    setSearchData?: (data: chrome.bookmarks.BookmarkTreeNode[]) => void;
    searching?: boolean;
    setSearching?: (val: boolean) => void
}

const AppContext = React.createContext<AppContextParam>({});

export default AppContext;