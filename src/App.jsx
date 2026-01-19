import React from 'react';
import Navbar from "#components/Navbar.jsx";
import Welcome from "#components/Welcome.jsx";
import Dock from '#components/Dock';

const App = () => {
    return (
       <main>
           <Navbar/>
           <Welcome/>
           <Dock/>
       </main>
    )
}
export default App

