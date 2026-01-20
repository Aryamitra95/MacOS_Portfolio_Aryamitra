import React from 'react';
import Navbar from "#components/Navbar.jsx";
import Welcome from "#components/Welcome.jsx";
import Dock from '#components/Dock';
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable';
import Terminal from '#windows/Terminal';
import Safari from '#windows/Safari';
import Resume from '#windows/Resume';

gsap.registerPlugin(Draggable);

const App = () => {
    return (
       <main>
           <Navbar/>
           <Welcome/>
           <Dock/>

           <Terminal/>
           <Safari/>
           <Resume/>
       </main>
    )
}
export default App

