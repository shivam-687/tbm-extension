import React, { useEffect, useState } from 'react';

export interface BookmarkContextParam {
    selectedCollection?: chrome.bookmarks.BookmarkTreeNode | null,
    select?: (collection: chrome.bookmarks.BookmarkTreeNode | null) => void;
    restoreSelectedCollection?: () => void;
    searchData?: chrome.bookmarks.BookmarkTreeNode[];
    setSearchData?: (data: chrome.bookmarks.BookmarkTreeNode[]) => void;
    searching?: boolean;
    setSearching?: (val: boolean) => void
}

export const BookmarkContext = React.createContext<BookmarkContextParam>({});


const BookmarkProvider = (props: React.PropsWithChildren<{}>) => {

    const [selectedCollection, select] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);
    const [searchData, setSearchData] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
    const [searching, setSearching] = useState<boolean>(false);

    const onSelect = (collection: chrome.bookmarks.BookmarkTreeNode | null) => {
        select(collection);
        if (collection) {
            saveCollection(collection)
        }
    }

    const saveCollection = async (collection: chrome.bookmarks.BookmarkTreeNode) => {
        await chrome.storage.sync.set({ 'currentSelection': collection });
    }

    const restoreSelectedCollection = async () => {
        const result = await chrome.storage.sync.get('currentSelection');
        if (Object.keys(result).length <= 0) {
            chrome.bookmarks.getTree().then(result => {
                const r = result[0].children?.filter(b => {
                    return Object.keys(b).includes('children');
                })
                if (r && r.length > 0) {
                    select && select(r[0]);
                    saveCollection(r[0]);
                }
            })
        } else {
            select(result['currentSelection']);
        }
    }

    useEffect(() => {
        restoreSelectedCollection();
    }, [])

    return <BookmarkContext.Provider value={
        {
            select: onSelect,
            selectedCollection,
            searchData,
            setSearchData,
            searching,
            setSearching,
            restoreSelectedCollection
        }
    }>{props.children}</BookmarkContext.Provider>
}

export default BookmarkProvider;