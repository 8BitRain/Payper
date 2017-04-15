function getOnboardingPercentage(appFlags) {
  let customer_status = appFlags.customer_status;
  let onboardingPercentage = 0;

  switch (appFlags.onboardingProgress) {
    case "kyc-success":
      onboardingPercentage = 100;
      break;
    case "need-bank":
      if(customer_status== "verified"){
        onboardingPercentage = 75;
      }
      if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-suspended"){
        onboardingPercentage = 60;
      }
      if(customer_status == "kyc-documentRecieved"){
        onboardingPercentage = 65;
      }
      if(customer_status == "kyc-documentProcessing"){
        onboardingPercentage = 75;
      }
      if(customer_status == "unverified"){
        onboardingPercentage = 50;
      }
      break;
    case "microdeposits-deposited":
    case "microdeposits-initialized":
      if(customer_status == "verified"){
        onboardingPercentage = 80;
      }
      if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-documentFailed" || customer_status == "kyc-suspended"){
        onboardingPercentage = 65;
      }
      if(customer_status == "kyc-documentRecieved"){
        onboardingPercentage = 70;
      }
      if(customer_status == "kyc-documentProcessing"){
        onboardingPercentage = 75;
      }
      if(customer_status == "unverified"){
        onboardingPercentage = 55;
      }
      break;
    case "microdeposits-failed":
      if(customer_status == "verified"){
        onboardingPercentage = 75;
      }
      if(customer_status == "kyc-retry" || customer_status == "kyc-document" || customer_status == "kyc-documentFailed" || customer_status == "kyc-suspended"){
        onboardingPercentage = 65;
      }
      if(customer_status == "kyc-documentRecieved"){
        onboardingPercentage = 70;
      }
      if(customer_status == "kyc-documentProcessing"){
        onboardingPercentage = 75;
      }
      if(customer_status == "unverified"){
        onboardingPercentage = 50;
      }
      break;
    case "need-kyc":
      onboardingPercentage = 70;
      break;
    case "kyc-retry":
    case "kyc-suspended":
    case "kyc-documentNeeded":
      onboardingPercentage = 75;
      break;
    case "kyc-documentReceived":
      onboardingPercentage = 80;
      break;
    case "kyc-documentProcessing":
      onboardingPercentage = 85;
      break;
    case "kyc-documentFailed":
      onboardingPercentage = 75;
      break;
    default:
  }

  return onboardingPercentage
}

module.exports = getOnboardingPercentage
