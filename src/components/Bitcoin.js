import React, { useEffect } from 'react';
import { useState } from 'react';
import useInterval from './useInterval';
import "./Bitcoin.css";

const TIME_INTERVAL = 4000;
function Bitcoin() {
  const [prices, setPrices] = useState(
    {
      data: {},
      time: '',
      isLoading: false,
      isError: false,
    })
  const [symbols] = useState({
    USD: "$",
    EUR: "€",
    GBP: "£",
  })
  const [colors, setColors] = useState([]);


  const getData = (isFirstCall) => {
    setPrices({ ...prices, isLoading: true });

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
          // data da time hiç yoksa
          if (isFirstCall && prices.time === '') {
            // first iteration
            setColors(Array(Object.keys(res.bpi).length).fill("black"))
            setPrices({ ...prices, data: res.bpi, time: res.time.updated });
            return;
          }
          Object.keys(res.bpi).forEach(key => {
            // highlight colors related to new data's rise or fall
            if (res.bpi[key].rate > prices.data[key].rate) {
              // color to green, if new rate is more than old rate
              setColors(prevState => [...prevState, "green"])
            } else if (res.bpi[key].rate < prices.data[key].rate) {
              // color to red, if new rate is less than old rate
              setColors(prevState => [...prevState, "red"])
            } else {
              // color to black, if new rate is equal to old rate
              setColors(prevState => [...prevState, "black"])
            }
          })
          setPrices({ ...prices, data: res.bpi, time: res.time.updated });
          return;
        }
        setColors(Array(Object.keys(res.bpi).length).fill("black"))
        setPrices({ ...prices, data: res.bpi, time: res.time.updated });
      }).catch(error => console.error(error), setPrices({ ...prices, isError: true }));
    }).catch(error => console.error(error), setPrices({ ...prices, isError: true }))
  };

  useEffect(() => {
    (async () => {
      await getData(true);
    })();
  }, [])

  useInterval(async () => {
    await getData(false);
  }, TIME_INTERVAL);

  return (
    <div className='bitcoin-parent'>
      <div className='bitcoin-child'>
        {
          prices?.data && Object.keys(prices.data).map((key, index) => {
            return <div className='currency-card' key={index}>
              <p className="tooltip">
                {prices.data[key].code}
                <span className="tooltiptext">{prices.data[key].description}</span>
              </p>
              <p key={key} style={{ color: colors[index] }}>{prices.data[key].rate.substr(0, 6)}{symbols[key]}</p>
            </div>
          })
        }
      </div>
      <div>
        <h2>Tutorial</h2>
        <h3>Bitcoin</h3>
        <p>
          Bitcoin data is updated every 4 seconds. If the upcoming data is different than the current data,
          prices are highlighted depending on the rise or fall of the prices as green or red. If the upcoming data is the same as 
          the current data, prices are not highlighted.
          Additionally, there is a tooltip that shows the description of the currency.
        </p>
        <h3>Counter</h3>
        <p>
          Counter counts down from 10 hours. User can increment or decrement any of hour, minute and second by
          using up or down icons on the dashboard. Counter doesn not allow to decrease below 0. In case of decreasing below 0,
          warning popup arises with the dynamic error message.
          Also, increasing any type of counter above 59 causes setting it to 0 and increasing its parent counter by 1.
          Similarly, decreasing any type of counter below 00 causes setting it to 59 and decreasing its parent counter by 1 whether its parent counter greater than 0.
        </p>
      </div>
    </div>
  );
}


export default Bitcoin;

