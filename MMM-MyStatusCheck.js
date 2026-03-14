const NodeHelper = require("node_helper");
const ping = require("ping");
const axios = require("axios");

module.exports = NodeHelper.create({

    start: function () {
        console.log("MMM-MyStatusCheck helper started");
    },

    socketNotificationReceived: function (notification, config) {
        if (notification === "CONFIG") {
            this.config = config;
            this.checkAll();
            this.schedule();
        }
    },

    schedule: function () {
        setInterval(() => { this.checkAll(); }, this.config.interval);
    },

    checkAll: function () {
        this.config.systems.forEach(system => {
            if (system.type === "ping") this.pingHost(system.host);
            else if (system.type === "http") this.httpCheck(system.host);
        });
    },

    pingHost: function (host) {
        const start = Date.now();
        ping.promise.probe(host, { timeout: 3 })
            .then(res => {
                const latency = res.alive ? Date.now() - start : null;
                this.sendSocketNotification("STATUS_RESULT", { host, alive: res.alive, latency });
            })
            .catch(() => {
                this.sendSocketNotification("STATUS_RESULT", { host, alive: false, latency: null });
            });
    },

    httpCheck: async function (hostUrl) {
        const start = Date.now();
        try {
            const res = await axios.get(hostUrl, { timeout: 5000 });
            const latency = Date.now() - start;
            const alive = res.status >= 200 && res.status < 400;
            this.sendSocketNotification("STATUS_RESULT", { host: hostUrl, alive, latency });
        } catch (e) {
            this.sendSocketNotification("STATUS_RESULT", { host: hostUrl, alive: false, latency: null });
        }
    }

});
