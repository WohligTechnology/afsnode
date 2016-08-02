/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    year: String,
    sportslist: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String,
            sporttype: String
        }
    },
    agegroup: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String
        }
    },
    firstcategory: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String
        }
    },
    secondcategory: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String
        }
    },
    thirdcategory: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String
        }
    },
    medals: Schema.Types.Mixed,
    school: {
        type: {
            _id: {
                type: Schema.Types.ObjectId
            },
            name: String
        }
    },
    student: {
        type: Schema.Types.ObjectId
    }
});
module.exports = sails.mongoose.model('StudentSport', schema);
var models = {
    saveData: function(data, callback) {
        var studentsport = this(data);
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
            studentsport.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        StudentSport.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        StudentSport.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, deleted)
            }
        });
    },
    getOne: function(data, callback) {
        StudentSport.findOne({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getSports: function(data, callback) {
        StudentSport.find({
            student: data.student
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    }
};
module.exports = _.assign(module.exports, models);
