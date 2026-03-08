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
        wrapper.className = "dashboardGrid";

        this.config.systems.forEach(system => {
            const item = document.createElement("div");
            item.className = "dashboardItem";

            // Icon
            const icon = document.createElement("div");
            icon.className = "statusIcon";
            const s = this.statuses[system.host] || { state: "checking", latency: null };
            if (s.state === "online") icon.innerHTML = "✅";
            else if (s.state === "offline") icon.innerHTML = "❌";
            else icon.innerHTML = "⏳";

            // Label
            const label = document.createElement("div");
            label.className = "systemLabel";
            label.innerHTML = system.label;

            // Latency
            const latency = document.createElement("div");
            latency.className = "latency";
            if (this.config.showLatency && s.latency != null) {
                latency.innerHTML = s.latency + " ms";
            }

            item.appendChild(icon);
            item.appendChild(label);
            item.appendChild(latency);
            wrapper.appendChild(item);
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
