const {
  parse,
} = require('./parse')

describe('parse', () => {
  test('parses ics event into a list of a single entity', () => {
    const data = `
BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Wrk wrk wrk
X-WR-TIMEZONE:Europe/Stockholm
X-WR-CALDESC:
BEGIN:VEVENT
DTSTART:20170611T120000Z
DTEND:20170611T130000Z
DTSTAMP:20170611T151519Z
UID:foo@google.com
CREATED:20170611T145752Z
DESCRIPTION:Work work
LAST-MODIFIED:20170611T151201Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:#newco
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR
`
    const entities = parse(data)
    expect(entities).toEqual([{
      description: 'Work work',
      duration: 1,
      project: '#newco',
      year: 2017,
      month: 5,
      day: 11,
    }])
  })
})
