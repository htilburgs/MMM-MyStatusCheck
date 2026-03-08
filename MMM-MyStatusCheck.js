Module.register("MMM-MyStatusCheck", {

    defaults: {
        host: "192.168.0.1",
        label: "Server",
        interval: 10000
    },

    start: function () {
        this.status = "Checking...";
        this.sendSocketNotification("CONFIG", this.config);
    },

    getStyles: function () {
        return ["MMM-MyStatusCheck.css"];
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        wrapper.className = "myStatusWrapper";

        let label = document.createElement("span");
        label.innerHTML = this.config.label + ": ";

        let status = document.createElement("span");
        status.className = "status " + this.status.toLowerCase();
        status.innerHTML = this.status;

        wrapper.appendChild(label);
        wrapper.appendChild(status);

        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "STATUS_RESULT") {
            this.status = payload ? "ONLINE" : "OFFLINE";
            this.updateDom();
        }
    }

});
