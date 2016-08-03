/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Headers.js  💣
  *
  *   Contains header property objects for the following pages:
  *     💣  Tracking (payments)
  *     💣  Global (payments)
  *     💣  Notifications
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/

// Header props for Notifications page
export function notificationsHeader() {
  var props = {
    types: {
      "paymentIcons": false,
      "circleIcons": false,
      "settingsIcon": true,
      "closeIcon": false,
      "flowTabs": false,
    },
    index: null,
    numCircles: null,
    title: "Notifications",
    callbackIn: null,
    callbackOut: null,
  };

  return props;
};


// Header props for Tracking Payments tab
export function trackingHeader(options) {
  var props = {
    types: {
      "paymentIcons": false,
      "circleIcons": false,
      "settingsIcon": true,
      "closeIcon": false,
      "flowTabs": true,
    },
    index: null,
    numCircles: null,
    title: null,
    callbackIn: () => options.callbackIn(),
    callbackOut: () => options.callbackOut(),
  };

  return props;
};


// Header props for Global Payments tab
export function globalHeader(options) {
  var props = {
    types: {
      "paymentIcons": false,
      "circleIcons": false,
      "settingsIcon": true,
      "closeIcon": false,
      "flowTabs": false,
    },
    index: null,
    numCircles: null,
    title: "Global Payments",
    callbackIn: null,
    callbackOut: null,
  };

  return props;
};
