var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile('./data/stad.json', (err, data) => {
    if (err) {}
    var stad = JSON.parse(data);
    res.send(stad);
  })
});


router.post('/', function (req, res) {
  console.log('Request!!')
  fs.readFile('./data/stad.json', (err, data) => {
    let city = JSON.parse(data)
    const incomingData = req.body;
    console.log(incomingData);
    city.push(incomingData);
    fs.writeFile('./data/stad.json', JSON.stringify(city, null, 2), (err) => {
      if (err) throw err;
    })
  })
  res.end()
});

module.exports = router;