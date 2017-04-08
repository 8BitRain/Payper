function handleWantsAndOwns(wants, owns, cb) {
  console.log('--> handleWantsAndOwns was invoked')
  console.log('--> wants', wants)
  console.log('--> owns', owns)

  let formattedWants = {}
  let formattedOwns = {}

  // // Format wants
  // if (response.wantedTags) {
  //   console.log("--> Formatting wants...")
  //   let wantedTagsBuffer = response.wantedTags.split(",")
  //   for (var i in wantedTagsBuffer) {
  //     let service = servicesMap[wantedTagsBuffer[i]]
  //     wants[service.title] = true
  //   }
  // }
  //
  // // Format owns
  // if (response.ownedTags) {
  //   let ownedTagsBuffer = response.ownedTags.split(",")
  //   for (var i in ownedTagsBuffer) {
  //     let service = servicesMap[ownedTagsBuffer[i]]
  //     owns[service.title] = true
  //   }
  // }

  cb(formattedWants, formattedOwns)
}

exports.handleWantsAndOwns = handleWantsAndOwns
