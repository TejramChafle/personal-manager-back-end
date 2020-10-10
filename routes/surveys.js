var express     = require('express');
var mongoose    = require('mongoose');
var Survey     = require('../models/Survey');
const auth      = require('../auth');

var router      = express.Router();


// GET SURVEYS (default active) WITH filter, sorting & pagination
router.get('/', auth, (req, resp) => {

    let filter = {};
    filter.is_active = req.query.is_active || true;
    if (req.query.firstname) filter.firstname = new RegExp('.*' + req.query.firstname + '.*', 'i');
    if (req.query.lastname) filter.lastname = new RegExp('.*' + req.query.lastname + '.*', 'i');
    if (req.query.gender) filter.gender = new RegExp('^' + req.query.gender + '$', 'i');
    if (req.query.mobile) filter.mobile = new RegExp('.*' + req.query.mobile + '.*', 'i');
    if (req.query.phone) filter.phone = new RegExp('.*' + req.query.phone + '.*', 'i');
    if (req.query.email) filter.email = new RegExp('.*' + req.query.email + '.*', 'i');
    if (req.query.company) filter.company = new RegExp('.*' + req.query.company + '.*', 'i');
    if (req.query.designation) filter.designation = new RegExp('.*' + req.query.designation + '.*', 'i');
    if (req.query.tag) filter.tag = req.query.tag;

    Survey.paginate(filter, { sort: { _id: req.query.sort_order }, page: parseInt(req.query.page), limit: parseInt(req.query.limit), populate: 'tag' }, (error, result) => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        if (error) return resp.status(500).json({
            error: error
        });

        return resp.status(200).json(result);
    });
});




// GET SINGLE SURVEY BY ID
router.get('/:id', auth, (req, resp) => {
    Survey.findById(req.params.id).exec().then(survey => {
        return resp.status(200).json(survey);
    }).catch(error => {
        console.log('error : ', error);
        // 204 : No content. There is no content to send for this request, but the headers may be useful.
        return resp.status(204).json({
            error: error
        });
    });
});



// SAVE SURVEY
router.post('/', auth, (req, resp) => {
    // First check if the conact with firstname, lastname and mobile number already exists.
    Survey.findOne({ firstname: req.body.firstname, lastname: req.body.lastname, mobile: req.body.mobile, is_active: true })
        .exec()
        .then(survey => {
            // If the survey with firstname, lastname and mobile number already exists, then return error
            if (survey) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: 'The survey with name ' + req.body.firstname + ' ' + req.body.lastname + ' and mobile number ' + req.body.mobile + ' already exist.'
                });
            } else {
                // Since the user doesn't exist, then save the detail
                console.log(req.body);
                let survey = new Survey(req.body);
                survey._id = new mongoose.Types.ObjectId(),
                survey.created_date = Date.now(),
                survey.updated_date = Date.now();

                survey.save().then(result => {
                    console.log(result);
                    return resp.status(201).json({
                        message: 'Survey created successfully',
                        result: result
                    });
                }).catch(error => {
                    console.log('error : ', error);
                    // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                    return resp.status(500).json(error);
                });
            }
        }).catch(error => {
            console.log('error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json(error);
        });
});



// UPDATE SURVEY
router.put('/:id', auth, (req, resp) => {
    Survey.findByIdAndUpdate(req.params.id, req.body).exec().then(survey => {
        return resp.status(200).json(survey);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json(error);
    });
});



// DELETE SURVEY (Hard delete. This will delete the entire survey detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp) => {
    Survey.findByIdAndRemove(req.params.id).exec().then(survey => {
        return resp.status(200).json(survey);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
