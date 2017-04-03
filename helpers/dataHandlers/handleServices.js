function handleServices(data, cb) {
  if (!data) return []

  let formattedServices = {
    rows: []
  }

  for (var cat in data) {
    for (var k in data[cat]) {
      let service = {category: data[cat].displayName, title: data[cat][k].displayName}
      formattedServices.rows.push(service)
    }
  }

  cb(formattedServices)
}

module.exports = handleServices
