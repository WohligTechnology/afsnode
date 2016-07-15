/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    name: String,
    type: String,
    agegroup: {
        type: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Agegroup'
            }
        }],
        index: true
    },
    category: {
        type: [{
            name: String
        }]
    }
});
module.exports = sails.mongoose.model('Sport', schema);
var models = {
    saveData: function(data, callback) {
        var sport = this(data);
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
            sport.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        Sport.find(function(err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },
    deleteData: function(data, callback) {
        Sport.findOneAndRemove({
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
        Sport.findOne({
            _id: data._id
        }, function(err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    }
};
module.exports = _.assign(module.exports, models);
