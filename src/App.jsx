import React from 'react';
import Navbar from "#components/Navbar.jsx";
import Welcome from "#components/Welcome.jsx";
import Dock from '#components/Dock';
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable';
import {Terminal, Safari, Resume, Finder, Text, Image} from '#windows';

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
           <Finder/>
           <Text/>
           <Image/>
       </main>
    )
}
export default App
