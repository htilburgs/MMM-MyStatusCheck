# MMM-MyStatusCheck

## Configuration
```
{
    module: "MMM-MyStatusCheck",
    position: "top_right",
    config: {
        systems: [
            { host: "192.168.1.100", label: "NAS", type: "ping" },
            { host: "http://example.com", label: "Website", type: "http" },
            { host: "192.168.1.1", label: "Router", type: "ping" }
        ],
        interval: 15000,
        showLatency: true
    }
},
```
