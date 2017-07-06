const moment = require('moment')

module.exports = {
  parse(text) {
    const lines = text.trim().split('\n')
    let context = null
    const entities = lines.reduce((acc, line) => {
      line = line.trim()
      if (line === 'BEGIN:VEVENT') {
        context = {}
      } else if (line.startsWith('DTSTART')) {
        context.start = moment(line.split(':')[1])
      } else if (line.startsWith('DTEND')) {
        context.end = moment(line.split(':')[1])
      } else if (line.startsWith('SUMMARY')) {
        context.project = line.split(':')[1]
      } else if (line.startsWith('DESCRIPTION')) {
        context.description = line.split(':')[1]
      } else if (line === 'END:VEVENT') {
        const {
          start,
          end,
          description,
          project,
        } = context
        acc.push({
          duration: moment.duration(end.diff(start)).asHours(),
          description,
          project,
          year: start.year(),
          month: start.month(),
          day: start.date(),
        })
      }
      return acc
    }, [])
    return entities
  }
}
