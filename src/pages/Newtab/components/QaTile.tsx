import React from 'react'
import QuickAccess, { QuickAccessContent } from '../lib/QuickAccess';
import { IoCloseCircleSharp } from 'react-icons/io5';

export interface QaTileProps {
    children?: React.ReactNode,
    qa?: QuickAccessContent,
    disableClose?: boolean
}

function QaTile(props: QaTileProps) {

    const remove = () => {
        props.qa && QuickAccess.remove(props.qa.id);
    }
    return (
        <div className='relative z-50 inline-block rounded w-12 shadow-inner shadow-black/10 h-12 p-2 group border border-primary-content/30 bg-primary hover:scale-110 hover:shadow-lg hover:shadow-primary-content/20 hover:border-transparent transition-all duration-200 tooltip tooltip-left' data-tip={props.qa?.title}>
            <a href={props.qa?.url} className='inline-block '>
             
                    {
                        props.children
                        ? props.children
                        : <img className='max-w-full' src={props.qa?.favicon} alt={props.qa?.title} />
                    }
                
            </a>

            {
                !props.disableClose && <button onClick={remove} className='absolute bottom-full right-0 text-primary-content delay-0 text-lg bg-primary/50 transition duration-300 ease-in-out inline-block translate-y-full opacity-0 group-hover:delay-500 group-hover:translate-y-0 group-hover:opacity-100'><IoCloseCircleSharp /></button>
            }
        </div>
    )
}

export default QaTile