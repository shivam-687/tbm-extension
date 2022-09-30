import React, { useEffect } from 'react'
import { useState } from 'react';
import { useContext } from 'react'
import BookmarkCard from './BookmarkCard';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './bookmark-transition.css'
import { BookmarkContext } from '../context/BookmarkProvider';
import { filterBookmarks, isBookmarkBelongsCollection, parseTitleUrlFromDragEvent } from '../lib/utils';
import CollectionAction from './CollectionAction';

function CollectionLoader() {
    const { selectedCollection, searchData, searching, createBookmark } = useContext(BookmarkContext);
    const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
    const [dragEnter, setDragEnter] = useState(false);
    // const [selectedForMove, setSelectedForMove]

    const init = () => {
        if (!selectedCollection) return setBookmarks([]);
        chrome.bookmarks.getChildren(selectedCollection.id, result => setBookmarks([...filterBookmarks(result).sort((a, b) => b.index! - a.index!)]))

    }

    const handleOnCreateBookmark = (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
        if (!isBookmarkBelongsCollection(selectedCollection!, bookmark)) return;
        init();
    }

    const handleOnRemoveBookmark = (id: string, info: chrome.bookmarks.BookmarkRemoveInfo) => {
        if (!isBookmarkBelongsCollection(selectedCollection!, info.node)) return;
        init();
    }

    const handleOnMoveBookmark = async (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => {
        if(moveInfo.oldParentId === selectedCollection?.id){
            setBookmarks((prev) => [...prev.filter(b => b.id !== id)]);
            return
        }
        if(moveInfo.parentId === selectedCollection?.id){
            const bookmarks = await chrome.bookmarks.get(id);
            if(bookmarks.length > 0){
                setBookmarks(prev => [...prev,bookmarks[0]]);
            }
        }
    }
 

    useEffect(() => {
        if (searching && searchData) {
            setBookmarks([...searchData])
        }
    }, [searching, searchData])

    useEffect(() => {
        if (!selectedCollection) return;
        init();
        chrome.bookmarks.onCreated.addListener(handleOnCreateBookmark);
        chrome.bookmarks.onRemoved.addListener(handleOnRemoveBookmark);
        chrome.bookmarks.onMoved.addListener(handleOnMoveBookmark)

        return (() => {
            chrome.bookmarks.onCreated.removeListener(handleOnCreateBookmark)
            chrome.bookmarks.onRemoved.removeListener(handleOnRemoveBookmark)
            chrome.bookmarks.onMoved.removeListener(handleOnMoveBookmark)
        })
    }, [selectedCollection]);



    const deleteBookmark = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
        setBookmarks(() => bookmarks.filter(b => b.id !== bookmark.id))
    }

    const sort = (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => {
        if (!searching) {
            setBookmarks(() => [...bookmarks]);
        }
    }


    const handleOnDrop = (ev: React.DragEvent) => {
        if (ev.dataTransfer.types.includes('text/uri-list') && ev.dataTransfer.types.includes('text/html')) {
            ev.preventDefault();
            const obj = parseTitleUrlFromDragEvent(ev);
            if (obj && selectedCollection) {
                createBookmark && createBookmark({
                    title: obj.title,
                    url: obj.url,
                    parentId: selectedCollection.id
                })
            }
            setDragEnter(false);
        }
    }

    const handleOnDragOver = (ev: React.DragEvent) => {
        if (ev.dataTransfer.types.includes('text/uri-list') && ev.dataTransfer.types.includes('text/html')) {
            ev.preventDefault();
            if (!dragEnter) setDragEnter(true);
        }
    }
    const handleOnDragEnter = (ev: React.DragEvent) => {
        if (ev.dataTransfer.types.includes('text/uri-list') && ev.dataTransfer.types.includes('text/html')) {
            ev.preventDefault();
            if (!dragEnter) setDragEnter(true);
        }
    }
    const handleOnDragLeave = (ev: React.DragEvent) => {
        if (ev.dataTransfer.types.includes('text/uri-list') && ev.dataTransfer.types.includes('text/html')) {
            ev.preventDefault();
            if (dragEnter) setDragEnter(false);
        }
    }

    return (
        <div className={`container mx-auto relative transition-all duration-200 h-full ${dragEnter ? 'border-2 border-primary' : ''}`} onDrop={handleOnDrop} onDragOver={handleOnDragOver} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave}>
            <div className="flex item-center justify-between px-5 mt-2">
                <div className="flex items-center"><h1 className='text-2xl text-primary capitalize'>{selectedCollection?.title}</h1></div>
                <div className='flex items-center gap-2'>
                    {/* <CreateCollection></CreateCollection> */}
                    <CollectionAction collection={selectedCollection || null} bookmarks={bookmarks} onSort={sort}></CollectionAction>
                </div>
            </div>
            {
                selectedCollection || searching ?
                    <div className="pt-3 px-5">
                        <div >
                            {
                                bookmarks.length > 0 ?
                                    <TransitionGroup className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                                        {
                                            bookmarks.map((b, index) => {
                                                return <CSSTransition timeout={700} classNames='bi' key={index}><BookmarkCard {...b} onDelete={deleteBookmark} /></CSSTransition>
                                            })
                                        }
                                    </TransitionGroup>
                                    :
                                    <div className='py-10 text-2xl font-bold text-center'><h2>No Bookmarks Found!</h2></div>
                            }
                            {/* </div> */}

                        </div>
                    </div>
                    : <div className='flex items-center justify-center'>
                        <h1 className='max-w-sm text-3xl font-bold'>No Collection Selected</h1>
                    </div>
            }
            
        </div>
    )
}

export default CollectionLoader