const NodeHelper = require("node_helper");
const { exec } = require("child_process");
const https = require("https");
const http = require("http");
const url = require("url");

module.exports = NodeHelper.create({

    start: function () {
        console.log("MMM-MyStatusCheck helper started");
    },

    socketNotificationReceived: function (notification, config) {
        if (notification === "CONFIG") {
            this.config = config;
            this.startChecking();
        }
    },

    startChecking: function () {
        const self = this;

        setInterval(function () {
            self.config.systems.forEach(system => {
                if (system.type === "ping") {
                    self.pingHost(system.host);
                } else if (system.type === "http") {
                    self.httpCheck(system.host);
                }
            });
        }, this.config.interval);
    },

    pingHost: function (host) {
        const start = Date.now();
        exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
            const latency = error ? null : Date.now() - start;
            this.sendSocketNotification("STATUS_RESULT", {
                host: host,
                alive: !error,
                latency: latency
            });
        });
    },

    httpCheck: function (hostUrl) {
        const start = Date.now();
        const parsedUrl = url.parse(hostUrl);
        const lib = parsedUrl.protocol === 'https:' ? https : http;

        const req = lib.get(parsedUrl, (res) => {
            const latency = Date.now() - start;
            const alive = res.statusCode >= 200 && res.statusCode < 400;
            this.sendSocketNotification("STATUS_RESULT", {
                host: hostUrl,
                alive: alive,
                latency: latency
            });
        });

        req.on('error', () => {
            this.sendSocketNotification("STATUS_RESULT", {
                host: hostUrl,
                alive: false,
                latency: null
            });
        });

        req.setTimeout(5000, () => req.abort());
    }

});
