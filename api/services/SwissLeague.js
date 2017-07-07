/**
 * SwissLeague.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid: Number,
  order: {
    type: Number,
    default: 0
  },
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "Swiss League"
  },
  participantType: {
    type: String,
    default: "player"
  },
  roundno: {
    type: Number,
    default: 0
  },
  round: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  result1: {
    type: String,
  },
  result2: {
    type: String,
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  totalTime: {
    type: String,
    default: ""
  }
});

schema.plugin(deepPopulate, {
  populate: {
    'player1': {
      select: 'name _id sfaid school'
    },
    'player1.school': {
      select: 'name _id '
    },
    'player2': {
      select: 'name _id sfaid school'
    },
    'player2.school': {
      select: 'name _id '
    },
    'team1': {
      select: 'name _id sfaid school'
    },
    'team1.school': {
      select: 'name _id '
    },
    'team2': {
      select: 'name _id sfaid school'
    },
    'team2.school': {
      select: 'name _id '
    }
  }
});

module.exports = sails.mongoose.model('SwissLeague', schema);
var models = {
  saveData: function (data, callback) {
    var swisses = {};
    var swissleague = this(data);

    function updatePlayersAndCallback() {
      var constraints = {};
      constraints.student = swisses.player1;
      constraints.year = swisses.year;
      constraints.sport = swisses.sport;
      constraints.drawFormat = "Swiss League";
      constraints.swissleague = swisses._id;
      console.log(constraints);
      StudentStats.saveData(constraints, function (err, response) {
        console.log(err, response);
        if (err) {
          callback(err, null);
        } else {
          constraints.student = swisses.player2;
          StudentStats.saveData(constraints, function (err, resp) {
            console.log(err, resp);
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
      }, {
        $set: data
      }, {
        new: true
      }, function (err, data2) {
        if (err) {
          callback(err, null);
        } else {
          swisses = data2;
          updatePlayersAndCallback();
        }
      });
    } else {

      SwissLeague.getLastSwissLeague({}, function (err, response) {
        if (err) {
          callback(null, err);
        } else {
          swissleague.matchid = parseInt(response) + 1;
          swissleague.save(function (err, data3) {
            if (err) {
              callback(err, null);
            } else {
              swisses = data3;
              updatePlayersAndCallback();
            }
          });
        }
      });
    }
  },
  getAll: function (data, callback) {
    SwissLeague.find({
      sport: data.sport
    }, {}, {}, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('player1', 'name').populate('player2', 'name').populate('sport');
  },
  deleteData: function (data, callback) {
    SwissLeague.findOneAndRemove({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.remove({
          drawFormat: "Swiss League",
          swissleague: data._id
        }, function (err, deleted) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, deleted);

          }
        });
      }
    });
  },
  getLastSwissLeague: function (data, callback) {
    SwissLeague.find({}, {
      _id: 0,
      matchid: 1
    }).sort({
      matchid: -1
    }).limit(1).lean().exec(function (err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback(null, 0);
      } else {
        // console.log(data2);
        callback(null, data2[0].matchid);
      }
    });
  },
  getOne: function (data, callback) {
    SwissLeague.findOne({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('player1').populate('player2').populate('sport');
  },
  findForDrop: function (data, callback) {
    var returns = [];
    var exit = 0;
    var exitup = 1;
    var check = new RegExp(data.search, "i");

    function callback2(exit, exitup, data) {
      if (exit == exitup) {
        callback(null, data);
      }
    }
    SwissLeague.find({
      name: {
        '$regex': check
      }
    }).limit(10).exec(function (err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.swissleague.length !== 0) {
          var nedata;
          nedata = _.remove(found, function (n) {
            var flag = false;
            _.each(data.swissleague, function (n1) {
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
