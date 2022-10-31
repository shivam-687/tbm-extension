import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../context/AppContext';
import { BookmarkContext } from '../context/BookmarkProvider';

function CollectionTitle() {
    const [editMode, setEditMode] = useState(false);
    const [prevVal, setPrevValue] = useState('');
    const {selectedCollection} = useContext(BookmarkContext);
    const [afterUpdated, setAfterUpdated] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const handleUpadateCollectionTitle = () => {
        console.log("Update")
    }

    useEffect(() => {
      
    window.addEventListener('keyup', handleOnEnterKeyPressed);
      return () => {
        window.removeEventListener('keyup', handleOnEnterKeyPressed);
      }
    }, [])
    

    const handleOnEnterKeyPressed = (ev: KeyboardEvent) => {
        if(editMode && ev.key === 'Enter'){
            console.log("Hit key")
           ev.preventDefault();
        closeEditMode();
       }
    }

    const openEditMode = () => {
        if(!editMode) {
            const textContent = titleRef.current?.textContent;
            titleRef.current?.focus();
            setPrevValue(textContent||'');
            window.addEventListener('keyup', handleOnEnterKeyPressed);
            setEditMode(true);
            console.log("Edit mode on");
        };
    }

    const closeEditMode = ()=>{
        if(editMode){
            saveTitle();
            setEditMode(false)
            window.removeEventListener('keyup', handleOnEnterKeyPressed);
        }
        // console.log("On Blur");
    }

    const onFocus = () => {
        console.log("On focus in");
    }

    const saveTitle = (text?: string) => {
        const textContent = titleRef.current?.textContent;
        if(!textContent || textContent === '' || textContent.trim().length <= 0){
            if(titleRef.current) titleRef.current.textContent = prevVal;
            return;
        }

        try {
            if(selectedCollection && selectedCollection.id){

                chrome.bookmarks.update(selectedCollection?.id, {title: textContent}).then(() => {
                    console.log("Updated");
                    afterUpdate();
                });
                setPrevValue(textContent);
            }
        } catch (error) {
            if(titleRef.current?.textContent) titleRef.current.textContent = prevVal;
            console.error(error);
        }
    }

    const afterUpdate = ()=>{
        setAfterUpdated(true);
        setTimeout(() => {
           setAfterUpdated(false);
        }, 1000);
    }



  return (
    <h1 title='click to edit' ref={titleRef} data-tip="Click To Edit" className={`text-2xl tooltip tooltip-right text-primary transition-all duration-300 border-2 ${!afterUpdated && !editMode && 'border-transparent'} ${afterUpdated ? ' border-success':''} capitalize ${editMode ? ' border-dashed border-primary p-1' : ''}`} suppressContentEditableWarning contentEditable={editMode} onInput={handleUpadateCollectionTitle} onClick={openEditMode} onBlur={closeEditMode}>
        {selectedCollection?.title}
    </h1>
  )
}

export default CollectionTitle