var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.redirect('auth')
});

router.get('/home', function(req, res, next) {
  res.redirect('auth')
});

module.exports = router;
