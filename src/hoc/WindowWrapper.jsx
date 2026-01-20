import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import React, { useLayoutEffect, useRef, useState } from 'react';

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, isMinimized, isMaximized } = windows[windowKey];
        const [originalPosition, setOriginalPosition] = useState({
            top: '',
            left: '',
            width: '',
            height: '',
            position: '',
            transform: '',
            saved: false,
        });
        const draggableInstanceRef = useRef(null);
        const prevIsMinimizedRef = useRef(isMinimized);

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

            const wasMinimized = prevIsMinimizedRef.current;
            prevIsMinimizedRef.current = isMinimized;
            
            if (!isOpen) {
                el.style.display = "none";
                return;
            }
            
            if (isMinimized) {
                el.style.display = "none";
                return;
            }
            
            el.style.display = "block";

            // When restoring from minimized (and not maximized), Safari should reset to CSS-defined position
            // (Other windows should behave like normal windows and keep their last dragged position.)
            if (windowKey === 'safari' && !isMaximized && wasMinimized && !isMinimized) {
                el.style.removeProperty('transform');
                el.style.removeProperty('top');
                el.style.removeProperty('left');

                if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.update(true);
                }
            }
            
            if (isMaximized) {
                // Store original position before maximizing (only once)
                if (!originalPosition.saved) {
                    const computedStyle = window.getComputedStyle(el);
                    setOriginalPosition({
                        top: el.style.top || '',
                        left: el.style.left || '',
                        width: el.style.width || computedStyle.width,
                        height: el.style.height || computedStyle.height,
                        position: el.style.position || '',
                        // Prefer inline transform (GSAP/Draggable writes inline transforms)
                        transform: el.style.transform || computedStyle.transform || 'none',
                        saved: true,
                    });
                }
                
                // Maximize behavior - default: full viewport
                el.style.setProperty('position', 'fixed', 'important');
                el.style.setProperty('margin', '0', 'important');
                el.style.setProperty('max-width', 'none', 'important');
                el.style.setProperty('max-height', 'none', 'important');
                el.style.setProperty('top', '0', 'important');
                el.style.setProperty('left', '0', 'important');
                el.style.setProperty('right', '0', 'important');
                el.style.setProperty('bottom', '0', 'important');
                el.style.setProperty('width', '100vw', 'important');
                el.style.setProperty('height', '100vh', 'important');
                el.style.setProperty('transform', 'none', 'important');
                
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
                  
                    // Re-apply saved inline styles so the window returns exactly where it was
                    if (originalPosition.position) el.style.position = originalPosition.position;
                    if (originalPosition.top) el.style.top = originalPosition.top;
                    if (originalPosition.left) el.style.left = originalPosition.left;
                    if (originalPosition.width) el.style.width = originalPosition.width;
                    if (originalPosition.height) el.style.height = originalPosition.height;
                    if (originalPosition.transform && originalPosition.transform !== 'none') {
                        el.style.transform = originalPosition.transform;
                    }
                    
                    // Re-enable dragging when not maximized
                    if (draggableInstanceRef.current) {
                        draggableInstanceRef.current.enable();
                        // Ensure Draggable re-syncs to the restored transform/position
                        draggableInstanceRef.current.update(true);
                    }
                    
                    // Reset original position tracking when unmaximizing
                    setOriginalPosition({
                        top: '',
                        left: '',
                        width: '',
                        height: '',
                        position: '',
                        transform: '',
                        saved: false,
                    });
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