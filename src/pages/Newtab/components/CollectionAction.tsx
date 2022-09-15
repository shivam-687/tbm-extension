import React, { useContext, useEffect, useState } from 'react'
import { BiSortDown, BiFolderPlus, BiTrash, BiDotsVertical } from 'react-icons/bi';
import { BookmarkContext } from '../context/BookmarkProvider';
import CreateCollection from './CreateCollection';

export type CollectionActionProps = {
    collection: chrome.bookmarks.BookmarkTreeNode | null,
    bookmarks: chrome.bookmarks.BookmarkTreeNode[],
    onSort?: (bookamrks: chrome.bookmarks.BookmarkTreeNode[]) => void,
    onDelete?: (deleteInfo: chrome.bookmarks.BookmarkTreeNode) => void,
    onCreate?: (cretedCollection: chrome.bookmarks.BookmarkTreeNode) => void
}

export const SortOptions: { lable: string, action: string, icon: any }[] = [
    {
        lable: 'By Latest',
        action: 'by_date_asc',
        icon: <BiSortDown />
    },
    {
        lable: 'By Oldest',
        action: 'by_date_dsc',
        icon: <BiSortDown />
    },
]


function CollectionAction(props: CollectionActionProps) {
    const [curSortAction, setSortAction] = useState<string | null>(null);
    const { selectedCollection, select } = useContext(BookmarkContext);


    useEffect(() => {
        syncSortAction().then(() => {
            if (props.bookmarks.length > 0 && props.onSort && curSortAction) {
                const sorted = sortBy(curSortAction);
                props.onSort && props.onSort(sorted);
                console.log("Collection sorted");
            }
        })

    }, [])


    const syncSortAction = async () => {
        const actionData = await chrome.storage.sync.get('sortAction');
        if (Object.keys(actionData).length > 0) {
            setSortAction(actionData['sortAction']);
        } else {
            setSortAction(null)
        }
    }

    const sortBy = (action: string) => {
        let sortData: chrome.bookmarks.BookmarkTreeNode[] = [];
        switch (action) {
            case 'by_date_asc':
                setSortAction(action);
                saveSortData(action);
                sortData = props.bookmarks.sort((a, b) => {
                    return a.dateAdded! - b.dateAdded!;
                });
                break;

            default:
                sortData = props.bookmarks.sort((a, b) => {
                    return b.dateAdded! - a.dateAdded!;
                });
                setSortAction(action);
                saveSortData(action);
                break;
        }

        return sortData;

    }

    const handleSort = (ev: React.MouseEvent<HTMLLIElement>) => {
        const act = ev.currentTarget.getAttribute('data-act');
        const sorted = sortBy(act!);
        props.onSort && props.onSort(sorted);
    }

    const saveSortData = (action: string) => {
        chrome.storage.sync.set({ sortAction: action });
    }

    const deleteCollection = () => {
        if (!props.collection) return;
        chrome.bookmarks.removeTree(props.collection.id).then(value => {
            const parentId = props.collection?.parentId;
            if (parentId) {
                chrome.bookmarks.get(parentId).then(value => {
                    select && select(value[0]);
                    props.onDelete && props.onDelete(value[0]);
                })
            }
        })

    }

    return (
        <div className="dropdown dropdown-left">
            <label tabIndex={0} className="btn btn-square btn-outline text-xl"><span><BiDotsVertical /></span></label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><CreateCollection><span className='text-base flex items-center'><span className='text-2xl mr-2'><BiFolderPlus /></span> Create Collection</span></CreateCollection></li>
                {/* <li tabIndex={0} className="dropdown-start">
                    <span className="text-base">Sort</span>
                    <ul className="bg-base-100">
                        {
                            SortOptions.map((s, index) => {
                                return <li key={index} data-act={s.action} onClick={handleSort} className={`text-base ${curSortAction && curSortAction === s.action ? 'text-primary' : ''}`}><span>{s.lable}</span></li>
                            })
                        }

                    </ul>
                </li> */}
                <li onClick={deleteCollection} className={`${props.collection && props.collection.parentId && props.collection.parentId === '0' ? 'hidden' : 'block'}`}><span className='text-error text-base flex items-center'><span className='text-2xl mr-2'><BiTrash /></span>Delete</span></li>
            </ul>
        </div>
    )
}

export default CollectionAction