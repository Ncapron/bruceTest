const config    = require('config');
const mongoose  = require('mongoose');
const async     = require('async');
const jobModel  = require('models/job');
const searchModel  = require('models/search');
const paginate  = require('paginate/paginate');
const request   = require('request');
const checkForm = require('helpers/checkForm');
const _ = require('lodash');

const controller = {
    index: function (req, res) {
        async.waterfall([
            function getElements(callback) {
                const page = req.query.page;
                const limit = req.query.limit;
                const query = {};
                if (req.query.userSearch) {
                    const searchRegex = new RegExp('\\b' + req.query.userSearch + '.*', 'i');
                    query.title = {$regex: searchRegex};
                }
                jobModel.paginate(query, {page: page, limit: limit, sort: {created_at: -1}}, function (err, jobs) {
                    if (err) {
                        return callback(err);
                    }
                    const data = {
                        userSearch: req.body.userSearch,
                        items: jobs.docs,
                        pageCount: jobs.pages,
                        itemCount: jobs.limit,
                        currentPage: jobs.page,
                        total: jobs.total,
                        pages: paginate.getArrayPages(req)(5, jobs.pages, req.query.page)
                    };

                    return callback(null, data);
                });
            },
            function checkData(data, callback){
                const userSearch = req.query.userSearch;
                if (!userSearch) {
                    return callback(null, data);
                } else if (userSearch && data.total == 0) {
                    controller.learn(data, userSearch, callback);
                } else {
                    controller.search(data, userSearch, callback);
                }
            }
        ], function (err, data) {
            return res.render('index.twig', data);
        });
    },
    learn: function(data, userSearch, callback){
        searchModel.findOne({userSearch: userSearch}, function(err, search){
            if (err) {
                return callback(err);
            } else if (search == null || _.isEmpty(search)) {
                let Store = {
                    userSearch : userSearch,
                };
                searchModel.create(Store, function(err){
                    return callback(err, data);
                });
            } else {
                let count = search.count + 1;
                searchModel.update({userSearch: userSearch}, {count: count}, function(err){
                    return callback(err, data);
                });
            }
        });
    },
    search: function(data, userSearch, callback) {
        let Store = {
            userSearch : userSearch,
            matches : data.items
        };
        searchModel.create(Store, function(err, search){
            data.searchId = search._id;
            return callback(err, data, search);
        });
    },
    view: function(req, res) {
        async.waterfall([
            function getIds(callback){
                jobModel.findOne({_id: req.params.id}, function(err, job) {
                    if (err) {
                        return callback(err);
                    }
                    searchModel.update({_id: req.params.searchId}, {chosen: job.title}, function(err){
                        return callback(err);
                    });
                });
            }
        ], function(err){
            return res.redirect('/');
        });
    }
};

module.exports = controller;
