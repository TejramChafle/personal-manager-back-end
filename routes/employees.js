var express = require('express');
var mongoose = require('mongoose');
var Employee = require('../models/Employee/Employee');
const auth = require('../auth');
const EmployeeArea = require('../models/Employee/EmployeeArea');
const EmployeeProfile = require('../models/Employee/EmployeeProfile');

var router = express.Router();


// GET EMPLOYEES (default active) WITH filter, sorting & pagination
router.get('/', auth, (req, resp) => {

    let filter = {};
    filter.is_active = req.query.is_active || true;
    if (req.query.name) filter.name = new RegExp('.*' + req.query.name + '.*', 'i');
    if (req.query.lastname) filter.lastname = new RegExp('.*' + req.query.lastname + '.*', 'i');
    if (req.query.gender) filter.gender = new RegExp('^' + req.query.gender + '$', 'i');
    if (req.query.primary_phone) filter.primary_phone = new RegExp('.*' + req.query.primary_phone + '.*', 'i');
    if (req.query.alternate_phone) filter.alternate_phone = new RegExp('.*' + req.query.alternate_phone + '.*', 'i');
    if (req.query.email) filter.email = new RegExp('.*' + req.query.email + '.*', 'i');
    if (req.query.department) filter.department = new RegExp('.*' + req.query.department + '.*', 'i');
    if (req.query.designation) filter.designation = new RegExp('.*' + req.query.designation + '.*', 'i');
    // if (req.query.tag) filter.tag = req.query.tag;

    Employee.paginate(filter,
        {
            sort: { _id: req.query.sort_order },
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit),
            populate: ['professional', 'authorization']
        }, (error, result) => {
            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
            if (error) return resp.status(500).json({
                error: error
            });

            return resp.status(200).json(result);
        });
});




// GET SINGLE EMPLOYEE BY ID
router.get('/:id', auth, (req, resp) => {
    Employee.findById(req.params.id).exec().then(employee => {
        return resp.status(200).json(employee);
    }).catch(error => {
        console.log('error : ', error);
        // 204 : No content. There is no content to send for this request, but the headers may be useful.
        return resp.status(204).json({
            error: error
        });
    });
});



// SAVE EMPLOYEE
router.post('/', auth, (req, resp) => {
    // First check if the conact with firstname, lastname and mobile number already exists.
    Employee.findOne({ firstname: req.body.firstname, lastname: req.body.lastname, primary_phone: req.body.primary_phone, is_active: true })
        .exec()
        .then(employee => {
            // If the employee with firstname, lastname and mobile number already exists, then return error
            if (employee) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: 'The employee with name ' + req.body.firstname + ' ' + req.body.lastname + ' and mobile number ' + req.body.primary_phone + ' already exist.'
                });
            } else {
                // Since the user doesn't exist, then save the detail
                console.log(req.body);
                const now = Date.now();

                // Save profile area information
                let area = new EmployeeArea(req.body.professional.area);
                area._id = new mongoose.Types.ObjectId();
                area.created_date = now;
                area.updated_date = now;
                area.created_by = req.body.created_by;
                area.updated_by = req.body.updated_by;

                area.save().then(arearesult => {
                    console.log('arearesult', arearesult);
                    // Save profile information
                    const profile_data = {
                        department: req.body.professional.department,
                        designation: req.body.professional.designation,
                        date_of_joining: req.body.professional.dateOfJoining,
                        supervisor: req.body.professional.supervisor,
                        area: arearesult._id,
                    }
                    let profile = new EmployeeProfile(profile_data);
                    profile._id = new mongoose.Types.ObjectId();
                    profile.created_date = now;
                    profile.updated_date = now;
                    profile.created_by = req.body.created_by;
                    profile.updated_by = req.body.updated_by;

                    profile.save().then(profileresult => {
                        console.log(profileresult);
                        // Save employee information
                        const employee_data = {
                            name: req.body.name,
                            gender: req.body.gender,
                            birthday: req.body.birthday,
                            email: req.body.email,
                            primary_phone: req.body.primary_phone,
                            alternate_phone: req.body.alternate_phone,
                            professional: profileresult._id
                        }
                        let employee = new EmployeeProfile(employee_data);
                        employee._id = new mongoose.Types.ObjectId();
                        employee.created_date = now;
                        employee.updated_date = now;
                        employee.created_by = req.body.created_by;
                        employee.updated_by = req.body.updated_by;
                        employee.save().then(employeeesult => {
                            console.log(employeeesult);
                            return resp.status(201).json({
                                message: 'Employee created successfully',
                                result: employeeesult
                            });
                        }).catch(error => {
                            console.log('error : ', error);
                            // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                            return resp.status(500).json(error);
                        });
                    }).catch(error => {
                        console.log('error : ', error);
                        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
                        return resp.status(500).json(error);
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



// UPDATE EMPLOYEE
router.put('/:id', auth, (req, resp) => {
    Employee.findByIdAndUpdate(req.params.id, req.body).exec().then(employee => {
        return resp.status(200).json(employee);
    }).catch(error => {
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json(error);
    });
});



// DELETE EMPLOYEE (Hard delete. This will delete the entire employee detail. Only application admin should be allowed to perform this action )
router.delete('/:id', auth, (req, resp) => {
    Employee.findByIdAndRemove(req.params.id).exec().then(employee => {
        return resp.status(200).json(employee);
    }).catch(error => {
        console.log('error : ', error);
        // 500 : Internal Sever Error. The request was not completed. The server met an unexpected condition.
        return resp.status(500).json({
            error: error
        });
    });
});

module.exports = router;
