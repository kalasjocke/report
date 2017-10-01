const moment = require('moment')
const program = require('commander')
const fetch = require('node-fetch')
const Table = require('easy-table')

const { transform } = require('./transform')
const { parse } = require('./parse')

function main() {
  program
    .version('0.1.0')
    .usage('[options]')
    .option('-c --calendar <uri>', 'URI to ics file')
    .option('-s, --since <date>', 'Show entries more recent than specific date.', moment)
    .option('-u, --until <date>', 'Show entries older than specific date.', moment)
    .parse(process.argv)

  if (program.calendar && program.since && program.until) {
    const totals = {}
    const table = new Table
    fetch(program.calendar).then(res => {
      res.text().then(data => {
        const entries = parse(data)
        const transformed = transform(program.since, program.until, entries)
        transformed.forEach(day => {
          if (Object.keys(day.projects).length > 0) {
            Object.keys(day.projects).forEach(projectName => {
              const project = day.projects[projectName]
              table.cell('Date', day.date.format('YYYY-MM-DD'))
              table.cell('Project', projectName)
              table.cell('Duration', project.duration + 'h')
              table.cell('Description', project.descriptions.filter(d => d.trim() !== '').join(', '))
              table.newRow()

              if (!totals[projectName]) {
                totals[projectName] = 0
              }
              totals[projectName] += project.duration
            })
          } else {
            table.cell('Date', day.date.format('YYYY-MM-DD'))
            table.newRow()
          }
        })
        console.log(table.toString())
        console.log(totals)
      })
    })
  } else {
    program.help()
  }
}

process.on('unhandledRejection', error => console.log(error))

main()
