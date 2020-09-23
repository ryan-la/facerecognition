import React from "react";
import Tilt from 'react-tilt'; //library
import './Logo.css';
// can name the image "brain" to anything
import brain from "./brain.png";


const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max: 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa4">
                    <img src={brain} alt="logo" />
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;