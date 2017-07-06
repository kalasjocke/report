const moment = require('moment')

const { transform } = require('./transform')

expect.extend({
  toBeSameMoment(received, argument) {
    const pass = received.isSame(argument);
    if (pass) {
      return {
        message: () => (
          `expected ${received} to not to be same moment as ${argument}`
        ),
        pass: true,
      };
    } else {
      return {
        message: () => (`expected ${received} to be same moment as ${argument}`),
        pass: false,
      };
    }
  },
});


describe('transform', () => {
  describe('#transform', () => {
    test('throws if end date is before start date', () => {
      expect(() => {
        transform(moment.utc('2017-01-02'), moment.utc('2017-01-01'), [])
      }).toThrow()
    })

    test('throws if start or end date is invalid', () => {
      expect(() => {
        transform(moment.utc('2017-01-01'), moment.utc('2017-01-50'), [])
      }).toThrow()
    })

    test('transforms no entries between start and end', () => {
      const transformed = transform(moment.utc('2017-01-01'), moment.utc('2017-01-03'), [])

      expect(transformed[0].date).toBeSameMoment(moment.utc('2017-01-01'))
      expect(transformed[1].date).toBeSameMoment(moment.utc('2017-01-02'))
      expect(transformed[2].date).toBeSameMoment(moment.utc('2017-01-03'))
    })

    test('transforms entries between start and end', () => {
      const transformed = transform(moment.utc('2017-01-01'), moment.utc('2017-01-03'), [
        {
          description: 'Work',
          duration: 1,
          project: '#otherco',
          year: 2017,
          month: 0,
          day: 2,
        }, {
          description: 'More stuff',
          duration: 0.5,
          project: '#newco',
          year: 2017,
          month: 0,
          day: 1,
        }, {
          description: 'Doing stuff',
          duration: 1,
          project: '#newco',
          year: 2017,
          month: 0,
          day: 1,
        },
      ])

      expect(transformed).toEqual([
        {
          date: expect.any(Object),
          projects: {
            '#newco': { descriptions: ['Doing stuff', 'More stuff'], duration: 1.5 },
          },
        },
        {
          date: expect.any(Object),
          projects: {
            '#otherco': { descriptions: ['Work'], duration: 1 },
          },
        },
        {
          date: expect.any(Object),
          projects: {},
        },
      ])
      expect(transformed[0].date).toBeSameMoment(moment.utc('2017-01-01'))
      expect(transformed[1].date).toBeSameMoment(moment.utc('2017-01-02'))
      expect(transformed[2].date).toBeSameMoment(moment.utc('2017-01-03'))
    })

    test('does not transform out of range entries', () => {
      const transformed = transform(moment.utc('2017-01-02'), moment.utc('2017-01-03'), [
        {
          description: 'Doing stuff',
          duration: 1,
          project: '#newco',
          year: 2017,
          month: 0,
          day: 1,
        }, {
          description: 'More stuff',
          duration: 0.5,
          project: '#newco',
          year: 2017,
          month: 0,
          day: 4,
        }, {
          description: 'Work',
          duration: 1,
          project: '#otherco',
          year: 2017,
          month: 0,
          day: 5,
        },
      ])

      expect(transformed).toEqual([
        {
          date: expect.any(Object),
          projects: {}
        },
        {
          date: expect.any(Object),
          projects: {},
        },
      ])
      expect(transformed[0].date).toBeSameMoment(moment.utc('2017-01-02'))
      expect(transformed[1].date).toBeSameMoment(moment.utc('2017-01-03'))
    })
  })
})
