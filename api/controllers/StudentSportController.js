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
            if (req.body._id && req.body._id !== "") {
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
    },
    excelDownload: function(req, res) {
        var arr = [];
        StudentSport.aggregate([{
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        }, {
            $lookup: {
                from: "schools",
                localField: "school._id",
                foreignField: "_id",
                as: "school"
            }
        }, {
            $unwind: "$student"
        }, {
            $unwind: "$school"
        }, {
            $group: {
                _id: "$student._id",
                student: {
                    $addToSet: "$student"
                },
                sportslist: {
                    $addToSet: "$sportslist"
                },
                school: {
                    $addToSet: "$school"
                },
                agegroup: {
                    $addToSet: "$agegroup"
                }
            }
        }, {
            $project: {
                _id: 1,
                student: 1,
                school: 1,
                sportslist: {
                    $cond: [{
                            $eq: ["$sportslist", []]
                        },
                        {}, "$sportslist"
                    ]
                },
                agegroup: {
                    $cond: [{
                            $eq: ["$agegroup", []]
                        },
                        {}, "$agegroup"
                    ]
                }
            }
        }]).exec(function(err, found) {
            // res.json({ data: found });

            function callMe(num) {
                var abc = found[num];
                var sport = "";
                var excel = {};
                if (abc.sportslist && abc.sportslist.length > 0) {
                    _.each(abc.sportslist, function(x) {
                        x = x.name + ", ";
                        sport += x;
                    });
                } else {
                    sport = null;
                }
                excel = {
                    "Student Id": abc.student[0].sfaid,
                    "Student Name": abc.student[0].name,
                    "School Id": abc.school[0].sfaid,
                    "School Name": abc.school[0].name,
                    "Gender": abc.student[0].gender,
                    "Sports": sport
                };
                if (abc.agegroup && abc.agegroup.length > 0) {
                    excel["Age Group"] = abc.agegroup[0].name;
                } else {
                    excel["Age Group"] = null;
                }
                arr.push(excel);
                num++;
                if (num == found.length) {
                    var xls = sails.json2xls(arr);
                    var path = "./Student Data.xlsx";
                    sails.fs.writeFileSync(path, xls, 'binary');
                    var excel = sails.fs.readFileSync(path);
                    var mimetype = sails.mime.lookup(path);
                    res.set('Content-Type', "application/octet-stream");
                    res.set('Content-Disposition', "attachment;filename=" + path);
                    res.send(excel);
                    console.log(excel);
                    setTimeout(function() {
                        sails.fs.unlink(path, function(err) {
                            console.log(err);
                        });
                    }, 10000);
                } else {
                    callMe(num);
                }
            }
            callMe(0);
        });
    },
    excelDownload2: function(req, res) {
        Student.aggregate([{
            $lookup: {
                from: "studentsports",
                localField: "_id",
                foreignField: "student",
                as: "sports"
            }
        }, {
            $unwind: "$sports"
        }, {
            $group: {
                _id: "$_id",
                studentName: {
                    $addToSet: "$name"
                },
                studentId: {
                    $addToSet: "$sfaid"
                },
                gender: {
                    $addToSet: "$gender"
                },
                sports: {
                    $addToSet: "$sports.sportslist.name"
                },
                agegroup: {
                    $addToSet: "$sports.agegroup.name"
                },
                schoolName: {
                    $addToSet: "$sports.school.name"
                },
                schoolId: {
                    $addToSet: "$sports.school.sfaid"
                }
            }
        },{
          $unwind:"$studentId"
        },{
          $sort : {
            studentId: 1
          }
        }]).exec(function(err, found) {
            var arr = [];
            console.log(found);
            function callMe(num) {
                var abc = found[num];
                var sport = "";
                var excel = {};
                if (abc.sports && abc.sports.length > 0) {
                    _.each(abc.sports, function(x) {
                        x = x + ", ";
                        sport += x;
                    });
                } else {
                    sport = null;
                }
                excel = {
                    "Student Id": abc.studentId,
                    "Student Name": abc.studentName[0],
                    "School Id": abc.schoolId[0],
                    "School Name": abc.schoolName[0],
                    "Gender": abc.gender[0],
                    "Sports": sport
                };
                if (abc.agegroup && abc.agegroup.length > 0) {
                    excel["Age Group"] = abc.agegroup[0];
                } else {
                    excel["Age Group"] = null;
                }
                arr.push(excel);
                num++;
                if (num == found.length) {
                    var xls = sails.json2xls(arr);
                    var path = "./Student Data.xlsx";
                    sails.fs.writeFileSync(path, xls, 'binary');
                    var excel = sails.fs.readFileSync(path);
                    var mimetype = sails.mime.lookup(path);
                    res.set('Content-Type', "application/octet-stream");
                    res.set('Content-Disposition', "attachment;filename=" + path);
                    res.send(excel);
                    setTimeout(function() {
                        sails.fs.unlink(path, function(err) {
                            console.log(err);
                        });
                    }, 10000);
                } else {
                    callMe(num);
                }
            }
            callMe(0);
        });
    }
};
