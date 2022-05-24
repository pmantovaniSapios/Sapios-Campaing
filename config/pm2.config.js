"use strict";
const path = require("path");

module.exports = {
    name: "Sapios-Compaing",
    script: path.resolve(__dirname, "../src/app.js"),
    instances: "1",
    output: path.resolve(__dirname, "../out.log"),
    error: path.resolve(__dirname, "../error.log"),
    exec_mode: "cluster",
    env_production: {
        NODE_ENV: "production"
    }
};
//# sourceMappingURL=pm2.config.js.map