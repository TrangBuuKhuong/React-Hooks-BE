import express from "express";
import viewEngine from "./config/viewEngine";
import bodyParser from "body-parser";// get parameter:  req.query.param.id
import initWebRoutes from "./routes/web";
require('dotenv').config();

let app = express();

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log('Backend Generate Image is running on port:', port)
})