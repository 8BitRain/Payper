import DeviceInfo from 'react-native-device-info'

function getDeviceDetails() {
  let details = {
    id: DeviceInfo.getUniqueID(),
    brand: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
    build: DeviceInfo.getBuildNumber(),
    version: DeviceInfo.getVersion()
  }

  return details
}

module.exports = getDeviceDetails
