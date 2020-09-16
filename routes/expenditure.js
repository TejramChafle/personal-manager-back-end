var express     = require('express');
var mongoose    = require('mongoose');
var Attendance  = require('../models/Attendance');
const auth      = require('../auth');

var router      = express.Router();


/**
 * @swagger
 * /attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     description: Creates a new attendance
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: attendance
 *         description: Attendance object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Attendance'
 *     responses:
 *       201:
 *         description: Attendance created successfully
 */
// SAVE ATTENDANCE
router.post('/', auth, (req, resp, next) => {
    // First check if the attendance of the day and shift is marked
    Attendance.findOne({ date: req.body.date, shift: req.body.shift, is_active: true })
        .exec()
        .then(attendance => {
            // If the attendance of the day already marked, then return error
            if (attendance) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: "The attendance of the date " + req.body.date + "for " + req.body.shift + " shift is already marked."
                });
            } else {
                // Since the attendace is not marked, then save the detail
                console.log(req.body);
                const attendance = new Attendance({
                    _id: new mongoose.Types.ObjectId(),
                    shift: req.body.shift,
                    date: req.body.date,
                    staff_present: req.body.staff_present,
                    created_by: req.body.created_by,
                    updated_by: req.body.updated_by,
                    created_date: Date.now(),
                    updated_date: Date.now()
                });

                attendance.save()
                    .then(result => {
                        console.log(result);
                        return resp.status(201).json({
                            message: "Attendance marked successfully.",
                            result: result
                        });
                    })
                    .catch(error => {
                        console.log('error : ', error);
                        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                        return resp.status(500).json({
                            error: error
                        });
                    });
            }
        }).catch(error => {
            console.log('error : ', error);
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            return resp.status(500).json({
                error: error
            });
        });
});


/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     tags:
 *       - Attendance
 *     description: Deletes a single attendance
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Attendance's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
// DELETE ATTENDANCE (Hard delete. This will delete the entire attendance detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp, next) => {
    Attendance.findByIdAndRemove(req.params.id).exec().then(attendance => {
        return resp.status(200).json(attendance);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
