const NodeHelper = require("node_helper");
const { exec } = require("child_process");

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

            exec(`ping -c 1 ${self.config.host}`, (error) => {
                const alive = !error;
                self.sendSocketNotification("STATUS_RESULT", alive);
            });

        }, this.config.interval);
    }

});
