import path from "path";

module.exports = {
    name: "Sapios-Campaings",
    script: path.resolve(__dirname, "../src/app.js"),
    instances: "1",
    output: path.resolve(__dirname, "../src/logs/out.log"),
    error: path.resolve(__dirname, "../src/logs/error.log")
};