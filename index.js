require('dotenv').config({path: './src/.env'});
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./src/routes/index.js');
const {connectDataBase} = require("./src/database/db.create.js");
const errorMiddleware = require('./src/middelware/error.middleware.js')

const app = express();
const PORT = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';



async function main () {
    try {
        await app.use(express.json());
        await app.use(cookieParser());
        await app.use(cors({
            credentials: true,
            origin: process.env.CLIENT_API
        }));
        await app.use('/api', router);
        await app.use(errorMiddleware);

        await connectDataBase();

        await app.listen(3000, () => {
            console.log(`Server is running on http://${hostname}:${PORT}`);
        })
    } catch (err) {

    }
}

main().then(() => {
    console.log("Server successfully working")
})