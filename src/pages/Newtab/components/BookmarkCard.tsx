import React, { createRef, MouseEvent, useEffect, useRef, useState } from 'react';
import { getFaviconUrl } from '../../../helpers';
import { FiMoreVertical } from 'react-icons/fi';
import 'react-dropdown/style.css';
import QuickAccess, { QuickAccessContent } from '../lib/QuickAccess';
import { getTreeList } from '../lib/utils';
import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';
import { HiFolder, HiFolderOpen } from 'react-icons/hi';

// Modal.setAppElement('#app-container');

export interface BookmarkCardProps extends chrome.bookmarks.BookmarkTreeNode {
    onDelete?: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
    onMove?: (aprentId: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
}

const BookmarkCard = (props: BookmarkCardProps) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isAddedInQa, setIsAddedInQa] = useState<QuickAccessContent | undefined | null>(null);
    const titleRef = useRef<HTMLAnchorElement>(null);
    const urlRef = useRef<HTMLParagraphElement>(null);
    const favicon = getFaviconUrl(props.url!);
    const [collectionList, setCollectionList] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);


    useEffect(() => {
        getTreeList();
        // console.log("Colecte")
    }, [])



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

    const addInQuickAccess = () => {
        if (!props.title || !props.url || !favicon || isAddedInQa) return;
        QuickAccess.create({ title: props.title, url: props.url, favicon: favicon }).then(val => {
            setIsAddedInQa(val.find(q => q.url === props.url));
        });
    }

    const removeFromQuickAccess = () => {
        if (!isAddedInQa) return;
        QuickAccess.remove(isAddedInQa.id).then(value => {
            setIsAddedInQa(null);
        })
    }

    const moveToCollection = async (ev: MouseEvent) => {
        const collectionId = ev.currentTarget.getAttribute('col-id');
        if (!collectionId || collectionId === '' || collectionId === props.parentId) return;
        try {
            const search = await chrome.bookmarks.search(props.url!);
            const isFound = search.find(bm => bm.parentId === collectionId);
            if (isFound) {
                props.onMove && props.onMove(collectionId, { id: props.id, title: props.title, url: props.url, parentId: props.parentId, index: props.index });
                return;
            }
            // const moved = await chrome.bookmarks.move(props.id, { parentId: collectionId! });
            props.onMove && props.onMove(collectionId, { id: props.id, title: props.title, url: props.url, parentId: props.parentId, index: props.index });
            closeModal();
            // console.log("Moved to: ", moved);
        } catch (error) {
            console.error(error);
        }
    }

    const getCollectionsList = async () => {
        if (collectionList.length > 0) return;
        try {
            const list = await getTreeList();
            setCollectionList([...list]);
        } catch (error) {

        }
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

    function openModal() {
        getCollectionsList().then(val => {
            setIsOpen(true)
        },
            error => {

                setIsOpen(true);
            })
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleSubmit = () => {

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
                    <a href={props.url} className={`text-lg line-clamp-1  text-left ${editMode ? 'cursor-text' : 'cursor-pointer'}`} onClick={openTab} contentEditable={editMode} ref={titleRef} suppressContentEditableWarning>{props.title}</a>
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
                                    <li onClick={openModal}><span>Move To</span></li>
                                    {
                                        isAddedInQa
                                            ? <li onClick={removeFromQuickAccess}><span>Remove From Access</span></li>
                                            : <li onClick={addInQuickAccess}><span>Add in Access</span></li>
                                    }
                                    <li onClick={deleteB}><span className="text-error">Delete</span></li>
                                </ul>
                            </div>
                    }
                </div>
            </div>




            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                closeTimeoutMS={500}
                className="max-w-5xl w-full p-5 h-min bg-base-100 rounded-xl shadow-xl shadow-primary/20 relative"
                contentLabel="Craete-Collection-Model"
                overlayClassName={' bg-black/20 absolute w-full h-full top-0 left-0 flex items-center justify-center backdrop-blur-sm z-50'}
                parentSelector={() => document.querySelector('#apptab')!}
                shouldCloseOnOverlayClick={false}
            >

                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl'>Move To...</h1>
                    <button onClick={closeModal} className='absolute right-2 top-2 btn btn-square text-2xl btn-outline' ><span><IoClose /></span></button>
                </div>

                <div className="w-full my-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {
                            collectionList.map((val, index) => {
                                return val.id === props.parentId
                                    ?
                                    null
                                    : <div className="flex items-center justify-center">
                                        <div key={index} col-id={val.id} onClick={moveToCollection} className="max-w-xl w-full group flex items-center gap-5 rounded-md transition duration-300 border cursor-pointer border-gray-400 hover:border-primary hover:bg-primary/5 hover:text-primary">
                                            <div className="flex-grow-0 text-3xl text-gray-400 group-hover:text-primary transition duration-200 flex items-center p-2">
                                                <HiFolder />
                                            </div>
                                            <div className="flex-grow text-xl">
                                                <p>{val.title}</p>
                                            </div>
                                        </div>
                                    </div>
                            })
                        }
                    </div>
                </div>

                {/* <div className="flex gap-5 items-center justify-end">
                    <button className='btn btn-primary' onClick={handleSubmit}>Move</button>
                </div> */}


            </Modal>
        </div>
    )
}

export default BookmarkCard;