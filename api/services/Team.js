/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    school: {
        type: Schema.Types.ObjectId,
        ref: "School",
        index: true
    },
    name: String,
    sport: {
        type: Schema.Types.ObjectId,
        ref: "SportsList",
        index: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "FirstCategory",
        index: true
    },
    agegroup: {
        type: Schema.Types.ObjectId,
        ref: "Agegroup",
        index: true
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        index: true
    },
    gender: String,
    coach: String,
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Student',
        index: true
    }]
});
module.exports = sails.mongoose.model('Team', schema);
var models = {
    saveData: function(data, callback) {
        var team = this(data);
        var matchObj = {};
        if (data.category && data.category == "") {
            delete data.category;
            matchObj = {
                school: data.school,
                sport: data.sport,
                agegroup: data.agegroup,
                gender: data.gender
            };
        } else {
            matchObj = {
                school: data.school,
                sport: data.sport,
                agegroup: data.agegroup,
                gender: data.gender,
                category: data.category
            };
        }
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
            Team.update(matchObj, {
                $set: {
                    name: data.name + " 'A'"
                }
            }).exec(function(err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (updated.nModified > 0) {
                    team.name = data.name + " 'B'";
                    team.save(function(err, data2) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data2);
                        }
                    });
                } else {
                    team.save(function(err, data2) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data2);
                        }
                    });
                }
            });
        }
    },
    getAll: function(data, callback) {
        Team.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        Team.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getOne: function(data, callback) {
        Team.findOne({
            _id: data._id
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
