var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile('./data/land.json', (err, data) => {
    if (err) throw err;
    let land = JSON.parse(data);
    res.send(land);
  })
});

// Inkommande data
router.post('/', function (req, res) {
  console.log('Request!!');
  fs.readFile('./data/land.json', (err, data) => {
    let land = JSON.parse(data);
    const incomingData = req.body;
    console.log(incomingData);
    land.push(incomingData);
    fs.writeFile('./data/land.json', JSON.stringify(land, null, 2), (err) => {
      if (err) throw err;
    })
  })
  res.sendStatus(200);
});

module.exports = router;
