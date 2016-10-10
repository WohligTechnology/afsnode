/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year:[String],
    sfaid: Number,
    name: String,
    board: String,
    location: String,
    address: String,
    email: String,
    contact: String,
    logo: String,
    status: Boolean,
    deleteStatus: Boolean,
    principal: String,
    sports: [{
        _id: Schema.Types.ObjectId,
        name: String,
        sporttype: String,
        year: String
    }],
    supporterName: String,
    supporterLogo: String,
    blog: Schema.Types.Mixed,
    medals: Schema.Types.Mixed,
    totalPoints2015: {
      type:Number,
      default:0
    },
    totalPoints2016: {
      type:Number,
      default:0
    },
    totalPoints2017: {
      type:Number,
      default:0
    },
    rank: Number,
    sfaAwards: Schema.Types.Mixed,
    sfaRecords: Schema.Types.Mixed,
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        index: true
    },
    contingentLeader: [{
        year: Number,
        student: {
            _id: Schema.Types.ObjectId,
            name: String
        }
    }],
    contingent: {
        type: {
            male: Number,
            female: Number
        }
    },
    video: {
        type: [{
            video: String
        }],
        index: true
    },
    image: {
        type: [{
            image: String
        }],
        index: true
    },
    department: [{
        year: String,
        name: String,
        designation: String,
        contact: String,
        email: String
    }],
    notpaidfor : String,
    timestamp: Date,
    representative: String,
    numberOfSports: String,
    paymentType: String
});
// schema.virtual('sportlistHere', {
//   ref: 'Sport',
//   foreignKey: '_id',
//   localKey: 'sports.$_id',
//   localField : 'sports.$_id',
//   foreignField: '_id'
// });
module.exports = sails.mongoose.model('School', schema);
var models = {
    saveData: function(data, callback) {
        var school = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data, function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        } else {
            school.timestamp = new Date();
            school.deleteStatus = false;
            School.getLastId({}, function(err, data3) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    school.sfaid = data3;
                    school.save(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(null, data2);
                        }
                    });
                }
            });
        }
    },
    getLastId: function(data, callback) {
        School.findOne({}, {
            _id: 0,
            sfaid: 1
        }).sort({
            sfaid: -1
        }).limit(1).lean().exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (_.isEmpty(data2)) {
                callback(null, 1);
            } else {
                callback(null, data2.sfaid + 1);
            }
        });
    },
    getAll: function(data, callback) {
        School.find({}, {}, {}).sort({
            sfaid: -1
        }).populate('sportlistHere').exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getSchool: function(data, callback) {
        School.find({}, {
            _id: 1,
            name: 1,
            sfaid: 1
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getLimitedSchool: function(data, callback) {
      var check = new RegExp(data.search, "i");
      var constraints = {};
      if (data.search) {
        constraints = {
          name: {
            '$regex': check
          }
        };
      } else {
        constraints = {
          sfaid: data.sfaid
        };
      }
      School.find(constraints,
        {},
        {limit:10}
    ).lean().exec(function (err,data) {
      if (err) {
          callback(err, null);
      } else {
          callback(null, data);
      }
    });
        // School.find(constraints, {
        //     _id: 1,
        //     name: 1,
        //     sfaid: 1
        // }, function(err, deleted) {
        //     if (err) {
        //         callback(err, null);
        //     } else {
        //         callback(null, deleted);
        //     }
        // });
    },
    deleteData: function(data, callback) {
        School.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    hide: function(data, callback) {
        School.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                deleteStatus: data.status
            }
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    // deleteAll: function(data, callback) {
    //     School.remove({}, function(err, deleted) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             callback(null, deleted);
    //         }
    //     });
    // },
    getOne: function(data, callback) {
        // var newreturns = {};
        // async.parallel([
        // function(callback) {
        School.findOne({
            _id: data._id
        }).lean().exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                newreturns = deleted;
                callback(null, newreturns);
            }
        });
        //     },
        //     function(callback) {
        //         StudentSport.find({
        //             "school._id": data._id
        //         }).populate("student").exec(function(err, data3) {
        //             if (err) {
        //                 callback(err, null);
        //             } else {
        //                 newreturns.student = data3;
        //                 callback(null, newreturns);
        //             }
        //         });
        //     }
        // ], function(err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } else {
        //         callback(null, newreturns);
        //     }
        // });
    },
    filterStud: function(data, callback) {
        var matchObj = {};
        matchObj = {
            "school._id": sails.ObjectID(data._id),
            year: data.year,
            "student.gender": data.gender,
            "agegroup.name": data.agegroup
        };
        if (!data.gender || data.gender == "All") {
            delete matchObj["student.gender"];
        }
        if (!data.agegroup || data.agegroup == "All") {
            delete matchObj["agegroup.name"];
        }
        console.log(matchObj);
        StudentSport.aggregate([{
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        }, {
            $unwind: "$student"
        }, {
            $match: matchObj
        }, {
            $group: {
                _id: null,
                student: {
                    $addToSet: "$student"
                },
                schoolid: {
                    $addToSet: "$school._id"
                }
            }
        }, {
            $unwind: "$schoolid"
        }, {
            $lookup: {
                from: "schools",
                localField: "schoolid",
                foreignField: "_id",
                as: "school"
            }
        }, {
            $unwind: "$school"
        }, {
            $project: {
                _id: 0,
                student: 1,
                school: 1
            }
        }]).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2[0]);
            } else {
                callback({}, null);
            }
        });
    },
    getSchoolSport: function(data, callback) {
        School.aggregate([{
            $match: {
                _id: sails.ObjectID(data._id)
            }
        }, {
            $unwind: "$sports"
        }, {
            $match: {
                "sports.year": data.year
            }
        }, {
            $group: {
                _id: null,
                sports: {
                    $addToSet: "$sports"
                }
            }
        }]).exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else if (deleted && deleted.length > 0 && deleted[0].sports && deleted[0].sports.length > 0) {
                callback(null, deleted[0].sports);
            } else {
                callback([], null);
            }
        });
    },
    editSchool: function(data, callback) {
        data.status = true;
        this.findOneAndUpdate({
            _id: data._id
        }, data, function(err, data2) {
            if (err) {
                callback(err, false);
            } else {
                callback(null, data2);
            }
        });
    },
    findLimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        data.pagenumber = parseInt(data.pagenumber);
        var checkObj = {};
        if (data.sfaid) {
            data.sfaid = parseInt(data.sfaid);
            checkObj = {
                sfaid: data.sfaid
            };
        } else if (data.name) {
            var check = new RegExp(data.name, "i");
            checkObj = {
                name: {
                    '$regex': check
                }
            };
        } else {
            checkObj = {};
        }
        async.parallel([
                function(callback) {
                    School.count(checkObj).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / 20);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    School.find(checkObj).sort({
                        sfaid: -1
                    }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function(err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    },
    schoolSearch: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        data.pagenumber = parseInt(data.pagenumber);
        var checkObj = {};
        if (data.sfaid) {
            data.sfaid = parseInt(data.sfaid);
            checkObj = {
                sfaid: data.sfaid
            };
        } else if (data.name) {
            var check = new RegExp(data.name, "i");
            checkObj = {
                name: {
                    '$regex': check
                }
            };
        } else {
            checkObj = {};
        }
        async.parallel([
                function(callback) {
                    School.count(checkObj).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number !== "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / 20);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    School.find(checkObj).sort({
                        sfaid: -1
                    }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function(err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    },
    getFirstList: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        async.parallel([
            function(callback) {
                School.find().sort({
                    totalPoints: -1
                }).limit(20).exec(function(err, deleted) {
                    if (err) {
                        callback(err, null);
                    } else {
                        newreturns.data = deleted;
                        callback(null, deleted);
                    }
                });
            },
            function(callback) {
                School.count().exec(function(err, deleted) {
                    if (err) {
                        callback(err, null);
                    } else {
                        newreturns.count = deleted;
                        callback(null, newreturns);
                    }
                });
            }
        ], function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, newreturns);
            }
        });
    },
    searchSchool: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var checkid = parseInt(data.search);
        var orObj = {
            $or: [{
                name: {
                    '$regex': check
                }
            }, {
                sfaid: {
                    '$in': [checkid]
                }
            }]
        };
        console.log(checkid);
        if (checkid == NaN) {
            console.log('test');
            delete orObj["$or"][0];
        }
        console.log(orObj);
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        // async.parallel([
        //     function(callback) {
        //         School.count(orObj).exec(function(err, number) {
        //             if (err) {
        //                 console.log(err);
        //                 callback(err, null);
        //             } else if (number && number != "") {
        //                 newreturns.total = number;
        //                 newreturns.totalpages = Math.ceil(number / data.pagesize);
        //                 callback(null, newreturns);
        //             } else {
        //                 callback(null, newreturns);
        //             }
        //         });
        //     },
        //     function(callback) {
        //         School.find(orObj).sort({ name: 1 }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
        //             if (err) {
        //                 console.log(err);
        //                 callback(err, null);
        //             } else if (data2 && data2.length > 0) {
        //                 newreturns.data = data2;
        //                 callback(null, newreturns);
        //             } else {
        //                 callback(null, newreturns);
        //             }
        //         });
        //     }
        // ], function(err, data4) {
        //     if (err) {
        //         console.log(err);
        //         callback(err, null);
        //     } else if (data4) {
        //         callback(null, newreturns);
        //     } else {
        //         callback(null, newreturns);
        //     }
        // });
    }
};
module.exports = _.assign(module.exports, models);
