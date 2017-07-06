_ = require('lodash')

module.exports = {
  transform(start, end, entries) {
    if (end.isBefore(start)) {
      throw new Error('End date is before start date')
    }
    if (!start.isValid()) {
      throw new Error('Start date is invalid', start)
    }
    if (!end.isValid()) {
      throw new Error('End date is invalid', start)
    }

    // { 2017: { 1: { 1: { '#newco': [] } } } }
    const lookup = entries.reduce((acc, entry) => {
      const path = [entry.year, entry.month, entry.day, entry.project]
      const _entries = _.get(acc, path, [])
      _entries.push(entry)
      return _.setWith(acc, path, _entries, Object)
    }, {})

    const output = []
    endInclusive = end.clone().add(1, 'days')
    next = start;
    while (!next.isSame(endInclusive, 'days')) {
      const path = [next.year(), next.month(), next.date()]
      _entries = _.get(lookup, path, [])
      const projects = _.mapValues(_entries, (value, key) => ({
        descriptions: value.map(entry => entry.description).reverse(),
        duration: value.reduce((acc, entry) => acc + entry.duration, 0),
      }))
      output.push({
        date: next.clone(),
        projects,
      })
      next.add(1, 'days')
    }

    return output
  }
}
