import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} - ${info.level} : ${info.message}`
    )
);

let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `./src/logs/campaing_info_${date}.log` }),
    new winston.transports.File({
        filename: `./src/logs/campaing_error_${date}.log`,
        level: "error"
    })
];

const Logger = winston.createLogger({
    levels,
    format,
    transports
});

export default Logger;