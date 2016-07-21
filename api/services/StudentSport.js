/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    year: Number,
    gender: String,
    sportslist: {
        type: Schema.Types.ObjectId,
        ref: "SportsList",
        index: true
    },
    firstcatgeory: {
        type: Schema.Types.ObjectId,
        ref: "FirstCategory",
        index: true
    },
    secondcategory: {
        type: Schema.Types.ObjectId,
        ref: "SecondCategory",
        index: true
    },
    thirdcategory: {
        type: Schema.Types.ObjectId,
        ref: "ThirdCategory",
        index: true
    },
    agegroup: {
        type: Schema.Types.ObjectId,
        ref: "Agegroup",
        index: true
    },
    medals: Schema.Types.Mixed,
    school: {
        type: Schema.Types.ObjectId,
        ref: "School",
        index: true
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
    }
};
module.exports = _.assign(module.exports, models);
