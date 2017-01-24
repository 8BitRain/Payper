//Dependencies
import { Dimensions} from "react-native";
var DeviceInfo = require('react-native-device-info');


const dimensions = Dimensions.get('window');

/**
  * Determine Device Type based on width
  * currently determines if device is iPhoneSE, iPhone6, iPhone6+,
  * TODO Android sizing
**/
const device = getDeviceType(dimensions.width);
//TODO fix exporting deviceOS
const deviceOS = DeviceInfo.getSystemName();



export function getDeviceType(dims){
  switch(dims){
    case 320:
        return "SE";
        break;
    case 375:
        return  "6";
        break;
    case 414:
        return "6+";
        break;
  }
}

module.exports = device, deviceOS
