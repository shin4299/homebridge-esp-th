# homebridge-esp-th
This plug-in is based on [UDP Json](https://github.com/rxseger/homebridge-udp-json).

UDP server for receiving JSON messages from remote sensors on your network,
plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g shin4299/homebridge-esp-th`
3.	Update your configuration file - see below for an example

## Configuration
* `accessory`: "ESPTH"  ---- Require
* `name`: descriptive name  ---- Require
* `listen_port`: UDP port to listen on for incoming messages   ---- No-Require(default 8266)

Example configuration:
```json
    "accessories": [
        {
            "accessory": "ESPTH",
            "name": "Bedroom"
        }
    ]
```
or

```json
    "accessories": [
        {
            "accessory": "ESPTH",
            "name": "Bedroom",
            "listen_port": 8266
        }
    ]
```


## ESP Easy Controllers Setting
* `Protocol`: generic UDP
* `Locate Controller`: Use IP address
* `Controller IP`: 192.168.1.100 (Your homebridge server IP)
* `Controller Port`: 8266
* `Controller Subscribe`: 
* `Controller Publish`:	{"temperature_c":%val1%, "humidity_percent": %val2%}
* `Enabled`: check

## License

MIT
