function handleServices(data, cb) {
  if (!data) return []

  let formattedServices = {
    rows: []
  }

  for (var cat in data) {
    let catDisplayName = data[cat].displayName
    formattedServices[catDisplayName] = []

    for (var k in data[cat]) {
      if (!data[cat][k].displayName) continue
      let service = {category: data[cat].displayName, title: data[cat][k].displayName}
      formattedServices[catDisplayName].push(service)
    }
  }

  cb(formattedServices)
}

module.exports = handleServices
