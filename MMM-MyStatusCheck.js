Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            { host: "192.168.0.1", label: "Router", type: "ping",
              icons: { online: "fas fa-server", offline: "fas fa-times-circle", checking: "fas fa-spinner fa-spin" },
              colors: { online: "#00ff00", offline: "#ff4444", checking: "#ffaa00" } 
            },
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
            const row = document.createElement("div");
            row.className = "statusRow";

            // Left column: label
            const label = document.createElement("div");
            label.className = "statusLabel";
            label.textContent = system.label || "";
            row.appendChild(label);

            // Right column: icon + latency
            const status = document.createElement("div");
            status.className = "statusValue";

            const s = this.statuses[system.host] || { state: "checking", latency: null };
            const state = s.state || "checking";
            const latency = (typeof s.latency === "number") ? s.latency : null;

            if (this.config.showIcon) {
                const iconClass = (system.icons && system.icons[state]) || "fas fa-question-circle";
                status.innerHTML = `<i class="${iconClass}"></i>`;
                const color = (system.colors && system.colors[state]) || "#ffffff";
                const iconEl = status.querySelector("i");
                if (iconEl) iconEl.style.color = color;

                if (this.config.showLatency && latency !== null) {
                    status.innerHTML += ` ${latency}ms`;
                }
            } else {
                status.textContent = state.toUpperCase();
                if (this.config.showLatency && latency !== null) {
                    status.textContent += ` (${latency}ms)`;
                }
            }

            row.appendChild(status);
            wrapper.appendChild(row);
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
