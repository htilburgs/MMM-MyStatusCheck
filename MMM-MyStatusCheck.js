getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "statusContainer";

    this.config.systems.forEach(system => {
        const systemWrapper = document.createElement("div");
        systemWrapper.className = "systemWrapper";

        // Label
        const label = document.createElement("span");
        label.className = "systemLabel";
        label.textContent = system.label + ":";

        // Status icon/text
        const status = document.createElement("span");
        status.className = "status";

        // Get current status safely
        const s = this.statuses[system.host] || { state: "checking", latency: null };
        const state = s.state || "checking";  // fallback
        const latency = (typeof s.latency === "number") ? s.latency : null;

        if (this.config.showIcon) {
            // Safe icon fallback
            const iconClass = (system.icons && system.icons[state]) || "fas fa-question-circle";
            status.innerHTML = `<i class="${iconClass}"></i>`;

            // Color
            const color = (system.colors && system.colors[state]) || "#ffffff";
            const iconEl = status.querySelector("i");
            if (iconEl) iconEl.style.color = color;

            // Show latency if available
            if (this.config.showLatency && latency !== null) {
                status.innerHTML += ` ${latency}ms`;
            }
        } else {
            // Fallback text
            status.textContent = state.toUpperCase();
            if (this.config.showLatency && latency !== null) {
                status.textContent += ` (${latency}ms)`;
            }
        }

        systemWrapper.appendChild(label);
        systemWrapper.appendChild(status);
        wrapper.appendChild(systemWrapper);
    });

    return wrapper;
},
