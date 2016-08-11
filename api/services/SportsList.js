/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here which I know you don't fucking want to.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    name: String,
    sporttype: String,
    tableContent: Schema.Types.Mixed
});
module.exports = sails.mongoose.model('SportsList', schema);
var models = {
    saveData: function(data, callback) {
        var sportslist = this(data);
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
            sportslist.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        SportsList.find({}, {}, {}).sort({
            _id: -1
        }).exec(function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        SportsList.findOneAndRemove({
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
        SportsList.findOne({
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
