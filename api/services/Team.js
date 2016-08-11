/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  school: {
      type: {
          _id: {
              type: Schema.Types.ObjectId
          },
          name: String
      }
  },
  sport : {
    type : {
      _id : {
        type: Schema.Types.ObjectId
      },
      name : String
    }
  },
  category : {
    type : String,
    default :  ""
  },
  ageGroupContent: String,
  ageGroupTable: Schema.Types.Mixed,
  gender: String,
  coach : {
      type: {
          _id: {
              type: Schema.Types.ObjectId
          },
          name: String
      }
  },
  players:[ {
      type: {
          _id: {
              type: Schema.Types.ObjectId
          },
          name: String
      }
  }]
});
module.exports = sails.mongoose.model('Team', schema);
var models = {
    saveData: function(data, callback) {
        var team = this(data);
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
            team.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
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
