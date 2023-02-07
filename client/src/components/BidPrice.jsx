import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";

const socket = socketIoClient("http://localhost:5000", {});

const BidPrice = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("data", (data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      <h2>Latest Price From CoinMarketCap </h2>
      <h2>
        Connection Status :{" "}
        <span>
          {socket.connected ? "Connection Established" : "Disconnected"}
        </span>
      </h2>
      <h2>
        Latest Price BTC : <span>${data?.bidPrice}</span>
      </h2>
    </div>
  );
};

export default BidPrice;
