import React, { useContext, useState } from 'react'
import { HiFolder, HiFolderAdd } from 'react-icons/hi';
import Modal from 'react-modal';
import Fade from 'react-reveal/Fade';
import { BookmarkContext } from '../context/BookmarkProvider';

Modal.setAppElement('#app-container');

function CreateCollection(props: React.PropsWithChildren<{}>) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [inputData, setInputData] = useState('');
    const [inputErrorMessage, setInputErrorMessage] = useState<string | null>();
    const [modelError, setModalError] = useState<string | null>(null);

    const { selectedCollection } = useContext(BookmarkContext)


    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.value;
        setInputData(value);
    }

    const handleSubmit = () => {
        if (inputData && inputData !== '') {
            createCollection().then(collection => {
                console.log("Created Collection:: ", collection);
                closeModal();
            })
        }
    }

    const createCollection = async () => {
        if (!selectedCollection) return setModalError("No Collection Selected!!");
        const createdBcollection = await chrome.bookmarks.create({
            parentId: selectedCollection.id,
            title: inputData
        });
        return createdBcollection;

    }

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <>
            {
                props.children ?
                    <span onClick={openModal}>{props.children}</span>
                    : <button className='btn btn-outline btn-square' onClick={openModal}><span className='text-2xl'><HiFolderAdd /></span></button>
            }

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                closeTimeoutMS={500}
                className="max-w-2xl w-full p-5 h-min bg-base-100 rounded-xl shadow-xl shadow-primary/20"
                contentLabel="Craete-Collection-Model"
                overlayClassName={' bg-black/20 absolute w-full h-full top-0 left-0 flex items-center justify-center'}
                parentSelector={() => document.querySelector('#apptab')!}
                shouldCloseOnOverlayClick={false}
            >

                <h1 className='text-2xl'>Create Collection</h1>

                <div className="form-control w-full mx-auto my-5">

                    <input type="text" placeholder="Type here" className="input input-bordered w-full" onChange={handleInputChange} />
                    {
                        inputErrorMessage && <label className="label text-error" >
                            <span className="label-text-alt">{inputErrorMessage}</span>
                        </label>
                    }
                </div>

                <div className="flex items-center justify-end">
                    <button className='btn btn-secondary' onClick={handleSubmit}>Create</button>
                </div>

            </Modal>
        </>
    )
}

export default CreateCollection