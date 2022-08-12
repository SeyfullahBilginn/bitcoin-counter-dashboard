/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import useInterval from './useInterval';

function Bitcoin() {
  const [prices, setPrices] = useState(
    {
      data: {},
      time: '',
      isError: false,
    })
  const [colors, setColors] = useState([]);


  const getData = (isFirstCall) => {
    const api = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    fetch(api, {
      method: 'GET',
    }).then(res => {
      res.json().then(res => {
        if (prices.time !== res.time.updated) {
          //if times are euqal, do not update colors
          Object.keys(res.bpi).forEach(key => {
            if (!isFirstCall && prices.time === res.time.updated) {
              return;
            }
            // data da time hiç yoksa
            if (isFirstCall && prices.time === '') {
              // //first iteration
              setColors(["grey", "grey", "grey"])
            }
            else {
              if (res.bpi[key].rate > prices.data[key].rate) {
                // color to green, if new rate is more than old rate
                setColors(["green", "green", "green"])
              } else if (res.bpi[key].rate < prices.data[key].rate) {
                // color to red, if new rate is less than old rate
                setColors(["red", "red", "red"])
              }
            }
          })
          setPrices({ ...prices, data: res.bpi, time: res.time.updated });
          return;
        }

        setColors(["black", "black", "black"])
        setPrices({ data: res.bpi, time: res.time.updated });
      }).catch(error => console.log(error), setPrices({ ...prices, isError: true }));
    }).catch(error => console.log(error), setPrices({ ...prices, isError: true }))
  };
  const [time, setTime] = useState(Date.now()); 

  useEffect(() => {
    (async () => {
      await getData(true);
    })();
  }, [])

  useInterval(async () => {
    await getData(false);
  }, 4000);

  return (
    <div>
      {prices.isLoading ? <div>Loading</div> : <div>yüklendi</div>}
      {prices.isError ? <div>Error</div> : <div>Err yok</div>}
      <div style={{ height: 120 }}>
        {
          prices?.data && Object.keys(prices.data).map((key, index) => {
            // eslint-disable-next-line react/jsx-key
            return <p key={key} style={{ color: colors[index] }}>Code: {prices.data[key].code} = {prices.data[key].rate}</p>
          })
        }
      </div>
    </div>
  );
}


export default Bitcoin;

