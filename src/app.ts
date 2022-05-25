require("dotenv").config();
import config from "config";
import express from "express";
import router from "./router/router";
import path from "path";
import { csvToJsonAndUpload } from "./lib/csvToJsonAndUpload";
import Logger from "../config/logger";
const multer = require("multer");
const app = express();

app.set('view engine', 'ejs')

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        if (process.platform === "linux") {
            cb(null, "")
        } else {
            cb(null, "")
        }
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// Load initial page
app.get("/", (req: any, res: any) => {
    res.render("index");
})

app.post("/upload", upload.single("file"), (req: any, res: any) => {
    if (process.platform === "linux") {
        csvToJsonAndUpload(req.file.filename);
    } else {
        csvToJsonAndUpload(req.file.filename);
    }
    res.render("upload")
})

const port = config.get<number>("port") || 7000;

app.listen(port, async () => {
    Logger.info(`Running on port: ${port}`);
});