/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    name: String,
    accesslevel: String,
    email: String,
    password: String,
    status: Boolean
});
module.exports = sails.mongoose.model('Admin', schema);
var models = {
    saveData: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        var admin = this(data);
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
            admin.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }

    },
    login: function(data, callback) {
        if (data.password && data.password != "") {
            data.password = sails.md5(data.password);
        }
        Admin.findOne({
            email: data.email,
            password: data.password,
            accesslevel: "admin"
        }, {}, function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (_.isEmpty(data2)) {
                callback({ message: "Admin not found" }, null);
            } else {
                callback(null, { message: "Admin found" });
            }
        });
    },
    getAll: function(data, callback) {
        Admin.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        Admin.findOneAndRemove({
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
        Admin.findOne({
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
