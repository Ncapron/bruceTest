const config    = require('config');
const async     = require('async');
const jobModel  = require('models/job');
const searchModel  = require('models/search');
const request   = require('request');
const checkForm = require('helpers/checkForm');
const _ = require('lodash');

const controller = {
    index: function (req, res) {
        return res.render('index.twig');
    },
    api: function(req, res) {
        async.waterfall([
            function getData(callback){
                jobModel.find({}, function(err, data){
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, data);
                });
            }
        ], function(err, data){
            if (err) {
                console.log(err);
            }
            return res.json(data);
        });
    },
    check: function(req, res) {
        async.waterfall([
            function getApi(callback){
                request('http://localhost:1606/api', function (error, response, body) {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, JSON.parse(body));
                });
            },
            function checkData(jobs, callback){
                checkForm.pourcent(req.body, jobs, callback);
            }
        ], function(err, results){
            if (err) {
                console.log('err', err);
            } else if (_.isEmpty(results)) {
                return res.redirect('/learn?userSearch='+req.body.userSearch);
            } else {
                return res.redirect('/search?userSearch='+req.body.userSearch+'&results='+results);
            }
        });
    },
    search: function(req, res) {
        const ids = req.query.results ? req.query.results.split(',') : [];
        async.waterfall([
            function getIds(callback){
                jobModel.find({ id: { $in: ids }}).exec(function (err, jobs) {
                    return callback(null, jobs, ids);
                });
            },
            function storeMatches(jobs, ids, callback){
                let Store = {
                    userSearch : req.query.userSearch,
                    matches : ids
                };
                searchModel.create(Store, function(err, data){
                    return callback(err, jobs, data._id);
                });
            }
        ], function(err, jobs, id){
            if (err) {
                console.log(err);
            }
            return res.render('find.twig', {jobs:jobs, searchId: id});
        });
    },
    learn: function(req, res) {
        async.waterfall([
            function storeMatches(callback){
                searchModel.findOne({userSearch: req.query.userSearch}, function(err, data){
                    if (err) {
                        console.log('a');
                        return callback(err);
                    } else if (data == null || _.isEmpty(data)) {
                        let Store = {
                            userSearch : req.query.userSearch,
                        };
                        searchModel.create(Store, function(err){
                            return callback(err);
                        });
                    } else {
                        let count = data.count + 1;
                        searchModel.update({userSearch: req.query.userSearch}, {count: count}, function(err){
                            return callback(err);
                        });    
                    }
                });
            }
        ], function(err){
            return res.render('find.twig');
        });
    },
    view: function(req, res) {
        console.log(req.params);
        async.waterfall([
            function getIds(callback){
                searchModel.findOneAndUpdate({_id: req.params.searchId}, {$set:{chosen : req.params.jobId}} , function(err){
                    return callback(err);
                });
            }
        ], function(err){
            return res.redirect('/');
        });
    }
};

module.exports = controller;
