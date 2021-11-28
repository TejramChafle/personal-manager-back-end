
const handler = require('../helper/handler');
const Expenditures = require('../models/Expenditures');
const Payments = require('../models/Payments');
const paymentCtrl = require('../controller/paymentCtrl');
const purchasesCtrl = require('../controller/purchasesCtrl');

const _Ctrl = function (Model) {
    // Get the single record from document
    const filter = function (req, resp, next) {
        Model.findById(req.params.id).populate(
            {
                path: 'expenditure', populate: { path: 'payment', model: 'Payments' }
            }).exec().then(purchase => {
                return resp.status(200).json(purchase);
            }).catch(error => {
                errorHandler(error, req, resp, next);
            });
    }

    // DELETE (Hard delete. This will delete the entire detail. Only application admin should be allowed to perform this action )
    const remove = (req, resp, next) => {
        Model.findByIdAndRemove(req.params.id).exec().then(purchase => {
            return resp.status(200).json(purchase);
        }).catch(error => {
            errorHandler(error, req, resp, next);
        });
    };

    // GET with pagination
    const get = (req, resp, next) => {
        // console.log('req.query', req.query);
        let filter = {};
        filter.isActive = req.query.isActive || true;
        if (req.query.place) filter.place = new RegExp('.*' + req.query.place + '.*', 'i');
        if (req.query.date) filter.date = req.query.date;
        if (req.query.createdBy) filter.createdBy = req.query.createdBy;

        let populate;
        if (Model === Expenditures) {
            filter.payment = { $exists: true, $ne: null };
            populate = { path: 'payment', match: {} };
        }

        Model.paginate(filter, {
            sort: { createdDate: req.query.sortOrder },
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit),
            populate: populate
        }, (error, result) => {
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            // console.log('result', result);
            if (error) {
                errorHandler(error, req, resp, next);
            }
            return resp.status(200).json(result);
        });
    };

    const post = (req, resp, next) => {
        console.log(req.body);
        // const payinfo = req.body.payment;
        const medadata = {
            createdBy: req.body.createdBy,
            createdDate: new Date(),
            updatedDate: new Date()
        }

        if (Model === Expenditures) {
            return paymentPost(medadata, req, resp, next);
        } else if (Model === Billing) {
            return purchasesPost(medadata, req, resp, next);
        }
    };

    const update = (req, resp, next) => {
        console.log('#UPDATE:', req.body);
        // const payinfo = req.body.payment;
        const medadata = {
            updatedBy: req.body.updatedBy,
            createdBy: req.body.createdBy,
            createdDate: req.body.createdDate,
            updatedDate: new Date()
        }

        if (Model === Expenditures) {
            return paymentPut(medadata, req, resp, next);
        } else if (Model === Billing) {
            return purchasesPost(medadata, req, resp, next);
        }
    };

    return {
        filter: filter,
        remove: remove,
        get: get,
        post: post,
        update: update
    };
}

module.exports = _Ctrl;