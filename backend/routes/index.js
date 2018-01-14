var express = require('express');
var router = express.Router();

/* SHA-2 hash "tokens" for users */
const users = {
  user1: '0A041B9462CAA4A31BAC3567E0B6E6FD9100787DB2AB433D96F6D178CABFCE90',
  user2: '6025D18FE48ABD45168528F18A82E265DD98D421A7084AA09F61B341703901A3'
};

const userInfo1 = {
  name: 'Kenneth Thompson',
  addresses: ['8114 Grow Drive #9, Cape Neddick, ME 03902'],
  cards: ['BANK OF AMERICA CHECKING x-5567', 'Visa x-4512']
};

const userInfo2 = {
  name: 'Mitsuha Miyamizu',
  addresses: ['Itomori, Gifu Prefecture, Japan', 'Tokyo, Japan'],
  cards: ['MasterCard x-0123', 'American Express x-3456', 'Discover x-6789']
};

const database = {};
database[users.user1] = userInfo1;
database[users.user2] = userInfo2;

/* Send customer info */
router.get('/:userId', function(req, res, next) {
  res.jsonp(database[req.params.userId]);
});

module.exports = router;
