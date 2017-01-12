/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) { 
            Admin.saveData(req.body, function(err, respo) {
                if (err) {
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respo
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getAll: function(req, res) {
        if (req.body) {
            Admin.getAll(req.body, function(err, respo) {
                if (err) {
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respo
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    deleteData: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                Admin.deleteData(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid Id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "") {
                Admin.getOne(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid Id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    login: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.password) {
                Admin.login(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    }
};
