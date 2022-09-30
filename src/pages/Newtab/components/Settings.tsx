import React, { PropsWithChildren, useContext, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import Modal from 'react-modal';
import { ThemeContext } from '../context/ThemeProvider';
import TbmModal from './TbmModal';
import ThemeCard from './ThemeCard';


function Settings(props: PropsWithChildren<{}>) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const { themeList, activeTheme, setTheme } = useContext(ThemeContext);

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

    const SettingContainer = (title: string, children: React.ReactNode) => {
        return <div className='w-full p-5'>
            <h2 className='text-xl font-bold border-b border-b-primary/50'>{title}</h2>

            <div className=''>
                {children}
            </div>
        </div>
    }

    return (
        <>

            <div onClick={openModal}>
                {props.children}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                closeTimeoutMS={500}
                className="max-w-3xl w-full p-5 h-min bg-base-100 rounded-xl shadow-xl shadow-primary/30 relative"
                contentLabel="Craete-Collection-Model"
                overlayClassName={' bg-black/10 absolute w-full h-full top-0 left-0 flex items-center justify-center backdrop-blur z-50'}
                parentSelector={() => document.querySelector('#apptab')!}
                shouldCloseOnOverlayClick={false}
            >
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl'>Settings</h1>
                    <button onClick={closeModal} className='absolute right-2 top-2 btn btn-square text-2xl btn-outline' ><span><IoClose /></span></button>
                </div>
                <div className="p-5">
                    <div className="">
                        <div className='w-full'>
                            <h2 className='text-xl font-bold border-b border-b-primary/50 pb-2'>Theme Setting</h2>

                            <div className='grid grid-cols-3 gap-3 py-5 max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-primary/50 scrollbar-thumb-primary p-3'>
                                {
                                    themeList?.map((th, ind) => {
                                        return <div key={ind} className='w-full'><ThemeCard theme={th} ></ThemeCard></div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>


        </>
    )
}

export default Settings