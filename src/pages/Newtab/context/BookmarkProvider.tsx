import React, { useEffect, useState } from 'react';
import Storage from '../lib/AppStorage';

export interface BookmarkContextParam {
    selectedCollection?: chrome.bookmarks.BookmarkTreeNode | null,
    select?: (collection: chrome.bookmarks.BookmarkTreeNode | null) => void;
    restoreSelectedCollection?: () => void;
    searchData?: chrome.bookmarks.BookmarkTreeNode[];
    setSearchData?: (data: chrome.bookmarks.BookmarkTreeNode[]) => void;
    searching?: boolean;
    setSearching?: (val: boolean) => void;
    createBookmark?: (data: chrome.bookmarks.BookmarkCreateArg) =>  Promise<chrome.bookmarks.BookmarkTreeNode|undefined>
}

export const BookmarkContext = React.createContext<BookmarkContextParam>({});

const CURR_SELECTION_KEY = 'curr_selection';


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

        await Storage.set({ 'curr_selection': collection.id }).catch(err => {
            const error = chrome.runtime.lastError;
            console.log("MY ERROR", err, error)
        });
    }

    const restoreSelectedCollection = async () => {
        const result = await Storage.get(CURR_SELECTION_KEY);
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
            const res = await chrome.bookmarks.get(result[CURR_SELECTION_KEY]);
            if(res.length <= 0){
                await Storage.remove(CURR_SELECTION_KEY)
                return;
            }
            select(res[0]);
        }
    }

    useEffect(() => {
        restoreSelectedCollection();
    }, [])


    const createBookmark = async (args: chrome.bookmarks.BookmarkCreateArg) => {
        const result = await chrome.bookmarks.search(args.url!);
        if(result.find(bk => bk.parentId === selectedCollection?.id)) return;
        return chrome.bookmarks.create(args);
    }

    return <BookmarkContext.Provider value={
        {
            select: onSelect,
            selectedCollection,
            searchData,
            setSearchData,
            searching,
            setSearching,
            restoreSelectedCollection,
            createBookmark
        }
    }>{props.children}</BookmarkContext.Provider>
}

export default BookmarkProvider;