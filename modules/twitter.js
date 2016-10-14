/**
 * Everything to do with Twitter API
 */

var https = require('https');
var btoa = require('btoa');
var querystring = require('querystring');

var hostName = 'api.twitter.com';
var apiEndPoint = 'https://api.twitter.com';
var apiVersion = '/1.1';
var tokenRequest = '/oauth2/token';
var rateLimit = '/application/rate_limit_status.json?resources=search,application';
var search = '/search/tweets.json';
/**
 * searchTweets
 * @param req
 * @param res
 * @param token
 */
function searchTweets(req, res, token) {
    var body = [];

}

function getRateLimit(req, res, token) {
    var body = [];

    var options = {
        hostname: hostName,
        path: apiVersion + rateLimit,
        method: 'Get',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    console.log(options);

    twitterReq = https.request(options, function(twitterRes) {

        twitterRes.on('data', function(chunk) {
           body.push(chunk);
        });

        twitterRes.on('end', function() {
            var results = JSON.parse(body.join(''));

            res.send(results);
        });

        twitterRes.on('error', function(e) {
            console.log(e);
            res.send(e);
        })

    });

    twitterReq.end();

}

function searchTweetsPromise(req, res, token, hashTags) {
    var body = [];
    var path = search;
    hashTags.forEach(function(tag) {
        path = path + tag;
    });

    console.log(path);

    path = encodeURIComponent(path);

    console.log(path);

    var options = {
        hostname: hostName,
        path: path,
        method: 'Get'
    }
}

/**
 * requestAccessToken
 * Obtains an access token object using application oauth.
 * @param req
 * @param res
 */
function requestAccessToken(req, res) {

    var body = [];
    var bearerTokenCredentials = process.env.CONSUMER_KEY + ':' + process.env.CONSUMER_SECRET;
    var bearerTokenCredentials64 = btoa(bearerTokenCredentials);
    var postData = querystring.stringify({
       'grant_type': 'client_credentials'
    });

    var options = {
        hostname: hostName,
        path: tokenRequest,
        method: 'Post',
        auth: bearerTokenCredentials,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    twitterReq = https.request(options, function(twitterRes) {
        twitterRes.on('data', function(chunk) {
            body.push(chunk);
        });

        twitterRes.on('end', function() {
            var results = JSON.parse(body.join(''));

            console.log(results);

            res.send(results);
        });

        twitterRes.on('error', function(error) {
            console.log('error');
            res.send('error');
        })

    });

    twitterReq.write(postData);
    twitterReq.end();
}

function requestAccessTokenPromise(req, res) {

    var body = [];
    var bearerTokenCredentials = process.env.CONSUMER_KEY + ':' + process.env.CONSUMER_SECRET;
    var bearerTokenCredentials64 = btoa(bearerTokenCredentials);
    var postData = querystring.stringify({
        'grant_type': 'client_credentials'
    });

    var options = {
        hostname: hostName,
        path: tokenRequest,
        method: 'Post',
        auth: bearerTokenCredentials,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise(function(resolve, reject) {
        twitterReq = https.request(options, function(twitterRes) {
            twitterRes.on('data', function(chunk) {
                body.push(chunk);
            });

            twitterRes.on('end', function() {
                var results = JSON.parse(body.join(''));
                console.log(results);
                resolve(results);
            });

            twitterRes.on('error', function(error) {
                console.log('error');
                reject(error);
            })

        });

        twitterReq.write(postData);
        twitterReq.end();
    });

}


module.exports = {
    "requestAccessToken": requestAccessToken,
    "requestAccessTokenPromise": requestAccessTokenPromise,
    "getRateLimit": getRateLimit
};