
Module.register("MMM-MyStatusCheck", {

    defaults: {
        systems: [
            { host: "192.168.0.1", label: "Router", type: "ping", icon: "fas fa-server",
              colors: { online: "green", offline: "red", checking: "orange" }
            },
            { host: "http://example.com", label: "Website", type: "http", icon: "fas fa-globe",
              colors: { online: "green", offline: "red", checking: "orange" }
            },
            { host: "192.168.0.50", label: "Alice", type: "person", icon: "fas fa-user",
              colors: { online: "green", offline: "red", checking: "orange" }
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
                let iconClass;
                if (state === "checking") iconClass = "fas fa-spinner fa-spin";
                else iconClass = system.icon || "fas fa-server";

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
