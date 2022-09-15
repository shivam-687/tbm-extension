import React from 'react';
import './Popup.css';

const Popup = () => {
  return (
    <div className='tbm-popup p-5 h-full absolute w-full top-0 left-0'>
      <div className="rounded-xl bg-slate-100 flex items-center justify-center w-full h-full">
        <h1 className='text-4xl font-bold text-center'>Enjoy <span className="text-primary uppercase">TabMarker</span> Extension</h1>
      </div>
    </div>
  );
};

export default Popup;
