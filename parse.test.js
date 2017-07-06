const { parse } = require('./parse')
const fixtures = require('./fixtures')

describe('parse', () => {
  test('parses ics event into a list of a single entity', () => {
    const entities = parse(fixtures.single)
    expect(entities).toEqual([{
      description: 'Work work',
      duration: 1,
      project: '#newco',
      year: 2017,
      month: 5,
      day: 11,
    }])
  })

  test('parses multiple events into list of entries', () => {
    const entities = parse(fixtures.multiple)
    expect(entities).toEqual([{
      description: 'Working some more',
      duration: 1,
      project: '#newco',
      year: 2017,
      month: 5,
      day: 11,
    }, {
      description: 'Working, again',
      duration: 0.5,
      project: '#newco',
      year: 2017,
      month: 5,
      day: 11,
    }, {
      description: 'Working on stuff',
      duration: 0.25,
      project: '#newco',
      year: 2017,
      month: 5,
      day: 11,
    }])
  })
})
