import React, { createRef, useEffect, useRef, useState } from 'react';
import { getFaviconUrl } from '../../../helpers';
import { FiMoreVertical } from 'react-icons/fi';
import 'react-dropdown/style.css';

export interface BookmarkCardProps extends chrome.bookmarks.BookmarkTreeNode {
    onDelete?: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void
}

const BookmarkCard = (props: BookmarkCardProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const urlRef = useRef<HTMLParagraphElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const favicon = getFaviconUrl(props.url!);
    const openTab = (e: React.MouseEvent<HTMLElement>) => {
        if (!editMode) {
            chrome.tabs.update({ url: props.url });
        }
        console.log(e.currentTarget.contentEditable)
    }

    const openInNewTab = () => {
        if (!editMode) {
            chrome.tabs.create({ url: props.url });
        }
    }

    const edit = () => {
        console.log("Edit mode on");
        setEditMode(true);
        titleRef.current?.focus({ preventScroll: true });
    }


    const updateTitle = async () => {
        console.log("Title updating");
        const ele = titleRef.current;
        if (ele?.textContent?.trim() === '') {
            console.log("invalid title");
            ele.textContent = props.title;
            return Promise.resolve();
        }
        await chrome.bookmarks.update(props.id, { title: ele?.textContent! })

    }
    const updateUrl = async () => {
        console.log("Url updating");
        const ele = urlRef.current;
        if (ele?.textContent?.trim() === '') {
            console.log("invalid title");
            ele.textContent = props.url!;
            return Promise.resolve();
        }
        await chrome.bookmarks.update(props.id, { url: ele?.textContent! })
    }



    const save = async () => {
        await updateTitle();
        await updateUrl();
        setEditMode(false);
    }

    const deleteB = async () => {
        const { onDelete, ...rest } = props;
        await chrome.bookmarks.remove(props.id);
        onDelete && onDelete(rest)
    }


    return (
        <div className="w-full">
            <div className={`bkm-card px-5 py-5 rounded-md shadow hover:shadow-md hover:shadow-primary/20 transition duration-200 shadow-primary/20 items-center flex gap-5 ${editMode ? 'border border-dashed' : ''}`}>
                <div className="avatar ">
                    <div className="w-7 h-7 cursor-pointer" onClick={openTab}>
                        <img className='max-w-full' src={favicon} alt={props.url} />
                    </div>
                </div>

                <div className='flex-grow '>
                    <h1 className='text-lg line-clamp-1  text-left cursor-pointer' onClick={openTab} contentEditable={editMode} ref={titleRef} suppressContentEditableWarning>{props.title}</h1>
                    <p ref={urlRef} className={`${editMode ? 'block' : 'hidden'}`} contentEditable={editMode} suppressContentEditableWarning>{props.url}</p>
                </div>

                <div className="inline-flex items-center flex-grow-0 ">
                    {/* <Dropdown options={options} value={defaultOption} placeholder="Select an option" /> */}
                    {
                        editMode ?
                            <button className='btn btn-primary' onClick={save}>Save</button>
                            :
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="p-2 m-1 text-xl cursor-pointer"><span className='inline-block'><FiMoreVertical /></span></label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-base">
                                    <li onClick={openInNewTab}><span>Open in new tab</span></li>
                                    <li onClick={edit}><span>Edit</span></li>
                                    <li onClick={deleteB}><span>Delete</span></li>
                                </ul>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default BookmarkCard;