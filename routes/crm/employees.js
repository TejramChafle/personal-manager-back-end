const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../auth');
const bcrypt = require('bcrypt');
const router = express.Router();

const Employee = require('../../models/crm/Employee/Employee');
const EmployeeArea = require('../../models/crm/Employee/EmployeeArea');
const EmployeeProfile = require('../../models/crm/Employee/EmployeeProfile');
const EmployeeAuthorization = require('../../models/crm/Employee/EmployeeAuthorization');


// GET EMPLOYEES (default active) WITH filter, sorting & pagination
router.get('/', auth, (req, resp) => {
    console.log('req.query: ', req.query);
    let filter = {};
    filter.is_active = req.query.is_active || true;
    if (req.query.name) filter.name = new RegExp('.*' + req.query.name + '.*', 'i');
    if (req.query.primary_phone) filter.primary_phone = new RegExp('.*' + req.query.primary_phone + '.*', 'i');
    if (req.query.alternate_phone) filter.alternate_phone = new RegExp('.*' + req.query.alternate_phone + '.*', 'i');
    if (req.query.email) filter.email = new RegExp('.*' + req.query.email + '.*', 'i');
    if (req.query.gender) filter.gender = req.query.gender;

    Employee.paginate(filter,
        {
            sort: { _id: req.query.sort_order },
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit),
            populate: ['professional', 'authorization']
        }, (error, result) => {
            console.log('error',error);
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
    Employee.findOne({ name: req.body.personal.name, email: req.body.personal.email, primary_phone: req.body.personal.phone.primary, is_active: true })
        .exec()
        .then(employee => {
            // If the employee with firstname, lastname and mobile number already exists, then return error
            if (employee) {
                // 409 : Conflict. The request could not be completed because of a conflict.
                return resp.status(409).json({
                    message: 'The employee with name ' + req.body.personal.name + ', email ' + req.body.personal.email + ' and mobile number ' + req.body.personal.phone.primary + ' already exist.'
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

                area.save().then(areaResult => {
                    console.log('areaResult', areaResult);
                    // Save profile information
                    const profile_data = {
                        department: req.body.professional.department,
                        designation: req.body.professional.designation,
                        date_of_joining: req.body.professional.dateOfJoining,
                        supervisor: req.body.professional.supervisor,
                        area: areaResult._id,
                    }
                    let profile = new EmployeeProfile(profile_data);
                    profile._id = new mongoose.Types.ObjectId();
                    profile.created_date = now;
                    profile.updated_date = now;
                    profile.created_by = req.body.created_by;
                    profile.updated_by = req.body.updated_by;

                    profile.save().then(profileResult => {
                        console.log('profileResult', profileResult);
                        // Save employee information
                        const auth_data = {
                            role: req.body.credentials.role,
                            username: req.body.credentials.username,
                            // password: req.body.credentials.password
                        };
                        let auth = new EmployeeAuthorization(auth_data);
                        auth._id = new mongoose.Types.ObjectId();
                        auth.created_date = now;
                        auth.updated_date = now;
                        auth.created_by = req.body.created_by;
                        auth.updated_by = req.body.updated_by;
                        // password encryption
                        bcrypt.hash(req.body.credentials.password, 10, (err, hashResult) => {
                            console.log('result of hash', hashResult);
                            auth.password = hashResult;
                            auth.save().then(authResult => {
                                console.log('authResult', authResult);
                                // Save employee information
                                const employee_data = {
                                    name: req.body.personal.name,
                                    gender: req.body.personal.gender,
                                    birthday: req.body.personal.birthday,
                                    email: req.body.personal.email,
                                    primary_phone: req.body.personal.phone.primary,
                                    alternate_phone: req.body.personal.phone.alternate,
                                    professional: profileResult._id,
                                    authorization: authResult._id
                                };
                                let employee = new Employee(employee_data);
                                employee._id = new mongoose.Types.ObjectId();
                                employee.created_date = now;
                                employee.updated_date = now;
                                employee.created_by = req.body.created_by;
                                employee.updated_by = req.body.updated_by;
                                employee.save().then(employeeResult => {
                                    console.log('employeeResult', employeeResult);
                                    return resp.status(201).json({
                                        message: 'Employee created successfully.',
                                        result: employeeResult
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
