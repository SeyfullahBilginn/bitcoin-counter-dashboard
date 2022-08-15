import React from 'react'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./CounterItem.css";
import { func, string } from "prop-types";

export default function CounterItem({ counter, increase, decrease }) {
  return (
    <div className='counter'>
      <div className='counter-number'>
        {counter}
      </div>
      <div className='button-group'>
        <ArrowDropUpIcon className="arrow-button" onClick={() => increase()} />
        <ArrowDropDownIcon className="arrow-button" onClick={() => decrease()} />
      </div>
    </div>
  )
}

CounterItem.propTypes = {
  counter: string.isRequired,
  increase: func,
  decrease: func
}

CounterItem.defaultProps = {
  counter: 0,
  increase: (f) => f,
  decrease: (f) => f
}