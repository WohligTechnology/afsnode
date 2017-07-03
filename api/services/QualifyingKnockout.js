var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid: Number,
  roundno: Number,
  qualifyingknockout: {
    type: String
  },
  round: {
    type: String,
    default: "Round"
  },
  order: Number,
  qualifyingorder: Number,
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "Qualifying Knockout"
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
  name: {
    type: String,
    default: "Heat 1"
  },
  video: {
    type: String
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
  heats: [{
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    score: {
      type: Number
    },
    result: {
      type: String
    },
    position: {
      type: String
    }
  }]
});
schema.plugin(deepPopulate, {
  populate: {
    'heats.player.school': {
      select: 'name _id sfaid school'
    },
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

module.exports = sails.mongoose.model('QualifyingKnockout', schema);
var models = {
  saveData: function (data, callback) {
    var quals = {};

    //  FOR KNOCKOUT QUALIFYING ROUND

    function updateStudentsAndCallback(details) {
      var constraints = {};
      constraints.student = details[details.participantType + "1"];
      constraints.year = details.year;
      constraints.sport = details.sport;
      constraints.drawFormat = "Qualifying Knockout";
      constraints.qualifyingknockout = details._id;
      StudentStats.saveData(constraints, function (err, response) {
        if (err) {
          callback(err, null);
        } else {
          constraints.student = details[details.participantType + "2"];
          StudentStats.saveData(constraints, function (err, resp) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, resp);
            }
          });
        }
      });
    }

    function savePlayya(team, iterator) {
      var constraints = {};
      constraints.year = quals.year;
      constraints.sport = quals.sport;
      constraints.drawFormat = "Qualifying Knockout";
      constraints.qualifyingknockout = quals._id;
      if (quals['team' + team].players) {
        constraints.student = quals['team' + team].players[iterator];
        constraints.team = quals['team' + team]._id;
      }
      StudentStats.saveData(constraints, function (err, response) {
        if (err) {
          callback(err, null);
        } else {
          // console.log(response);
          runThroughTeam(team, ++iterator);
        }
      });
    }

    function runThroughTeam(team, iterator) {
      var otherteam = (team === 1) ? 2 : 1;
      if (quals['team' + team].players.length <= iterator) {
        if (quals['team' + otherteam].players.length > 0) {
          quals['team' + team].players = [];
          runThroughTeam(otherteam, 0);
        } else {
          callback(null, "done");
        }
      } else {
        savePlayya(team, iterator);
      }
    }

    function selectTeamAndRun() {
      if (quals.participantType == 'team') {
        if (quals.team1 && quals.team1.players.length > 0) {
          runThroughTeam(1, 0);
        } else {
          runThroughTeam(2, 0);
        }
      }
    }

    //  FOR GROUPS Qualifying Knockout

    function saveTeamPlayya(iterator, playya) {
      // fuck Playya
      var constraints = {};
      constraints.year = quals.year;
      constraints.sport = quals.sport;
      constraints.drawFormat = "Qualifying Knockout";
      constraints.qualifyingknockout = quals._id;
      if (quals.heats[iterator].team.players) {
        constraints.student = quals.heats[iterator].team.players[playya];
        constraints.team = quals.heats[iterator].team._id;
      }
      // console.log(quals.heats.length,iterator);
      StudentStats.saveData(constraints, function (err, response) {
        if (err) {
          callback(err, null);
        } else {
          // console.log(response);
          saveTeam(iterator, ++playya);
        }
      });
    }

    function saveTeam(iterator, playya) {
      if (quals.heats[iterator].team.players.length <= playya) {
        runThroughHeats(++iterator);
      } else {
        saveTeamPlayya(iterator, playya);
      }
    }

    function savePlayers(iterator) {
      var constraints = {};
      constraints.year = quals.year;
      constraints.sport = quals.sport;
      constraints.drawFormat = "Qualifying Knockout";
      constraints.qualifyingknockout = quals._id;
      if (quals.heats[iterator].player) {
        constraints.student = quals.heats[iterator].player;
      }
      // console.log(quals.heats.length, iterator);
      StudentStats.saveData(constraints, function (err, response) {
        if (err) {
          callback(err, null);
        } else {
          runThroughHeats(++iterator);
        }
      });
    }

    function runThroughHeats(iterator) {
      if (quals.participantType == 'player') {
        console.log("in run through heats", quals, iterator, quals.heats.length);
        if (quals.heats.length <= iterator) {
          callback(null, "done");
        } else {
          savePlayers(iterator, 0);
        }
      } else {
        if (quals.heats.length <= iterator) {
          callback(null, "done");
        } else {
          saveTeam(iterator, 0);
        }
      }
    }

    var qualifyingknockout = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, function (err, data2) {
        if (err) {
          callback(err, null);
        } else {
          if (data2.participantType) {

            if (data2.participantType == 'player') {
              if (data2.heats.length == 0) {
                updateStudentsAndCallback(data2);
              } else {
                quals = data2;
                runThroughHeats(0);
              }

            } else {
              if (data2.heats.length == 0) {
                QualifyingKnockout.populate(data2, [{
                  path: 'team1'
                }, {
                  path: 'team2'
                }], function (err, response) {
                  if (err) {
                    callback(err, null);
                  } else {
                    quals = response;
                    selectTeamAndRun();
                  }
                });
              } else {
                QualifyingKnockout.populate(data2, {
                  path: 'heats.team'
                }, function (err, response) {
                  if (err) {
                    callback(err, null);
                  } else {
                    quals = response;
                    runThroughHeats(0);
                  }
                });
              }

            }

          } else {
            callback(null, data2);

          }
        }
      });
    } else {
      QualifyingKnockout.getLastQualifyingKnockout({}, function (err, response) {
        if (err) {
          callback(null, err);
        } else {
          qualifyingknockout.matchid = parseInt(response) + 1;
          qualifyingknockout.save(function (err, data2) {
            if (err) {
              callback(err, null);
            } else {
              if (data2.participantType) {
                if (data2.participantType == 'player') {

                  if (data2.heats.length == 0) {
                    updateStudentsAndCallback(data2);
                  } else {
                    quals = data2;
                    runThroughHeats(0);
                  }

                } else {
                  if (data2.heats.length == 0) {
                    QualifyingKnockout.populate(data2, [{
                      path: 'team1'
                    }, {
                      path: 'team2'
                    }], function (err, response) {
                      if (err) {
                        callback(err, null);
                      } else {
                        quals = response;
                        selectTeamAndRun();
                      }
                    });
                  } else {
                    QualifyingKnockout.populate(data2, {
                      path: 'heats.team'
                    }, function (err, response) {
                      if (err) {
                        callback(err, null);
                      } else {
                        quals = response;
                        runThroughHeats(0);
                      }
                    });
                  }

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
  getAll: function (data, callback) {
    QualifyingKnockout.find({
      sport: data.sport
    }).populate('player1', "name ").populate('player2', "name").populate('sport').populate('team1', 'name').populate('team2', 'name').exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        if (err) {
          callback(err, null);
        } else {
          callback(null, deleted);
        }
      }
    });
  },
  deleteData: function (data, callback) {
    QualifyingKnockout.findOneAndRemove({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.remove({
          drawFormat: "Qualifying Knockout",
          qualifyingknockout: data._id
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
  getLastQualifyingKnockout: function (data, callback) {
    QualifyingKnockout.find({}, {
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
    QualifyingKnockout.findOne({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('sport').populate('heats.player').populate('heats.team').populate('team1').populate('team2').populate('player1').populate('player2');
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
    QualifyingKnockout.find({
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
        if (data.qualifyingknockout.length !== 0) {
          var nedata;
          nedata = _.remove(found, function (n) {
            var flag = false;
            _.each(data.qualifyingknockout, function (n1) {
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
