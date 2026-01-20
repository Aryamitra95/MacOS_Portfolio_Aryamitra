import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window'
import React from 'react'

const Image = () => {
    const { windows } = useWindowStore();
    const data = windows.imgfile?.data;
    if(!data) return null;
    const { name, imageUrl, image } = data;
    const imgSrc = imageUrl || image;
  return (
    <>
        <div id="window-header">
            <WindowControls target="imgfile"/>
            <h2>{name}</h2>
        </div>
        <div className='p-5 space-y-6 bg-white'>
            {imgSrc ? (
                <div className='w-full'>
                    <img src={imgSrc} alt={name} className="w-full h-auto rounded"/>
                </div>
            ): null}
        </div>
    </>
  )
}

const ImageWindow = WindowWrapper(Image, "imgfile");
export default ImageWindow;
