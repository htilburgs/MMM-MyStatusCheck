# MMM-MyStatusCheck

## Configuration
```
{
    module: "MMM-MyStatusCheck",
    position: "top_right",
    config: {
        systems: [
             { host: "192.168.0.1", label: "Unify Router", type: "ping",
               icons: { online: "fas fa-server", offline: "fas fa-times-circle", checking: "fas fa-spinner fa-spin" },
               colors: { online: "#00ff00", offline: "#ff4444", checking: "#ffaa00" }
            },
            { host: "http://example.com", label: "Website", type: "http",
              icons: { online: "fas fa-globe", offline: "fas fa-exclamation-circle", checking: "fas fa-spinner fa-spin" },
              colors: { online: "green", offline: "red", checking: "orange" }
            },
        ],
        interval: 15000,        // Default 15 seconds
        showLatency: true
    }
},
```
