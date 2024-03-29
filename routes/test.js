var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var twitter = require('../modules/twitter.js');
var btoa = require('btoa');
var sentiment = require('sentiment');

/* For testing. */
router.get('/', function(req, res, next) {

    var tokenRequest = twitter.requestAccessTokenPromise(req, res);

    tokenRequest.then(function(result) {

        var token = result.access_token;

        twitter.getRateLimit(req, res, token);


    }).catch(function(error) {
        res.send(error);
    });

});


router.get('/search', function(req, res, next) {

    var hashTags = ['#trump'];

    var tokenRequest = twitter.requestAccessTokenPromise(req, res);

    tokenRequest.then(function(result) {

        var token = result.access_token;

        var searchTweetsRequest = twitter.searchTweets(req, res, token, hashTags);
        // console.log(token);
        searchTweetsRequest.then(function(result) {

            var tweets = [];
            var analysis = [];

            result.statuses.forEach(function(status) {
               tweets.push(status.text);
            });


            tweets.forEach(function(tweet) {
               analysis.push(sentiment(tweet));
            });
            // tweets.forEach(function(tweet) {
            //    var sentimentObj = sentiment(tweet);
            //     sentiment.push(sentimentObj);
            // });
            // console.log(tweets);
            console.log(analysis);
            // console.log(result);
            // process tweets object

            res.send(result);
        }).catch(function(error) {
            res.send(error);
        });

    }).catch(function(error) {
        res.send(error);
    });



});

/**
 * Route for testing the load on web server
 *
 */
router.get('/sentiment', function(req, res, next) {

    var text = 'the quick brown fox jumped over the lazy dog';

    body = [];

    for (var i = 0; i < 100; i++) {
        var result = sentiment(text);
        body.push(result);
    }

    res.send(body);

});

router.get('/rateLimit', function(req, res, next) {

    var testToken = 'AAAAAAAAAAAAAAAAAAAAAMaDwgAAAAAAAxq3sFycKxpV1kdNqAn2e20o%2BTc%3DAIi849jeQgOVMpRDZxIBngWb6iyI4gT7pcOOu8LWyVbQbgEKn1';
    twitter.getRateLimit(req, res, testToken);

});

module.exports = router;

