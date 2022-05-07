"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const csv = __importStar(require("@fast-csv/parse"));
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./router/router"));
const mariadb_1 = __importDefault(require("mariadb"));
const multer = require("multer");
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer({ storage });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection
const pool = mariadb_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapios',
    database: 'teste',
    port: 3306,
    connectionLimit: 5
});
app.use("/webhook", router_1.default);
app.get("/", (req, res) => {
    res.render("index");
});
app.post("/upload", upload.single("file"), (req, res) => {
    if (process.platform === "linux") {
        csvToJsonAndUpload(req.file.filename);
    }
    else {
        csvToJsonAndUpload(__dirname + 'uploads/' + req.file.filename);
    }
    res.render("index");
});
function csvToJsonAndUpload(filepath) {
    let stream = fs_1.default.createReadStream(filepath);
    let csvData = [];
    let csvStream = csv
        .parse({ headers: true })
        .transform((data) => ({
        id: data.id,
        nome: data.nome,
        phone: data.phone,
    }))
        .on("data", function (data) {
        csvData.push(data);
    })
        .on("end", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let coon;
            try {
                coon = yield pool.getConnection();
                for (let index = 0; index < csvData.length; index++) {
                    coon.query(`INSERT INTO datacampaings SET campaingsId=1, nome="${csvData[index].nome}", phone="${csvData[index].phone}" ON DUPLICATE KEY UPDATE nome = "${csvData[index].nome}", phone = "${csvData[index].phone}"`);
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                if (coon)
                    coon.release();
                console.log("Closed");
            }
            fs_1.default.unlinkSync(filepath);
        });
    });
    stream.pipe(csvStream);
}
const port = config_1.default.get("port") || 7000;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Running on port: ${port}`);
}));
//# sourceMappingURL=app.js.map