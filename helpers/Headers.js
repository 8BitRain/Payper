
export function get(header, callbacks, index) {
  switch (header) {
    case "notifications":
      return {
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
    break;
    case "fundingSources":
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": false,
        },
        index: null,
        numCircles: null,
        title: "Bank Accounts",
        callbackIn: null,
        callbackOut: null,
      };
    break;
    case "profile":
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": false,
        },
        index: 0,
        numCircles: null,
        title: "My Profile",
        callbackIn: null,
        callbackOut: null,
        accent: true,
      };
    break;
    case "invite":
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": false,
        },
        index: 0,
        numCircles: null,
        title: "Invite a Contact",
        callbackIn: null,
        callbackOut: null,
        accent: true,
      };
    break;
    case "payments":
      return {
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
        callbackIn: () => callbacks.setActiveFilterToIncoming(),
        callbackOut: () => callbacks.setActiveFilterToOutgoing(),
        accent: false,
      };
    break;
    case "createPayment":
      return {
        types: {
          "paymentIcons": true,
          "closeIcon": (index == 0) ? true : false,
          "closeIconTopRight": (index > 0) ? true : false,
          "backIcon": (index > 0) ? true : false,
        },
        index: index,
        numCircles: null,
        title: null,
        callbackIn: null,
        callbackOut: null,
      };
    break;
    default:
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": false,
          "closeIcon": false,
          "flowTabs": false,
        },
        index: null,
        numCircles: null,
        title: null,
        callbackIn: null,
        callbackOut: null,
      };
  }
};
