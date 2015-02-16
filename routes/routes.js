var express = require("express");
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;
var request = require('request');

exports.setup = function() {
    var router = express.Router();

    router.all('/dashboard', ensureAuthenticated('/login'));
    router.all('/dashboard/*', ensureAuthenticated('/login'));
    router.all('/code/add', ensureAuthenticated('/login'));

    router.get('/', function(req, res, next) { //index route
        res.render('index', {
            title: ""
        });
    });
    router.get('/:owner/:project', function(req, res, next) { //index route
        var options = {
            url: 'https://api.github.com/repos/'+req.params.owner+'/'+req.params.project+'/readme',
            headers: {
                'User-Agent': 'request'
            }
        };
        request(options, function(error, response, body) {
            console.log(req.params.owner);
            console.log(req.params.project);
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info);
                //res.send(info);
                res.render('projects', {
                    title: req.params.project
                });
            } else {
                console.log("error: "+ error);
                console.log("responseCode: " + response.statusCode);
                res.send(error);
            }
        });
    });

    return router;
};