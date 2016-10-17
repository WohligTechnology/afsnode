/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid: Number,
  order: Number,
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "League"
  },
  participantType: {
    type: String
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  resultplayer1: {
    type: Number,
    default:0.0
  },
  resultteam1: {
    type: Number,
    default:0.0
  },
  resultplayer2: {
    type: Number,
    default:0.0
  },
  resultteam2: {
    type: Number,
    default:0.0
  },
  date: {
    type: Date
  },
  startTime: {
    type: Date
  },
  totalTime: {
    type: String,
    default: ""
  },
  endTime: {
    type: Date
  },
  score: {
    type: String,
    default: ""
  },
});
module.exports = sails.mongoose.model('League', schema);
var models = {
  saveData: function(data, callback) {
    var league = this(data);
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
      League.find({
        "name": data.name
      }).exec(function(err, data2) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data2 && data2[0]) {
          callback(null, data2);
        } else {
          league.save(function(err, data3) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, data3);
            }
          });
        }
      });
    }
  },
  getAll: function(data, callback) {
    League.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function(data, callback) {
    League.findOneAndRemove({
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
    League.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  findForDrop: function(data, callback) {
    var returns = [];
    var exit = 0;
    var exitup = 1;
    var check = new RegExp(data.search, "i");

    function callback2(exit, exitup, data) {
      if (exit == exitup) {
        callback(null, data);
      }
    }
    League.find({
      name: {
        '$regex': check
      }
    }).limit(10).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.league.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.league, function(n1) {
              if (n1.name == n.name) {
                flag = true;
              }
            });
            return flag;
          });
        }
        returns = returns.concat(found);
        callback2(exit, exitup, returns);
      } else {
        callback([], null);
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
