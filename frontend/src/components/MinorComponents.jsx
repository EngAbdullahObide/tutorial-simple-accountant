import React from "react";
import './stylesComponents/loader.css'
import './stylesComponents/validate.css'

export function Loader({loading}){
    if (!loading) {
        return null;
      };
      
     
    return(
        <div className="loader">
            <div></div><div></div>
            <div></div><div></div>
            <div></div><div></div>
            <div></div><div></div>
            <div></div><div></div>
            <div></div><div></div>
        </div>
    )
};

export function Validate({error, text}){
    if (!error) {
        return null;
    }
    return(
        <div className="validate">
        <div className="validateArrow"></div>
        <div className="validateText">{text}</div>
        </div>
    )
}