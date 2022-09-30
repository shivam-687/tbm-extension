import React, { PropsWithChildren, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import Modal, {} from 'react-modal';

export type TbmModalProps = {
    isOpen: boolean,
    onOpen?: () => {},
    onClose?: () => {}
}

function TbmModal(props: PropsWithChildren<TbmModalProps>) {
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
        props.onOpen && props.onOpen();
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
        props.onClose && props.onClose();
    }
  return (
    <>
         <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                closeTimeoutMS={500}
                className="max-w-2xl w-full p-5 h-min bg-base-100 rounded-xl shadow-xl shadow-primary/20 relative"
                contentLabel="Craete-Collection-Model"
                overlayClassName={' bg-black/20 absolute w-full h-full top-0 left-0 flex items-center justify-center'}
                parentSelector={() => document.querySelector('#apptab')!}
                shouldCloseOnOverlayClick={false}
            >
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl'>Create Collection</h1>
                    <button onClick={closeModal} className='absolute right-2 top-2 btn btn-square text-2xl btn-outline' ><span><IoClose /></span></button>
                </div>
                {props.children}
            </Modal>
    </>
  )
}

export default TbmModal