var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var twitter = require('../modules/twitter.js');

/* For testing. */
router.get('/', function(req, res, next) {

    twitter.rateLimitRequest(req, res);



});

module.exports = router;

