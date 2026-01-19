import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Tooltip } from 'react-tooltip';
import { dockApps } from '#constants/index.js';
import useWindowStore from '#store/window';

const Dock = () => {
    const { openWindow, minimizeWindow, restoreWindow, windows} = useWindowStore();
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
            const animateIcons = (mouseX) => {     
            const { left } = dock.getBoundingClientRect();
            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width /2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2)/ 2000);
                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                });
            });
        };
        const handleMouseMove = (event) => {
            const { left } = dock.getBoundingClientRect();
            const mouseX = event.clientX - left;
            animateIcons(mouseX);
        }
        const resetIcons = () => 
            icons.forEach((icon) => gsap.to(icon, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power1.out",
            })
        );
        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);
        return () =>{
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
        }
    });
    

    const toggleApp = (app) => {
        if(!app?.canOpen) return;

        const window = windows[app.id];

        if(window.isOpen){
            if(window.isMinimized){
                // Restore minimized window
                restoreWindow(app.id);
            } else {
                // Minimize window if it's open and not minimized
                minimizeWindow(app.id);
            }
        }else {
            openWindow(app.id);
        }
    };

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {dockApps.map((app) => {
                    const window = windows[app.id];
                    const isWindowOpen = window?.isOpen || false;
                    const isActive = isWindowOpen; // Active if window is open (including minimized)
                    
                    return (
                        <div key={app.id} className="relative flex justify-center">
                            <button
                                type="button"
                                className={`dock-icon ${isActive ? 'dock-icon-active' : ''}`}
                                aria-label={app.name}
                                data-tooltip-id='dock-tooltip'
                                data-tooltip-content={app.name}
                                data-tooltip-delay-show={150}
                                disabled={!app.canOpen}
                                onClick={() => toggleApp(app)}
                            >
                                <img
                                    src={`/images/${app.icon}`}
                                    alt={app.name}
                                    loading="lazy"
                                    className={app.canOpen ? '' : 'opacity-60'}
                                />
                            </button>
                        </div>
                    );
                })}
                <Tooltip id="dock-tooltip" place="top" className="tooltip"/>
            </div>
        </section>
    );
};

export default Dock;