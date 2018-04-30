function formatLocation(longitude, latitude) {
  return {
    longitude: longitude.toString(),
    latitude: latitude.toString()
  }
}

module.exports = formatLocation
