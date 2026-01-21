import React from 'react';
import WindowControls from '#components/WindowControls';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { locations } from '#constants';
import { Search } from "lucide-react";

const Archive = () => {
  const { openWindow } = useWindowStore();
  const trashImages = locations.trash.children;

  return (
    <>
      <div id="window-header">
        <WindowControls target="trash" />
        <div className="w-full flex justify-end items-center gap-3 text-gray-500">
          <Search className="icon"/>
        </div>
      </div>
      <div className='bg-white flex h-full'>
        <div className="sidebar">
          <h2>Archive</h2>
          <ul>
            <li>
              <img src={locations.trash.icon} className="w-4" alt={locations.trash.name}/>
              <p className="text-sm font-medium truncate">{locations.trash.name}</p>
            </li>
          </ul>
        </div>
        <div className="gallery overflow-auto h-full">
          <ul>
            {trashImages.map((item) => (
              <li key={item.id} onClick={() => openWindow("imgfile", { 
                id: item.id, 
                name: item.name, 
                imageUrl: item.imageUrl, 
                icon: item.icon, 
                kind: item.kind, 
                fileType: item.fileType 
              })}>
                <img src={item.imageUrl} alt={item.name}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const ArchiveWindow = WindowWrapper(Archive, "trash");

export default ArchiveWindow;