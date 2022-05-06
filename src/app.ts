require("dotenv").config();
import * as csv from '@fast-csv/parse';
import config from "config";
import express from "express";
import fs from "fs";
import path from "path";
import router from "./router/router";
import mariadb from "mariadb";
const multer = require("multer");
const app = express();

app.set('view engine', 'ejs')

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, "")
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connection
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapios',
    database: 'teste',
    port: 3306,
    connectionLimit: 5
})

app.use("/webhook", router);

app.get("/", (req: any, res: any) => {
    res.render("index")
})

app.post("/upload", upload.single("file"), (req: any, res: any) => {
    if (process.platform === "linux") {
        console.log("passou pelo linux");
        // csvToJsonAndUpload(req.file.filename)
    } else {
        // csvToJsonAndUpload(__dirname + 'uploads/' + req.file.filename)
    }
    res.render("index")
})

function csvToJsonAndUpload(filepath: any) {
    let stream = fs.createReadStream(filepath);
    type info = {
        id: number;
        nome: string;
        phone: string;
    };
    let csvData: Array<any> = [];
    let csvStream = csv
        .parse({ headers: true })
        .transform(
            (data: any) => ({
                id: data.id,
                nome: data.nome,
                phone: data.phone,
            })
        )
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", async function () {
            let coon: any;
            try {
                coon = await pool.getConnection()
                for (let index = 0; index < csvData.length; index++) {
                    coon.query(`INSERT INTO datacampaings SET campaingsId=1, nome="${csvData[index].nome}", phone="${csvData[index].phone}" ON DUPLICATE KEY UPDATE nome = "${csvData[index].nome}", phone = "${csvData[index].phone}"`);
                }

            } catch (error) {
                console.error(error);
            } finally {
                if (coon) coon.release();
                console.log("Closed");
            }
            fs.unlinkSync(filepath)
        });
    stream.pipe(csvStream);
}

const port = config.get<number>("port") || 7000;

app.listen(port, async () => {
    console.log(`Running on port: ${port}`);
});