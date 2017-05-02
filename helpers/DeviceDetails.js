//Dependencies
import { Dimensions} from "react-native";

const dimensions = Dimensions.get('window');

/**
  * Determine Device Type based on width
  * currently determines if device is iPhoneSE, iPhone6, iPhone6+,
  * TODO Android sizing
**/
const device = getDeviceType(dimensions.width);
console.log("DeviceType Dimensions.width: " + dimensions.width);
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

module.exports = device
