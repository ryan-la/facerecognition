import React from "react";
import "./ImageLinkForm.css"

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
            <div>
                <p className='f3' style={{ display: "flex", justifyContent: "center" }}>
                    {'This magic brain will detect faces and your pictures. Give it a try'}
                </p>
            </div>
            <form onSubmit={onPictureSubmit}>
                <div className="center ">
                    <div className="form pa4 br3 shadow-5">
                        <input className="f4 pa2 w-70" type="text" onChange={onInputChange} />
                        <button className="f4 w-30 grow link ph3 pv2 dib white bg-light-purple" >Detect</button>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default ImageLinkForm;