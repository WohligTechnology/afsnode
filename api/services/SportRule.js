/**
 * SportRule.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    sportid: {
        type: Schema.Types.ObjectId,
        ref: "SportsList"
    },
    banner: String,
    year: String,
    fromDate: Date,
    toDate: Date,
    dateContent: String,
    rules: String,
    ageGroupContent: String,
    ageGroupTable: Schema.Types.Mixed,
    eligibilityContent: String,
    eligibilityTable: Schema.Types.Mixed,
    scheduleLeader: String,
    yearBeforeContent: String,
    winnerTable: Schema.Types.Mixed,
    teamTable: Schema.Types.Mixed,
    images: [{
        name: String
    }],
    videos: [{
        name: String
    }],
    featured: {
        type: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Student"
            },
            name: String,
            sfaid: Number
        }]
    },
    about: String,
    trainingname: String,
    training: String,
    trainingLogo: String,
    trainingLink: String,
    form: String
});
module.exports = sails.mongoose.model('SportRule', schema);
var models = {
    saveData: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        var sportrule = this(data);
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
            sportrule.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        SportRule.find().populate("sportid").exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        SportRule.findOneAndRemove({
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
        SportRule.findOne({
            _id: data._id
        }).populate("sportid").exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    }
};
module.exports = _.assign(module.exports, models);
