import React from 'react'
import { useState, useEffect } from 'react';
import CounterItem from './CounterItem';
import WarningPopup from './WarningPopup';
import "./Counter.css";

function Counter() {
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [warningPopup, setWarningPopup] = useState({
    isOpen: false,
    title: "",
    content: "",
  })

  useEffect(() => {
    // decrease counter by 1 in every 1000ms (1s)
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds == 0) {
        if (minutes == 0) {
          if (hours == 0) {
            // 00:00:00
            clearInterval(myInterval);
          } else {
            setHours(hours - 1);
            setMinutes(59);
            setSeconds(59);
          }
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  function increase(type) {
    switch (type) {
      case "hours":
        setHours(hours + 1);
        break;
      case "minutes":
        if (minutes == 59) {
          setHours(hours + 1);
          setMinutes(0);
          break;
        }
        setMinutes(minutes + 1);
        break;
      case "seconds":
        if (seconds == 59) {
          if (minutes == 59) {
            setHours(hours + 1);
            setMinutes(0);
            setSeconds(0);
            break;
          }
          setMinutes(minutes + 1);
          setSeconds(0);
          break;
        }
        setSeconds(seconds + 1);
        break;
    }
  }

  function decrease(type) {
    switch (type) {
      case "hours":
        if (hours > 0) {
          setHours(hours - 1);
          break;
        }
        //else show warning
        setWarningPopup({
          isOpen: true,
          title: "Warning",
          content: "You can not decrease hour less than 0",
        })
        break;
      case "minutes":
        if (minutes > 0) {
          setMinutes(minutes - 1);
          break;
        }
        if (hours > 0) {
          //move 1 hour to minutes
          setHours(hours - 1);
          setMinutes(59);
          break;
        }
        //else show warning
        setWarningPopup({
          isOpen: true,
          title: "Warning",
          content: "You can not decrease minute less than 0, while hour is 0",
        })
        break;
      case "seconds":
        if (seconds > 0) {
          setSeconds(seconds - 1);
          break
        }
        if (minutes > 0) {
          //move 1 minute to seconds
          setMinutes(minutes - 1);
          setSeconds(59);
          break;
        }
        if (hours > 0) {
          //move 1 hour to minutes and seconds
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
          break;
        }
        //else show warning
        setWarningPopup({
          isOpen: true,
          title: "Warning",
          content: "You can not decrease second less than 0 while hour and minute is 0",
        })
        break;
    }
  }

  function renderPopups() {
    if (warningPopup.isOpen) {
      return (
        <WarningPopup
          title={warningPopup.title}
          content={warningPopup.content}
          close={() => setWarningPopup({ isOpen: false })}
        />
      )
    }
  }

  return (
    <div
      className='parent'
    >
      {renderPopups()}
      <div className='counter-items'>
        <CounterItem counter={hours < 10 ? `0${hours}` : hours.toString()} increase={() => increase("hours")} decrease={() => decrease("hours")} />
        :
        <CounterItem counter={minutes < 10 ? `0${minutes}` : minutes.toString()} increase={() => increase("minutes")} decrease={() => decrease("minutes")} />
        :
        <CounterItem counter={seconds < 10 ? `0${seconds}` : seconds.toString()} increase={() => increase("seconds")} decrease={() => decrease("seconds")} />
      </div>
    </div>
  );
}

export default Counter;