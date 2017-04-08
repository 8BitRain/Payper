function handleWantsAndOwns(params, cb) {
  let {wants, owns, servicesMap} = params
  let formattedWants = {}
  let formattedOwns = {}

  if (wants) {
    let wantedTagsBuffer = wants.split(",")
    for (var i in wantedTagsBuffer) {
      let service = servicesMap[wantedTagsBuffer[i]]
      if (!service) continue
      formattedWants[service.title] = true
    }
  }

  if (owns) {
    let ownedTagsBuffer = owns.split(",")
    for (var i in ownedTagsBuffer) {
      let service = servicesMap[ownedTagsBuffer[i]]
      if (!service) continue
      formattedOwns[service.title] = true
    }
  }

  cb(formattedWants, formattedOwns)
}

module.exports = handleWantsAndOwns
