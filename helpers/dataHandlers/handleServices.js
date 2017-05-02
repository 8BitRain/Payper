function handleServices(data, cb) {
  if (!data) return []

  let formattedServices = {}
  let servicesMap = {}

  for (var cat in data) {
    let catDisplayName = data[cat].displayName
    formattedServices[catDisplayName] = []

    for (var k in data[cat]) {
      if (!data[cat][k].displayName) continue

      // Get rid of hashtag
      let {tag} = data[cat][k]
      if (tag.indexOf('#') >= 0) tag = tag.replace('#', '')

      // Format service JSON
      let service = {
        category: data[cat].displayName,
        title: data[cat][k].displayName,
        tag: tag
      }

      formattedServices[catDisplayName].push(service)
      servicesMap[tag] = service
    }
  }

  cb(formattedServices, servicesMap)
}

module.exports = handleServices
