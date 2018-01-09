var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayPal Checkout' });
});

/* test JSON sending */
router.get('/json', function(req, res, next) {
  res.jsonp({ message: 'JSON received' });
});

module.exports = router;
