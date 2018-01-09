var express = require('express');
var router = express.Router();

/* hardcoded customer info */
var user = {
  name: 'Kenneth Thompson',
  addresses: ['8114 Grow Drive #9, Cape Neddick, ME 03902'],
  cards: ['BANK OF AMERICA CHECKING x-5567', 'Visa x-4512'],
  total: 28.98
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayPal Checkout' });
});

/* test JSON sending */
router.get('/json', function(req, res, next) {
  res.jsonp({ message: 'JSON received' });
});

/* send customer info */
router.get('/pay', function(req, res, next) {
  res.jsonp(user);
});

module.exports = router;
