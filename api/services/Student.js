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
    firstname: String,
    middlename: String,
    lastname: String,
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        index: true
    },
    deleteStatus: Boolean,
    gender: String,
    dob: Date,
    email: String,
    contact: String,
    location: String,
    address: String,
    parentName: String,
    profilePic: String,
    blog: Schema.Types.Mixed,
    medals: Schema.Types.Mixed,
    sfaAwards: Schema.Types.Mixed,
    sfaRecords: Schema.Types.Mixed,
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
    dateOfForm: String,
    timeOfForm: String
});
module.exports = sails.mongoose.model('Student', schema);
var models = {
    saveData: function(data, callback) {
        if (data.middlename) {
            data.name = data.lastname + " " + data.firstname + " " + data.middlename;
        } else {
            data.name = data.lastname + " " + data.firstname + " ";
        }
        var student = this(data);
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
            student.timestamp = new Date();
            student.deleteStatus = false;
            Student.getLastId({}, function(err, data3) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    student.sfaid = data3;
                    student.save(function(err, data2) {
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
        Student.findOne({}, {
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
        Student.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getStud: function(data, callback) {
        Student.find({}, {
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
        Student.findOneAndRemove({
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
        Student.findOneAndUpdate({
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
        Student.remove({}, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    getOne: function(data, callback) {
        Student.findOne({
            _id: data._id
        }).populate("school", "_id name").lean().exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    editStudent: function(data, callback) {
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
                    Student.count({
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
                    Student.find({
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
