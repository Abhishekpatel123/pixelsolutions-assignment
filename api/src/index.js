import axios from 'axios';
import { createServer } from 'http';
import { Server } from 'socket.io';
import FormData from 'form-data';
import express from 'express';
import cron from 'node-cron';

import { dbConnection } from './db/connect.js';
import BitPriceModel from './db/models/BitPriceModel.js';

const PORT = 5000;
const URL = 'https://dev.pixelsoftwares.com/api.php';
const formData = new FormData();
formData.append('symbol', 'BTCUSDT');
const options = {
  headers: { token: 'ab4086ecd47c568d5ba5739d4078988f' },
};

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: '*',
});

let noOfApiRequest = 100;
let secondInDay = 86400; // 60*60*24
// let breakTime = parseInt(secondInDay / noOfApiRequest);
let breakTime = 60; // in second

let intervalId;
let clients = {};
io.on('connection', (socket) => {
  console.log(socket.id, 'client joined');

  socket.on('bit-price-page', () => {
    clients = { [socket.id]: true };
    console.log(clients, 'client counts');
    task.start();
    store(socket, breakTime);
  });

  socket.on('disconnect', () => {
    delete clients[socket.id];
    console.log(clients, 'client counts');
    if (Object.keys(clients).length === 0) task.stop();
    console.log('disconnect', socket.id);
  });
  // leave the page so no need to emit and do corn job
  socket.on('stop-interval', () => {
    delete clients[socket.id];
    console.log(clients, 'client counts');
    if (Object.keys(clients).length === 0) task.stop();
    console.log('page change stop interval', socket.id);
  });
});

const store = async (socket, breakTime) => {
  try {
    const bitPrice = await BitPriceModel.findOne({});
    if (!bitPrice?.bidPrice) {
      console.log('bit price not in store');
      const data = await fetchBitPriceApi();
      socket.emit('data', data);
      await BitPriceModel.deleteMany({});
      await BitPriceModel.create(data);
      return;
    }

    // - If bit price already present
    console.log('bit price in store');
    const nowDate = new Date(new Date().toISOString()).getTime();
    const is = (nowDate - bitPrice.time) / 1000 > breakTime;
    // Is expire or not
    if (is) {
      console.log('expired');
      const data = await fetchBitPriceApi();
      socket.emit('data', data);
      await BitPriceModel.deleteMany({});
      await BitPriceModel.create(data);
      return;
      // console.log(response.data, 'data');
    }
    // If is not expire then we can send the previous store bit price
    console.log('not expired');
    socket.emit('data', bitPrice);
  } catch (err) {
    console.log('store error', err);
  }
};

httpServer.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
  dbConnection();
});

process.count = 0;
const fetchBitPriceApi = async () => {
  console.log(process.count++, 'api call count');
  try {
    const response = await axios.post(URL, formData, options);
    return response.data.data;
  } catch (err) {
    console.log(err, 'api error');
  }
};

const task = cron.schedule(
  '*/60 * * * * *',
  async () => {
    console.log('running a task every minute');
    const data = await fetchBitPriceApi();

    io.emit('data', data);
    await BitPriceModel.deleteMany({});
    await BitPriceModel.create(data);

    // store(socket, breakTime);
  },
  { scheduled: false }
);
