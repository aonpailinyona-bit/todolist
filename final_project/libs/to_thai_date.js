const DateLib = {
  to_thai: (date_input) => {
    const date = new Date(date_input)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

module.exports = DateLib