import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import itemsRoute from './routes/item.js';
import orderRouter from './routes/order.js';
import uploadRouter from './routes/uploadImage.js';

dotenv.config({ path: './config.env' });

const app = express();
 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res, next) => {
    res.send('Server is running...')
});

app.use('/server/upload', uploadRouter);

app.use('/server/auth', authRoute);

app.use('/server/items', itemsRoute);

app.use('/server/user', userRoute);

app.use('/server/orders', orderRouter);

/** Paypal */
app.get('/server/keys/paypal', (req, res, next) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sendbox')
});

/** Connect Database */
mongoose
    .connect(process.env.MONGODB_URL) 
    .then(() => {
        console.log('DB connected succesfully!')
    })
    .catch((error) => {
        console.log(error);
    });

/** Server */
app.listen(process.env.PORT || 4000 , () => {
    console.log(`Server running on ${process.env.PORT}`)
});