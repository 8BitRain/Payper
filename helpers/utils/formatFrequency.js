function formatFrequency(str) {
  let frequency

  switch(str) {
    case "WEEKLY": frequency = "week"; break;
    case "MONTHLY": frequency = "month"; break;
    case "ONCE": frequency = "once"; break;
    default: frequency = "undefined";
  }

  return frequency
}

module.exports = formatFrequency
