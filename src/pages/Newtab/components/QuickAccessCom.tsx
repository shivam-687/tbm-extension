import React, { useEffect, useState } from 'react'
import QuickAccess, { CreateQuickAccess, QuickAccessContent } from '../lib/QuickAccess';
import QaTile from './QaTile';
import { parseTitleUrlFromDragEvent } from '../lib/utils';
import { getFaviconUrl } from '../../../helpers';
import './bookmark-transition.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AiFillSetting } from 'react-icons/ai';
import Settings from './Settings';

function QuickAccessCom() {
    const [qaList, setQaList] = useState<QuickAccessContent[]>([]);
    const [dragEnter, setDragEnter] = useState(false);

    const handleOnCreated = (qa: QuickAccessContent) => {
        setQaList((prevList) => [...prevList, qa].sort((qa1, qa2) => qa2.index - qa1.index));
    }
    const handleOnRemoved = (qa: QuickAccessContent) => {
        if (qaList.length < 0) return;
        setQaList((prevList) => [...prevList.filter(q => q.id !== qa.id).sort((qa1, qa2) => qa2.index - qa1.index)]);
    }

    const init = () => {
        QuickAccess.getAll().then(list => {
            setList(list);
        });
    }

    const setList = (item: QuickAccessContent[] | QuickAccessContent) => {
        let list: QuickAccessContent[] = []
        if (Array.isArray(item)) {
            list = item
        } else {
            list = [...list, item]
        }
        setQaList((prev) => ([...list].sort((qa1, qa2) => qa2.index - qa1.index)));
    }

    useEffect(() => {
        init();

        QuickAccess.onCreated.addListener(handleOnCreated);
        QuickAccess.onRemoved.addListener(handleOnRemoved);

        return (() => {
            QuickAccess.onCreated.removeListner(handleOnCreated);
            QuickAccess.onRemoved.removeListner(handleOnRemoved);
        })
    }, []);

    const handleOnDrop = (ev: React.DragEvent) => {
        if (ev.dataTransfer.types.includes('text/uri-list') && ev.dataTransfer.types.includes('text/html')) {
            ev.preventDefault();
            const obj = parseTitleUrlFromDragEvent(ev);
            if (obj) {
                const data: CreateQuickAccess = {
                    title: obj.title,
                    url: obj.url,
                    favicon: getFaviconUrl(obj.url)
                }
                QuickAccess.create(data);
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
        <div className={`flex flex-col  relative  bg-primary-focus transition duration-200 h-full scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary scrollbar-thumb-rounded-full  ${dragEnter ? 'bg-primary/40' : 'bg-primary-focus'}`} onDragOver={handleOnDragOver} onDrop={handleOnDrop} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave}>
            {/* <div className='flex-grow-0 w-full h-2 bg-primary'></div> */}
            <TransitionGroup className='flex flex-grow flex-col gap-3 justify-start overflow-y-auto overflow-x-auto scrollbar-none px-2 pt-5'>
                {
                    qaList.map((qa, index) => <CSSTransition timeout={700} classNames='bi' className="tooltip tooltip-left" data-tip={qa.title} key={index} ><QaTile qa={qa} /></CSSTransition>)
                }
            </TransitionGroup>
            <div className=' py-4 border-t-2 border-primary-content w-full flex justify-center flex-grow-0'>
                <Settings>
                    <QaTile closable>
                        <span className='text-3xl w-full h-full flex cursor-pointer text-primary-content items-center pb-[6px] justify-center'><AiFillSetting /></span>
                    </QaTile>
                </Settings>
            </div>
        </div>
    )
}

export default QuickAccessCom