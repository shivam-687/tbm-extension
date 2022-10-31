import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './Popup.css';
import QuickAccess from '../Newtab/lib/QuickAccess';

const Popup = () => {
  const [tabTitle, setTabTitle] = useState('');
  const [data, setData] = useState('');


  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  const init = async () => {
    const tab = await getCurrentTab()
    if(tab){
      setTabTitle(tab.title)
    }
  }
  useEffect(() => {
    init();
  }, [])

  return (
    <div className='tbm-popup p-1 h-full absolute w-full top-0 left-0'>
      <div className="rounded-xl bg-slate-100 w-full h-full p-2">
        <p className='text-xl'>{tabTitle}</p>
        {/* <button className='btn btn-primary' disabled={tabTitle === ''}>Add In QA</button> */}
        {/* <p>
          {data}
        </p> */}
      </div>
    </div>
  );
};

export default Popup;
