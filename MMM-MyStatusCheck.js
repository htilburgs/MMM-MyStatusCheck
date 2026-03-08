Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            { host: "192.168.1.100", label: "NAS", type: "ping" },
            { host: "http://example.com", label: "Website", type: "http" }
        ],
        interval: 15000, // 15 seconds
        showLatency: true
    },

    start: function () {
        this.statuses = {};
        this.sendSocketNotification("CONFIG", this.config);
    },

    getStyles: function () {
        return ["MMM-MyStatusCheck.css"];
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "statusContainer";

        this.config.systems.forEach(system => {
            const systemWrapper = document.createElement("div");
            systemWrapper.className = "systemWrapper";

            const label = document.createElement("span");
            label.className = "systemLabel";
            label.innerHTML = system.label + ": ";

            const status = document.createElement("span");
            const s = this.statuses[system.host] || { state: "checking", latency: null };
            status.className = "status " + s.state;
            status.innerHTML = s.state.toUpperCase();
            if (this.config.showLatency && s.latency != null) {
                status.innerHTML += ` (${s.latency}ms)`;
            }

            systemWrapper.appendChild(label);
            systemWrapper.appendChild(status);
            wrapper.appendChild(systemWrapper);
        });

        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "STATUS_RESULT") {
            this.statuses[payload.host] = {
                state: payload.alive ? "online" : "offline",
                latency: payload.latency
            };
            this.updateDom();
        }
    }

});
