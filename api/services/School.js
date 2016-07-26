/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
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
    supported: Schema.Types.Mixed,
    blog: Schema.Types.Mixed,
    medals: Schema.Types.Mixed,
    totalPoints: Number,
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
    timestamp: Date,
    representative: String,
    numberOfSports: String,
    paymentType: String
});
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
        }).exec(function(err, deleted) {
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
    deleteData: function(data, callback) {
        School.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
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
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    deleteAll: function(data, callback) {
        School.remove({}, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    getOne: function(data, callback) {
        School.findOne({
            _id: data._id
        }).exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
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
        var check = new RegExp(data.search, "i");
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function(callback) {
                    School.count({
                        name: {
                            '$regex': check
                        }
                    }).exec(function(err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function(callback) {
                    School.find({
                        name: {
                            '$regex': check
                        }
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
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
};
module.exports = _.assign(module.exports, models);
