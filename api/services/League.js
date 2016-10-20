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
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  team1: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  result1: {
    type: String
  },
  result2: {
    type: String
  },
  point1:{
    type:Number,
    default:0.0
  },
  point2:{
    type:Number,
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
    var leagues = {};
    var league = this(data);
    function updateStudentsAndCallback() {
      var constraints = {};
      constraints.student = details[details.participantType + "1"];
      constraints.year = details.year;
      constraints.sport = details.sport;
      constraints.drawFormat = "Knockout";
      constraints.league = details._id;
      StudentStats.saveData(constraints, function(err, response) {
        if (err) {
          callback(err, null);
        } else {
          constraints.student = details[details.participantType + "2"];
          StudentStats.saveData(constraints, function(err, resp) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, resp);
            }
          });
        }
      });
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
      League.getLastLeague({}, function(err, response) {
        if (err) {
          callback(null, err);
        } else {
          league.matchid = parseInt(response) + 1;
          league.save(function(err, data2) {
            if (err) {
              callback(err, null);
            } else {
              if (data2.participantType) {
                if (data2.participantType == 'player') {
                  updatePlayersAndCallback();

                } else {
                  League.populate(data2, [{
                    path: 'team1'
                  },{
                      path:'team2'
                  }], function(err, response) {
                    if (err) {
                      callback(err, null);
                    } else {
                      leagues = response;

                    }
                  });
                }
              } else {
                callback(null, data2);
              }
            }
          });
        }
      });
    }
  },
  getLastLeague: function(data, callback) {
    League.find({}, {
      _id: 0,
      matchid: 1
    }).sort({
      matchid: -1
    }).limit(1).lean().exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback(null, 0);
      } else {
        console.log(data2);
        callback(null, data2[0].matchid);
      }
    });
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
        callback(err, null);
      } else {
        callback(null, deleted);
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
