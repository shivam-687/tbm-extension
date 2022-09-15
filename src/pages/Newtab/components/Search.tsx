import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../context/AppContext'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { BookmarkContext } from '../context/BookmarkProvider'

export type SearchProps = {
    onSearch?: (data: chrome.bookmarks.BookmarkTreeNode[]) => void
}

function Search(props: SearchProps) {
    const { select, selectedCollection, restoreSelectedCollection, setSearching, setSearchData } = useContext(BookmarkContext);
    const [query, setQuery] = useState<string>('');
    const [curSearching, setCurSearching] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputFocus, setInputFocus] = useState(false);


    const searchStart = () => {
        if (curSearching) return;
        setCurSearching(true);
        setSearching && setSearching(true);
        select && select(null);
    }

    const searchEnd = () => {
        setQuery('');
        setCurSearching(false);
        setSearching && setSearching(false);
        restoreSelectedCollection && restoreSelectedCollection();
    }

    const getSearch = async () => {
        chrome.bookmarks.search(query, val => {
            const value = val.length > 0 ? [...val.filter(b => Object.keys(b).includes('url'))] : [];
            props.onSearch && props.onSearch([...value]);
            setSearchData && setSearchData([...value]);
        })
    }

    useEffect(() => {
        if (query.trim() !== '') {
            searchStart();
            getSearch()
        }

        if (query.trim() === '' && curSearching) {
            searchEnd();
        }

    }, [query]);

    const searchFor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.currentTarget.value || '');


    }

    const onFoc = (ev: React.FocusEvent<HTMLInputElement>) => {

        setInputFocus(true);
    }
    const onBl = (ev: React.FocusEvent<HTMLInputElement>) => {

        setInputFocus(false);
    }

    return (

        <div className={`flex border max-w-md w-full rounded overflow-hidden ${inputFocus ? 'border-primary' : 'border-base-300'} `}>
            <input type="text" placeholder="Type here" className="p-2 text-base w-full flex-grow focus:outline-none bg-base-100" value={query} onChange={searchFor} ref={inputRef} onFocusCapture={onFoc} onBlur={onBl} />
            <button className={`inline-flex items-center flex-grow-0 p-2 text-2xl active:bg-base-200 transition duration-300 ${curSearching ? 'inline-flex' : 'hidden'}`} onClick={searchEnd}><IoMdCloseCircleOutline /></button>
        </div>

    )
}

export default Search