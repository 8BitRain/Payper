function formatUpdateUserTagsParams(wantsAndOwns) {
  let wantString = ""
  let ownString = ""

  // Populate comma delimited strings
  for (var section in wantsAndOwns) {
    for (var service in wantsAndOwns[section]) {
      if (true === wantsAndOwns[section][service]) {
        service = service.toLowerCase().replace(' ', '')
        if (section === "wants") wantString = wantString.concat(service).concat(",")
        if (section === "owns") ownString = ownString.concat(service).concat(",")
      }
    }
  }

  // Remove trailing commas
  if (wantString !== "") wantString = wantString.substring(0, wantString.length - 1)
  if (ownString !== "") ownString = ownString.substring(0, ownString.length - 1)

  return {wantString, ownString}
}

module.exports = formatUpdateUserTagsParams
