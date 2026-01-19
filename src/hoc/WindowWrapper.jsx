import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import React, { useLayoutEffect, useRef, useState } from 'react';

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, isMinimized, isMaximized } = windows[windowKey];
        const [originalPosition, setOriginalPosition] = useState({ x: 0, y: 0, width: '', height: '', transform: '', saved: false });
        const draggableInstanceRef = useRef(null);

        const ref = useRef(null);
        
        useGSAP(()=>{
            const el = ref.current;
            if(!el || !isOpen || isMinimized) return;
            
            el.style.display = 'block';
            gsap.fromTo(el, { scale: 0.8, opacity: 0, y: 40}, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out"},);
        }, [isOpen, isMinimized]);

        useGSAP(()=>{
            const el = ref.current;
            if(!el) return;

            const [instance] = Draggable.create(el, {
                onPress: () => focusWindow(windowKey),
                bounds: window,
            });
            
            draggableInstanceRef.current = instance;

            return () => instance.kill();
        }, []);

        useLayoutEffect(()=>{
            const el = ref.current;
            if(!el) return;
            
            if (!isOpen) {
                el.style.display = "none";
                return;
            }
            
            if (isMinimized) {
                el.style.display = "none";
                return;
            }
            
            el.style.display = "block";
            
            if (isMaximized) {
                // Store original position before maximizing (only once)
                if (!originalPosition.saved) {
                    const rect = el.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(el);
                    setOriginalPosition({
                        x: rect.left,
                        y: rect.top,
                        width: el.style.width || computedStyle.width,
                        height: el.style.height || computedStyle.height,
                        transform: el.style.transform || computedStyle.transform || 'none',
                        saved: true
                    });
                }
                
                // Maximize: full viewport with proper centering
                el.style.setProperty('position', 'fixed', 'important');
                el.style.setProperty('top', '0', 'important');
                el.style.setProperty('left', '0', 'important');
                el.style.setProperty('right', '0', 'important');
                el.style.setProperty('bottom', '0', 'important');
                el.style.setProperty('width', '100vw', 'important');
                el.style.setProperty('height', '100vh', 'important');
                el.style.setProperty('margin', '0', 'important');
                el.style.setProperty('transform', 'none', 'important');
                el.style.setProperty('max-width', 'none', 'important');
                el.style.setProperty('max-height', 'none', 'important');
                
                // Disable dragging when maximized
                if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.disable();
                }
            } else {
                // Restore original position
                if (originalPosition.saved) {
                    el.style.removeProperty('position');
                    el.style.removeProperty('top');
                    el.style.removeProperty('left');
                    el.style.removeProperty('right');
                    el.style.removeProperty('bottom');
                    el.style.removeProperty('width');
                    el.style.removeProperty('height');
                    el.style.removeProperty('margin');
                    el.style.removeProperty('transform');
                    el.style.removeProperty('max-width');
                    el.style.removeProperty('max-height');
                    
                    // Re-enable dragging when not maximized
                    if (draggableInstanceRef.current) {
                        draggableInstanceRef.current.enable();
                    }
                    
                    // Reset original position tracking when unmaximizing
                    setOriginalPosition({ x: 0, y: 0, width: '', height: '', transform: '', saved: false });
                }
            }
        }, [isOpen, isMinimized, isMaximized, originalPosition]);

        return (
        <section 
        id={windowKey} 
        ref = {ref} 
        style={{zIndex}}
        className='absolute'
        >
            <Component{...props}/>
        </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`
  return Wrapped;
};

export default WindowWrapper;