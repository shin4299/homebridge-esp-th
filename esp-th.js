'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-esp-th', 'ESPTH', ESPTHPlugin);
};

class ESPTHPlugin
{
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.name_temperature = config.name_temperature || this.name + 'temp';
    this.name_humidity = config.name_humidity || this.name + 'humi';
    this.listen_port = config.listen_port || 8266;
	  
	this.informationService = new Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Bosch")
      .setCharacteristic(Characteristic.Model, "RPI-UDPJSON")
      .setCharacteristic(Characteristic.SerialNumber, this.device);
	  
   this.temperatureService = new Service.TemperatureSensor(this.name_temperature);	    
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: -100,
        maxValue: 100
      });
    	this.humidityService = new Service.HumiditySensor(this.name_humidity);
    

    this.server = dgram.createSocket('udp4');
    
    this.server.on('error', (err) => {
      console.log(`udp server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      console.log(`server received udp: ${msg} from ${rinfo.address}`);

      let json;
      try {
          json = JSON.parse(msg);
      } catch (e) {
          console.log(`failed to decode JSON: ${e}`);
          return;
      }

      const temperature_c = json.temperature_c;
      //const pressure_hPa = json.pressure_hPa; // TODO
      //const altitude_m = json.altitude_m;
      const humidity_percent = json.humidity_percent;
	    
    if (temperature_c > -100) { 
   	this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .setValue(Math.round(temperature_c));
    }	    
    if (humidity_percent > 0) {
      	this.heumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .setValue(Math.round(humidity_percent));
    }
    });

    
    this.server.bind(this.listen_port);

  }

  getServices() {
	  
	return [this.informationService, this.temperatureService, this.humidityService];

  }
}
