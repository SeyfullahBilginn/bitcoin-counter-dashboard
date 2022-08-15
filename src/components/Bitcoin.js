/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import useInterval from './useInterval';
import "./Bitcoin.css";

function Bitcoin() {
  const [prices, setPrices] = useState(
    {
      data: {},
      time: '',
      isLoading: false,
      // isError: false,
    })
  const [symbols, setSymbols] = useState({
    USD: "$",
    EUR: "€",
    GBP: "£",
  })
  const [colors, setColors] = useState([]);


  const getData = (isFirstCall) => {
    setPrices({ ...prices, isLoading: true });
    console.log(prices);

    const api = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    fetch(api, {
      method: 'GET',
    }).then(res => {
      res.json().then(res => {
        if (prices.time !== res.time.updated) {
          //if times are euqal, do not update colors
          // reset colors
          setColors([])
          if (!isFirstCall && prices.time === res.time.updated) {
            //if it is not first call and time is equal to new time, do not update colors and data
            return;
          }
          Object.keys(res.bpi).forEach(key => {
            // data da time hiç yoksa
            if (isFirstCall && prices.time === '') {
              // first iteration
              setColors(["grey", "grey", "grey"])
            }
            else {
              // highlight colors related to new data's rise or fall
              if (res.bpi[key].rate > prices.data[key].rate) {
                // color to green, if new rate is more than old rate
                setColors(prevState => [...prevState, "green"])
              } else if (res.bpi[key].rate < prices.data[key].rate) {
                // color to red, if new rate is less than old rate
                setColors(prevState => [...prevState, "red"])
              }
            }
          })
          setPrices({ ...prices, data: res.bpi, time: res.time.updated });
          return;
        }
        setColors(["black", "black", "black"])
        setPrices({ ...prices, data: res.bpi, time: res.time.updated });
      }).catch(error => console.log("error"), setPrices({ ...prices, isError: true }));
    }).catch(error => console.log("error"), setPrices({ ...prices, isError: true }))
  };

  useEffect(() => {
    (async () => {
      await getData(true);
    })();
  }, [])

  useInterval(async () => {
    await getData(false);
  }, 4000);

  return (
    <div className='bitcoin'>
      {
        colors.map(col => {
          return <div>{col}</div>
        })
      }
      {
        prices?.data && Object.keys(prices.data).map((key, index) => {
          // eslint-disable-next-line react/jsx-key
          return <div className='currency-card'>
            <p className="tooltip">
              {prices.data[key].code}
              <span className="tooltiptext">{prices.data[key].description}</span>
            </p>
            <p key={key} style={{ color: colors[index] }}>{prices.data[key].rate.substr(0, 7)}{symbols[key]}</p>
          </div>
        })
      }
    </div>
  );
}


export default Bitcoin;

