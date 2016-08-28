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
  *     💣  Create Payment
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


// Header props for Notifications page
export function fundingSourcesHeader() {
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
    title: "Bank Accounts",
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

// Header props for BankOnboarding tab
export function BankOnboardingTab(options) {
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


// Header props for Create Payment flow
export function createPaymentHeader() {
  var props = {
    types: {
      "paymentIcons": true,
      "circleIcons": false,
      "settingsIcon": false,
      "closeIcon": true,
      "flowTabs": false,
    },
    index: 0,
    numCircles: null,
    title: null,
    callbackIn: null,
    callbackOut: null,
  };

  return props;
};


// Header props for last page in the Create Payment flow
export function createPaymentPurposeHeader(options) {
  var props = {
    types: {
      "paymentIcons": true,
      "circleIcons": false,
      "settingsIcon": false,
      "closeIcon": false,
      "closeIconTopRight": true,
      "backIcon": true,
      "flowTabs": false,
    },
    index: 0,
    numCircles: null,
    title: null,
    callbackIn: null,
    callbackOut: null,
    callbackBack: () => options.callbackBack(),
  };

  return props;
};


// Header props for Create Payment flow
export function profileHeader() {
  var props = {
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

  return props;
};
