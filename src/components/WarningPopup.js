import React from 'react';
import "./WarningPopup.css";
import { func, string } from "prop-types";

export default function WarningPopup({title, content, close}) {
  return (
    <div>
      <div className="popup-box">
        <div className="box">
          <h1 className="title">{title}</h1>
          <span className="close-icon" onClick={close}>x</span>
          {content}
        </div>
      </div>
    </div>
  )
}

WarningPopup.propTypes = {
  title: string,
  content: string,
  close: func
}

WarningPopup.defaultProps = {
  title: "",
  content: "",
  close: (f) => f
}