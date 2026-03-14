Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            { host: "192.168.0.1", label: "Router", type: "ping",
              icons: { online: "fas fa-server", offline: "fas fa-times-circle", checking: "fas fa-spinner fa-spin" },
              colors: { online: "#00ff00", offline: "#ff4444", checking: "#ffaa00" }
            },
        ],
        interval: 15000,        // Default 15 seconds
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

            const s = this.statuses[system.host] || { state: "checking", latency: null };
            const state = s.state || "checking";
            const latency = (typeof s.latency === "number") ? s.latency : null;

            // Left column: label
            const labelDiv = document.createElement("div");
            labelDiv.className = "statusLabel";
            labelDiv.textContent = system.label || "";
            row.appendChild(labelDiv);

            // Middle column: icon
            const iconDiv = document.createElement("div");
            iconDiv.className = "statusIcon";
            if (this.config.showIcon) {
                const iconClass = (system.icons && system.icons[state]) || "fas fa-question-circle";
                iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
                const color = (system.colors && system.colors[state]) || "#ffffff";
                const iconEl = iconDiv.querySelector("i");
                if (iconEl) iconEl.style.color = color;
            }
            row.appendChild(iconDiv);

            // Right column: latency
            const latencyDiv = document.createElement("div");
            latencyDiv.className = "statusLatency";
            latencyDiv.textContent = (this.config.showLatency && latency !== null) ? `${latency}ms` : "-";
            row.appendChild(latencyDiv);

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
