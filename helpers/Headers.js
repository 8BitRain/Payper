
export function get(params) {
  switch (params.header) {
    case "notifications":
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": false,
          "notificationsIcon": true
        },
        index: null,
        numCircles: null,
        title: "Notifications",
        callbackNotifications: () => params.closeNotifications(),
        callbackIn: null,
        callbackOut: null,
        opacity: 0.6
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
          "notificationsIcon": true
        },
        index: null,
        numCircles: null,
        title: null,
        callbackIn: () => params.setActiveFilterToIncoming(),
        callbackOut: () => params.setActiveFilterToOutgoing(),
        callbackNotifications: () => params.openNotifications(),
        accent: false,
        opacity: 1.0
      };
    break;
    case "createPayment":
      return {
        types: {
          "paymentIcons": true,
          "closeIcon": (params.index == 0) ? true : false,
          "closeIconTopRight": (params.index > 0) ? true : false,
          "backIcon": (params.index > 0) ? true : false,
        },
        index: params.index,
        numCircles: null,
        title: null,
        callbackIn: null,
        callbackOut: null,
      };
    break;
    case "photoUpload":
      return {
        types: {
          "backIcon": (params.index > 0) ? true : false,
          "closeIcon": (params.index == 0 ) ? true : false
        },
        index: params.index,
        numCircles: null,
        title: params.title,
        callbackIn: null,
        callbackOut: null,
      };
    break;
    case "trendingPurpose":
      return {
        types: {
          "backIcon": (params.index > 0) ? true : false,
          "closeIcon": (params.index == 0 ) ? true : false
        },
        index: params.index,
        numCircles: null,
        title: params.title,
        callbackIn: null,
        callbackOut: null,
        accent: true,
        obsidian: false
      };
    break;
    case "editProfile":
      return {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": false,
          "closeIcon": true,
          "flowTabs": false,
        },
        index: 0,
        numCircles: null,
        title: params.title,
        callbackIn: null,
        callbackOut: null,
        accent: true,
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
