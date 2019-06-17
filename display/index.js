'use strict';

const express = require('express')
const app = express()
const port = 3000

app.all('/', (req, res) => res.json(process.env))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
