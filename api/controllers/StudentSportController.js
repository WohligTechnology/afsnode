/**
 * StudentSportController
 *
 * @description :: Server-side logic for managing StudentSports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            StudentSport.saveData(req.body, function(err, respo) {
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
            StudentSport.getAll(req.body, function(err, respo) {
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
    getSports: function(req, res) {
        if (req.body) {
            StudentSport.getSports(req.body, function(err, respo) {
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
                StudentSport.deleteData(req.body, function(err, respo) {
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
                StudentSport.getOne(req.body, function(err, respo) {
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
    updateId: function(req, res) {
        StudentSport.find({}, function(err, data2) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    data: err
                });
            } else {
                function callMe(num) {
                    var abc = data2[num];
                    if (abc.sportslist) {
                        abc.sportslist._id = sails.ObjectID(abc.sportslist._id);
                    }
                    if (abc.agegroup) {
                        abc.agegroup._id = sails.ObjectID(abc.agegroup._id);
                    }
                    if (abc.firstcategory) {
                        abc.firstcategory._id = sails.ObjectID(abc.firstcategory._id);
                    }
                    if (abc.secondcategory) {
                        abc.secondcategory._id = sails.ObjectID(abc.secondcategory._id);
                    }
                    if (abc.school) {
                        abc.school._id = sails.ObjectID(abc.school._id);
                    }
                    StudentSport.saveData(abc, function(err, data3) {
                        if (err) {
                            console.log(err);
                        } else {
                            num++;
                            console.log(num);
                            if (num == data2.length) {
                                res.json({ value: true, data: "Done" });
                            } else {
                                callMe(num);
                            }
                        }
                    });
                }
                callMe(0);
            }
        });
    }

    // excelDownload: function(req, res) {
    //     var arr = [];
    //     var i = 0;
    //     StudentSport.aggregate([{
    //         $lookup: {
    //             from: "students",
    //             localField: "student",
    //             foreignField: "_id",
    //             as: "students"
    //         }
    //     }, {
    //         $unwind: "$students"
    //     }, {
    //         $group: {
    //             _id: "$students._id",
    //             students: {
    //                 $addToSet: "$students"
    //             },
    //             sportslist: {
    //                 $push: "$sportslist"
    //             },
    //             agegroup: {
    //                 $push: "$agegroup"
    //             },
    //             school: {
    //                 $push: "$school"
    //             },
    //             year: {
    //                 $addToSet: "$year"
    //             }
    //         }
    //     }]).exec(function(err, found) {
    //         res.json({ data: found });
    //         // function callMe(num) {
    //         //     var abc = found[num];
    //         //     arr.push({
    //         //         "Id": abc.sfaid,
    //         //         "School Name": abc.name,
    //         //         "Board": abc.board,
    //         //         "Verified": abc.status,
    //         //         "Address": abc.address,
    //         //         "Location": abc.location,
    //         //         "Email Id": abc.email,
    //         //         "Contact": abc.contact,
    //         //         "SFA Representative": abc.representative,
    //         //         "No. of Sports": abc.numberOfSports,
    //         //         "Type": abc.paymentType,
    //         //         "Principal": abc.principal
    //         //     });
    //         //     num++;
    //         //     if (num == found.length) {
    //         //         var xls = sails.json2xls(arr);
    //         //         var path = "./School Data.xlsx";
    //         //         sails.fs.writeFileSync(path, xls, 'binary');
    //         //         var excel = sails.fs.readFileSync(path);
    //         //         var mimetype = sails.mime.lookup(path);
    //         //         res.set('Content-Type', "application/octet-stream");
    //         //         res.set('Content-Disposition', "attachment;filename=" + path);
    //         //         res.send(excel);
    //         //         // res.json({ data: arr });
    //         //         setTimeout(function() {
    //         //             sails.fs.unlink(path, function(err) {
    //         //                 console.log(err);
    //         //             });
    //         //         }, 10000);
    //         //     } else {
    //         //         callMe(num);
    //         //     }
    //         // }
    //         // callMe(0);
    //     });
    // },
};
