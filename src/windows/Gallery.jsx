import React from 'react';
import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import {gallery, photosLinks} from '#constants';
import {Mail, Search} from "lucide-react";

const Gallery = () => {
  const { openWindow } = useWindowStore();


  return (
    <>
      <div id="window-header">
        <WindowControls target="photos" />
        <div className="w-full flex justify-end items-center gap-3 text-gray-500">
          <Mail className="icon"/>
          <Search className="icon"/>
        </div>
      </div>
      <div className='bg-white flex h-full'>
        <div className="sidebar">
          <h2>Photos</h2>
          <ul>
            {photosLinks.map(({ id, title, icon }) => (
                <li key={id}>
                  <img src={icon} className="w-4" alt={title}/>
                  <p className="text-sm font-medium truncate">{title}</p>
                </li>
            ))}
          </ul>
        </div>
        <div className="gallery overflow-auto h-full">
          <ul>
            {gallery.map(({ id, img }) => (
                <li key={id} onClick={() => openWindow("imgfile", { id, name: "Gallery image", imageUrl: img, icon:"/images/image.png", kind: "file", fileType: "img" })}>
                  <img src={img} alt={`Gallery Image ${id}`}/>
                </li>
            ))}
          </ul>
        </div>
      </div>


    </>
  );
};

const GalleryWindow = WindowWrapper(Gallery, "photos");

export default GalleryWindow;
