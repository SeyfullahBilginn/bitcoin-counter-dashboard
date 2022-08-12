import { useEffect, useRef } from "react";

export default function useInterval(callback, delay) {
    const savedCallback = useRef();
    
    // Remember the latest callback.
    useEffect(() => {
        // console.log("callback: " + callback);
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        // console.log("delay: " + delay);
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

