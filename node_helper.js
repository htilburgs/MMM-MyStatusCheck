const NodeHelper = require("node_helper");
const ping = require("ping"); // Node dependency (no OS ping needed)
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
            this.checkAll(); // run immediately
            this.schedule();
        }
    },

    schedule: function () {
        const self = this;
        setInterval(() => {
            self.checkAll();
        }, this.config.interval);
    },

    checkAll: function () {
        this.config.systems.forEach(system => {
            if (system.type === "ping") {
                this.pingHost(system.host);
            } else if (system.type === "http") {
                this.httpCheck(system.host);
            }
        });
    },

    pingHost: function (host) {
        const start = Date.now();
        ping.promise.probe(host, {
            timeout: 3
        }).then(res => {
            const latency = res.alive ? Date.now() - start : null;
            this.sendSocketNotification("STATUS_RESULT", {
                host: host,
                alive: res.alive,
                latency: latency
            });
        }).catch(() => {
            this.sendSocketNotification("STATUS_RESULT", {
                host: host,
                alive: false,
                latency: null
            });
        });
    },

    httpCheck: function (hostUrl) {
        try {
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
        } catch (e) {
            this.sendSocketNotification("STATUS_RESULT", {
                host: hostUrl,
                alive: false,
                latency: null
            });
        }
    }

});
