const express = require('express')
const app = express()
const items = require('./db/items')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/item/:code', (req, res) => {
  const item = items.find(({ id }) => id == req.params.code)
  if (item) {
    res.json(item)
  } else {
    res.status(400).json({
      error: 'No such item'
    })
  }
})

const payments = {
}

app.post('/payment/', (req, res) => {
  const {
    items,
    phonenumber
  } = req.body

  console.log(req.body);

  const key = Date.now()

  while (payments[key] !== undefined) key++

  payments[key] = req.body

  res.json({ paymentId: key })
})

app.get('/payment/:id', (req, res) => {
  if (!payments[req.params.id]) {
    res.status(404).end()
    return
  }

  const { items, phonenumber, } = payments[req.params.id]

  const total = items
    .map(({ price }) => price)
    .reduce((sum, x) => sum + x, 0)

  console.log('items', items)

  const response =
    `<!doctype html>
<head><meta charset="utf8" /><meta name="viewport" content="width=device-width, initial-scale=1">
<body>
Välkommen till Butiken.<br>
<br>
Att betala är ${(total / 100).toFixed(2)}:-<br>
<br>
<a href='swish://paymentrequest'><img src="https://www.swish.nu/img/swish-logotype.82ec35e3.svg" height="57px"></a>

`
  console.log(response)

  res.send(response)
})

module.exports = app
