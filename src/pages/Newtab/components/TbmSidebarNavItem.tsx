
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { HiFolder, HiFolderOpen } from 'react-icons/hi';
import { IoMdArrowDropup } from 'react-icons/io'
import { BookmarkContext } from '../context/BookmarkProvider';
import { isCollection } from '../lib/utils';


export type TbmSidebarNavItemProps = {
    data: chrome.bookmarks.BookmarkTreeNode,
    active?: boolean,
    link?: string,
    onActive?: (id: string) => void;
}


function TbmSidebarNavItem(props: TbmSidebarNavItemProps) {
    const [children, setChildren] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
    const { select, selectedCollection } = useContext(BookmarkContext);
    const [isActive, setIsActive] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);

    useEffect(() => {
        if (props.data.children && props.data.children.length > 0) {
            const childs = props.data.children.filter(child => {
                return Object.keys(child).includes('children')
            });
            setChildren(childs);
        }
    }, [props.data]);

    useEffect(() => {
        if (selectedCollection && selectedCollection.id === props.data.id) {
            setIsActive(true);
        } else {
            setIsActive(false)
        }
    }, [selectedCollection, props.data])

    const onSelect = () => {
        select && select(props.data)
    }

    const toggleCollapse = () => {
        setIsCollapse(() => !isCollapse);
    }

    const onCreateHandler = (id: string, collection: chrome.bookmarks.BookmarkTreeNode) => {
        if (!isCollection(collection)) return;
        if (collection.parentId === props.data.id) {
            setChildren((prev) => [...prev, collection]);
            // console.log("Collection created",);
        }
    }
    const onRemoveHandler = (id: string, collection: chrome.bookmarks.BookmarkRemoveInfo) => {
        if (!isCollection(collection.node)) return;
        if (collection.parentId === props.data.id) {
            setChildren((prev) => [...prev.filter(cl => cl.id === id)]);
            // console.log("Collection removed", collection);
        }
    }

    useEffect(() => {
        chrome.bookmarks.onCreated.addListener(onCreateHandler);
        chrome.bookmarks.onRemoved.addListener(onRemoveHandler);

        return (() => {
            chrome.bookmarks.onCreated.removeListener(onCreateHandler);
            chrome.bookmarks.onRemoved.removeListener(onRemoveHandler);
        })
    }, [])


    return (
        <>

            <div className='px-2'>
                <div className={`flex items-center justify-between py-2 px-2 rounded-md ${isActive && 'text-primary bg-primary/10'}`}>
                    <div className={`text-base flex items-center gap-2 cursor-pointer `} onClick={onSelect}>

                        <span className={`inline-block text-xl  ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {
                                isCollapse
                                    ? <HiFolderOpen />
                                    : <HiFolder />
                            }
                        </span>
                        <p className=' line-clamp-1 ' >{props.data.title}</p>
                    </div>

                    {
                        (children && children.length > 0)
                        &&
                        <button className="border-none outline-none inline-flex items-center text-base" onClick={toggleCollapse}>
                            <IoMdArrowDropup className={`${isCollapse ? 'rotate-0' : 'rotate-180'} transition-all duration-200`} />
                        </button>
                    }

                </div>

                {
                    (children && children.length > 0)
                    &&
                    <div className={`${isCollapse ? 'h-full' : 'h-0'} transition-all duration-200 overflow-hidden`}>
                        {
                            children.map((b, index) => {
                                return <TbmSidebarNavItem data={b} key={index} />
                            })
                        }
                    </div>
                }

            </div>
        </>
    )
}

export default TbmSidebarNavItem

