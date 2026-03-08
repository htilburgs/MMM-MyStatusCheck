Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            {
                host: "192.168.1.100", label: "NAS", type: "ping",
                icons: {online: "fas fa-server", offline: "fas fa-times-circle", checking: "fas fa-spinner fa-spin" },
                colors: { online: "green", offline: "red", checking: "orange" }
            },
            {
                host: "http://example.com",
                label: "Website",
                type: "http",
                icons: {
                    online: "fas fa-globe",
                    offline: "fas fa-exclamation-circle",
                    checking: "fas fa-spinner fa-spin"
                },
                colors: {
                    online: "#00aaff",
                    offline: "#ff0000",
                    checking: "#ffaa00"
                }
            }
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
        return ["MMM-MyStatusCheck.css", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"];
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
            status.className = "status";

            if (this.config.showIcon) {
                const iconClass = (system.icons && system.icons[s.state]) || "";
                status.innerHTML = `<i class="${iconClass}"></i>`;
                // Apply per-system color
                const color = (system.colors && system.colors[s.state]) || "#ffffff";
                status.querySelector("i").style.color = color;

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
