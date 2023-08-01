import express from 'express'
import fs from 'node:fs'
import pg from 'pg'

const db = new pg.Client({
  host: 'db',
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
})

await db.connect()
await db.query('CREATE TABLE IF NOT EXISTS visits (date timestamptz NOT NULL DEFAULT NOW())')


const LOG_FILE = process.env.LOG_FILE || 'log.txt'

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
  await db.query('INSERT INTO visits VALUES (NOW())')
  res.send('Hello World! I am a Node.js app running on Docker!')
  writeLog('GET /')
})

app.get('/log/lines', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', function (err, data) {
    if (err) {
      console.log(err)
      res.status(500).send('Error reading log file')
    } else {
      const lines = data.split('\n')
      res.send({ lines: lines.length })
    }
  })
})

app.get('/log/lines/:line', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', function (err, data) {
    if (err) {
      console.log(err)
      res.status(500).send('Error reading log file')
    } else {
      const lines = data.split('\n')
      if (req.params.line > lines.length) {
        res.status(404).send('Line not found')
        return
      }
      
      const line = lines[req.params.line - 1]
      res.send({ line })
    }
  })
})

app.get('/visits', async (req, res) => {
  const last = await db.query('SELECT date FROM visits ORDER BY date DESC LIMIT 1')
  const count = await db.query('SELECT COUNT(*) FROM visits')
  res.send({ last: last.rows[0].date, count: count.rows[0].count })
})


app.listen(3000, () => {
  console.log('App listening on port 3000!')
})


function writeLog(text) {
  fs.appendFile(LOG_FILE, `[${new Date().toISOString()}] ${text}\n`, function (err) {
    if (err) {
      console.log(err)
    }
  })
}
