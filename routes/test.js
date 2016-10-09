var express = require('express');
var router = express.Router();

/* For testing. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Test' });
});

module.exports = router;

