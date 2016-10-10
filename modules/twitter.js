/**
 * Everything to do with Twitter API
 */

var https = require('https');
var btoa = require('btoa');
var querystring = require('querystring');
var hostName = 'api.twitter.com';
var apiEndPoint = 'https://api.twitter.com';
var apiVersion = '1.1';
var requestRateLimit = '/' + apiVersion + '/application/rate_limit_status.json';
var tokenRequest = '/oauth2/token';

function requestAccessToken(req, res) {

    // Post
    // body of request grant_type=client_credentials
    // application/x-www-form-urlencoded

    var body = [];
    var bearerTokenCredentials = process.env.CONSUMER_KEY + ':' + process.env.CONSUMER_SECRET;
    var bearerTokenCredentials64 = btoa(bearerTokenCredentials);
    var postData = querystring.stringify({
       'grant_type': 'client_credentials'
    });
    console.log(bearerTokenCredentials);
    console.log(bearerTokenCredentials64);
    console.log(postData);
    console.log(Buffer.byteLength(postData));

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

module.exports = {
  'rateLimitRequest': requestAccessToken
};