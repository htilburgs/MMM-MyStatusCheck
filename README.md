# MMM-MyStatusCheck

## Configuration
```
{
    module: "MMM-MyStatusCheck",
    position: "top_right",
    config: {
        systems: [
             { host: "192.168.0.1", label: "Unify Router", type: "ping", icon: "fas fa-server",
               colors: { online: "#00ff00", offline: "#ff4444", checking: "#ffaa00" }
            },
            { host: "http://example.com", label: "Website", type: "http", icon: "fas fa-globe",
              colors: { online: "green", offline: "red", checking: "orange" }
            },
            { host: "192.168.0.222", label: "Persoon", type: "person", icon: "fas fa-person",
              mac: "AA:BB:CC:DD:EE:FF", // optional, ARP check
              colors: { online: "green", offline: "red", checking: "orange" }
        ],
        interval: 15000,        // Default 15 seconds
        showLatency: true
    }
},
```
