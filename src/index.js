import './jobs/seatLockExpiry.js';

import express from 'express';
import StatusCode from 'http-status-codes';

import { connectDB } from './config/mongoConfig.js';
import apiRouter from './Routes/apiRouter.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const PORT = 3000;

app.get('/ping', (req, res) => {
    return res.status(StatusCode.OK).json({ message: "pong" });
})
app.use('/api', apiRouter);
app.listen(PORT, async () => {
    console.log(`sever started`);
    try {
        await connectDB();
        
    } catch (error) {
        console.log('error in connectiong with db', error);
    }
})
