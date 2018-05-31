const paginate = require('express-paginate');

paginate.middleware = function middleware(limit, maxLimit) {

    let _limit = (typeof limit === 'number') ? parseInt(limit, 10) : 10;
    let _maxLimit = (typeof maxLimit === 'number') ? parseInt(maxLimit, 10) : 50;

    return function _middleware(req, res, next) {

        req.query.page = (typeof req.query.page === 'string') ? parseInt(req.query.page, 10) || 1 : 1;
        req.query.limit = (typeof req.query.limit === 'string') ? parseInt(req.query.limit, 10) || 0 : _limit;

        if (req.query.limit > _maxLimit)
            req.query.limit = _maxLimit;

        if (req.query.page < 1)
            req.query.page = 1;

        if (req.query.limit < 0)
            req.query.limit = 0;

        if (!req.query.sortField)
            req.query.sortField = "_id";

        if (!req.query.sortDirection)
            req.query.sortDirection = 1;

        let sort = {};
        sort[req.query.sortField] = req.query.sortDirection;

        req.sort = sort;
        req.skip = req.offset = (req.query.page * req.query.limit) - req.query.limit;

        res.locals.paginate = {};
        res.locals.paginate.page = req.query.page;
        res.locals.paginate.limit = req.query.limit;
        res.locals.paginate.sort = req.query.sortField;
        res.locals.paginate.href = paginate.href(req);
        res.locals.paginate.hasPreviousPages = req.query.page > 1;
        res.locals.paginate.hasNextPages = paginate.hasNextPages(req);
        res.locals.paginate.getArrayPages = paginate.getArrayPages(req);
        res.locals.paginate.getLastPage = "test";

        next();

    };

};


module.exports = paginate;
