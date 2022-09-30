import React from 'react'
// import LogoSvg from 'logo.svg'
// const LogoSvg = require('logo.svg');

function Logo() {
    return (
        <div className="p-2 rounded-md bg-white text-primary font-black text-3xl w-full border">
            <img src="tbm-logo-v2-long.png" alt="Tabmarker logo" className='max-w-full' />
            {/* <LogoSvg/> */}
        </div>
    )
}

export default Logo