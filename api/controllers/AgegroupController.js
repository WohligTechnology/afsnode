/**
 * AgegroupController
 *
 * @description :: Server-side logic for managing Agegroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            Agegroup.saveData(req.body, function(err, respo) {
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
            Agegroup.getAll(req.body, function(err, respo) {
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
                Agegroup.deleteData(req.body, function(err, respo) {
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
                Agegroup.getOne(req.body, function(err, respo) {
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
    findForDrop: function(req, res) {
        if (req.body) {
            if (req.body.agegroup && Array.isArray(req.body.agegroup)) {
                Agegroup.findForDrop(req.body, function(err, respo) {
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
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Please provide parameters"
            });
        }
    }
};
