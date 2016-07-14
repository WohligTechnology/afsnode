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
    email: Schema.Types.Mixed,
    contact: Schema.Types.Mixed,
    logo: String,
    status: Boolean,
    principal: String,
    sports: {
        type: [{
            _id: Schema.Types.ObjectId
        }],
        index: true
    },
    supported: Schema.Types.Mixed,
    blog: Schema.Types.Mixed,
    medals: Schema.Types.Mixed,
    totalPoints: Number,
    rank: Number,
    sfaAwards: Schema.Types.Mixed,
    sfaRecords: Schema.Types.Mixed,
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },
    contingentLeader: String,
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
    schoolDept: {
        type: Schema.Types.ObjectId,
        ref: "SchoolDepartment"
    },
    timestamp: Date
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

            function callSave(num) {
                school.sfaid = num;
                school.save(function(err, data2) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, data2);
                    }
                });
            }
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
                    callSave(1);
                } else {
                    callSave(data2.sfaid);
                }
            });
        }

    },
    getAll: function(data, callback) {
        School.find({}, {}, {}, function(err, deleted) {
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
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
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
