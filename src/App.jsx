import React from 'react';
import Navbar from "#components/Navbar.jsx";
import Welcome from "#components/Welcome.jsx";
import Dock from '#components/Dock';
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable';
import Terminal from '#windows/Terminal';

gsap.registerPlugin(Draggable);

const App = () => {
    return (
       <main>
           <Navbar/>
           <Welcome/>
           <Dock/>

           <Terminal/>
       </main>
    )
}
export default App

