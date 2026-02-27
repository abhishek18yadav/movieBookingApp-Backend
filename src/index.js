import express from 'express';
import StatusCode from 'http-status-codes';

import { connectDB } from './config/mongoConfig.js';
const app = express();

const PORT = 3000;

app.get('/ping', (req, res) => {
    return res.status(StatusCode.OK).json({ message: "pong" });
})

app.listen(PORT, async () => {
    console.log(`sever started`);
    try {
        await connectDB();
        console.log(`connected to mongodb`);
    } catch (error) {
        console.log('error in connectiong with db', error);
    }
})
