Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            { host: "192.168.1.100", label: "NAS", type: "ping" },
            { host: "http://example.com", label: "Website", type: "http" }
        ],
        interval: 15000,
        showLatency: true,
        showIcon: true
    },

    start: function () {
        this.statuses = {};
        this.config.systems.forEach(system => {
            this.statuses[system.host] = { state: "checking", latency: null };
        });
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

            // Label
            const label = document.createElement("span");
            label.className = "systemLabel";
            label.innerHTML = system.label + ": ";

            // Status icon
            const status = document.createElement("span");
            const s = this.statuses[system.host] || { state: "checking", latency: null };
            status.className = "status " + s.state;

            if (this.config.showIcon) {
                if (s.state === "online") status.innerHTML = "✅";
                else if (s.state === "offline") status.innerHTML = "❌";
                else status.innerHTML = "⏳";
                if (this.config.showLatency && s.latency != null) {
                    status.innerHTML += ` ${s.latency}ms`;
                }
            } else {
                status.innerHTML = s.state.toUpperCase();
                if (this.config.showLatency && s.latency != null) {
                    status.innerHTML += ` (${s.latency}ms)`;
                }
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
