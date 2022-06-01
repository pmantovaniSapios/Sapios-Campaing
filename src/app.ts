require("dotenv").config();
import config from "config";
import express from "express";
import router from "./routes/router";
// import { csvToJsonAndUpload } from "./lib/csvToJsonAndUpload";
import Logger from "../config/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// app.post("/upload", upload.single("file"), async (req: any, res: any) => {
//     let retorno = await csvToJsonAndUpload(req.file.filename);
//     return res.status(200).json(retorno)
// })

const port = config.get<number>("port") || 7000;

app.listen(port, async () => {
    Logger.info(`Running on port: ${port}`);
});