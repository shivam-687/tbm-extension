
import React, { createRef, useRef } from 'react';
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
    onOpen?: () => void;
}


function TbmSidebarNavItem(props: TbmSidebarNavItemProps) {
    const [children, setChildren] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
    const { select, selectedCollection } = useContext(BookmarkContext);
    const [isActive, setIsActive] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);
    const [scrollHeight, setScrollHeight] = useState<number>(0)
    const pref = useRef<HTMLDivElement>(null)

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
            props.onOpen && props.onOpen();
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
            setChildren((prev) => [...prev.filter(cl => cl.id !== id)]);
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


    const onChildOpen = () => {
        if(!isCollapse) {
            setIsCollapse(true);
            props.onOpen && props.onOpen();
        };
    }


    return (
        <>

            <div className='px-2' >
                <div className={`flex items-center  justify-between group py-2 px-2 rounded-md ${isActive ? 'text-primary bg-primary/10': 'text-base hover:text-primary'}`}>
                    <div className={`text-base flex items-center gap-2 cursor-pointer `} onClick={onSelect}>

                        <span className={`inline-block text-xl transition duration-300  ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                            {
                                isCollapse
                                    ? <HiFolderOpen />
                                    : <HiFolder />
                            }
                        </span>
                        <p className=' line-clamp-1 transition duration-300 capitalize' >{props.data.title}</p>
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
                    <div ref={pref} className={` transition-all overflow-hidden`} style={{transitionDuration: children.length > 0 ? `${(children.length * 20) + 50}ms`:'300ms', height: isCollapse?`${pref.current?.scrollHeight ? pref.current?.scrollHeight+'px': '100%'}`:'0px'}}>
                        {
                            children.map((b, index) => {
                                return <div key={index} style={{transitionDelay: `${index * 50}ms`}} className={` transition-all  duration-200  ${isCollapse ? 'translate-y-0 opacity-100': '-translate-y-2 opacity-0'}`}><TbmSidebarNavItem data={b} onOpen={onChildOpen} /></div>
                            })
                        }
                    </div>
                }

            </div>
        </>
    )
}

export default TbmSidebarNavItem

