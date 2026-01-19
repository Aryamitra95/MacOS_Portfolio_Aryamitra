import useWindowStore from '#store/window';
import React from 'react';

const WindowControls = ({target}) => {
    const { closeWindow, minimizeWindow, maximizeWindow } = useWindowStore();

    const handleMinimize = (e) => {
        e.stopPropagation();
        minimizeWindow(target);
    };

    const handleMaximize = (e) => {
        e.stopPropagation();
        maximizeWindow(target);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        closeWindow(target);
    };

  return (
    <div id="window-controls">
        <div className='close' onClick={handleClose}/>
        <div className='minimize' onClick={handleMinimize}/>
        <div className='maximize' onClick={handleMaximize}/>
    </div>
  )
}

export default WindowControls;