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
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "Knockout"
  },
  participantType: {
    type: String,
    default: "player"
  },
  date: {
    type: Date,
    default: Date.now
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
  },
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  resultplayer1: {
    type: String,
  },
  resultteam1: {
    type: String,
  },
  resultplayer2: {
    type: String,
  },
  resultteam2: {
    type: String,
  },
  team1: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  score: {
    type: String,
    default: ""
  },
  video: {
    type: String
  },
  parent1: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  },
  parent2: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  }
});
module.exports = sails.mongoose.model('Knockout', schema);
var models = {
  saveData: function(data, callback) {
    function saveme(details, num, status) {
      var constraints = {};
      constraints.year = details.year;
      constraints.sport = details.sport;
      constraints.drawFormat = "Knockout";
      constraints.knockout = details._id;
      if (status && details.team1) {
        constraints.student = details.team1.players[num];
        constraints.team = details.team1._id;
      } else {
        constraints.student = details.team2.players[num];
        constraints.team = details.team2._id;

      }
      StudentStats.saveData(constraints, function(err, response) {
        if (err) {
          callback(err, null);
        } else {
          num++;
          updatePlayersAndCallback(details, num, status);
        }
      });
    }

    function updatePlayersAndCallback(details, num, status) {
      var firstteam = "";
      var secondteam = "";
      if (details.team1) {
        firstteam = "team1";
        secondteam = "team2";
      } else {
        firstteam = "team2";
        secondteam = "team1";
      }
      if (details[secondteam] !== null && details[secondteam] !== undefined && details[secondteam] !== "" && num >= (details[secondteam].players.length) && status === false) {
        callback(null, "done");
      } else if (num >= (details[firstteam].players.length) && status === true) {
        if (details[secondteam] !== null && details[secondteam] !== undefined && details[secondteam] !== "") {
          saveme(details, 0, false);
        } else {
          callback(null, "done");
        }
      } else {
        saveme(details, num, status);
      }
    }

    function updateParticipantsAndCallback(details) {
      var constraints = {};
      if (details.participantType == "player") {
        constraints.student = details[details.participantType + "1"];
        constraints.year = details.year;
        constraints.sport = details.sport;
        constraints.drawFormat = "Knockout";
        constraints.knockout = details._id;
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
      } else {
        Knockout.populate(details, [{
          path: 'team1'
        }, {
          path: 'team2'
        }], function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            updatePlayersAndCallback(response, 0, true);
          }
        });
      }
    }

    function updateAndCallback(nextRound) {
      // console.log(nextRound);
      delete nextRound.matchid;
      var upsertData = {};
      Knockout.getLastKnockout({}, function(err, response) {
        if (err) {
          callback(err, null);
        } else {
          upsertData.matchid = response + 1;
          Knockout.findOneAndUpdate({
            year: nextRound.year,
            sport: nextRound.sport,
            event: nextRound.event,
            participantType: nextRound.participantType,
            roundno: nextRound.roundno,
            order: nextRound.order
          }, {
            $set: nextRound,
            $setOnInsert: {
              matchid: upsertData.matchid
            }
          }, {
            upsert: true,
            new: true
          }, function(err, data3) {
            if (err) {
              console.log("err");
              callback(err, null);
            } else {
              updateParticipantsAndCallback(data3);
            }
          });
        }
      });
    }
    delete data.matchid;
    var knockout = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, {
        new: true
      }, function(err, data2) {
        if (err) {
          console.log("err");
          callback(err, null);
        } else {
          if (data2 === null) {
            callback(null, data2);
          } else if (data.resultteam1 || data.resultteam2 || data.resultplayer1 || data.resultplayer2) {
            if(data2.round.toUpperCase() == 'Final'.toUpperCase()){
              callback(null,data2);
            }else if(data2.round.toUpperCase() == 'Third Place'.toUpperCase()){
              updateParticipantsAndCallback(data2);
            }else{
              var nomatch = false;
              var nextRound = data2.toObject();
              delete nextRound._id;
              delete nextRound.__v;
              delete nextRound.player1;
              delete nextRound.team1;
              delete nextRound.player2;
              delete nextRound.team2;
              delete nextRound.parent1;
              delete nextRound.parent2;
              delete nextRound.resultplayer1;
              delete nextRound.resultplayer2;
              delete nextRound.resultteam1;
              delete nextRound.resultteam2;
              delete nextRound.score;
              delete nextRound.round;
              delete nextRound.startTime;
              delete nextRound.endTime;
              delete nextRound.video;
              delete nextRound.totalTime;
              var result = {};
              if ((data2['result' + data2.participantType + '1'] == "Won" || data2['result' + data2.participantType + '1'] == "Bye" || data2['result' + data2.participantType + '1'] == "Walkover") && (data2['result' + data2.participantType + '2'] == "Loss" || data2['result' + data2.participantType + '2'] == "No Show")) {
                result['result' + data2.participantType] = data2[data2.participantType + '1'];
              } else if ((data2['result' + data2.participantType + '1'] == "Loss" || data2['result' + data2.participantType + '1'] == "No Show") && (data2['result' + data2.participantType + '2'] == "Won" || data2['result' + data2.participantType + '2'] == "Bye" || data2['result' + data2.participantType + '2'] == "Walkover")) {
                console.log("Loss");
                result['result' + data2.participantType] = data2[data2.participantType + '2'];
              } else {
                nomatch = true;
              }

              if (nomatch) {
                if (data2.participantType == 'player') {
                  Student.find({
                    name: "No Match "
                  }).exec(function(err, response) {
                    if (err) {
                      callback(err, null);
                    } else {
                      //Intelligence coming in 3,2,1 ..
                      result['result' + data2.participantType] = response[0]._id;
                      if (data2.order % 2 === 0) {
                        nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
                        nextRound.parent1 = data2._id;
                      } else {
                        nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
                        nextRound.parent2 = data2._id;
                      }
                      nextRound.order = parseInt(data2.order / 2);
                      nextRound.roundno = nextRound.roundno + 1;
                      //FINISH
                      updateAndCallback(nextRound);
                    }
                  });
                } else {
                  Team.find({
                    name: "No Match "
                  }).exec(function(err, response) {
                    if (err) {
                      callback(err, null);
                    } else {
                      // console.log(response);
                      result['result' + data2.participantType] = response[0]._id;
                      if (data2.order % 2 === 0) {
                        nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
                        nextRound.parent1 = data2._id;
                      } else {
                        nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
                        nextRound.parent2 = data2._id;
                      }
                      nextRound.order = parseInt(data2.order / 2);
                      nextRound.roundno = nextRound.roundno + 1;
                      updateAndCallback(nextRound);
                    }
                  });
                }
              } else {
                if (data2.order % 2 === 0) {
                  nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
                  nextRound.parent1 = data2._id;
                } else {
                  nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
                  nextRound.parent2 = data2._id;
                }
                nextRound.order = parseInt(data2.order / 2);
                nextRound.roundno = nextRound.roundno + 1;
                updateAndCallback(nextRound);
              }
            }
          } else {
            callback(null, data2);
          }
        }
      });
    } else {
      Knockout.getLastKnockout({}, function(err, response) {
        if (err) {
          callback(null, err);
        } else {
          knockout.matchid = parseInt(response) + 1;
          knockout.save(function(err, data2) {
            if (err) {
              callback(err, null);
            } else {
              updateParticipantsAndCallback(data2);
            }
          });
        }
      });

    }
  },
  getAll: function(data, callback) {
    Knockout.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate("Student");
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    var checkObj = {};
    checkObj = {
      'sport': data.sport
    };

    async.parallel([
        function(callback) {
          Knockout.count(checkObj).exec(function(err, number) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (number && number !== "") {
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / 20);
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        },
        function(callback) {
          Knockout.find(checkObj).sort({
            roundno: 1,
            order: 1
          }).skip(20 * (data.pagenumber - 1)).limit(20).populate('player1', "name ").populate('player2', "name").populate('sport').populate("agegroup", "name").populate('team1', 'name').populate('team2', 'name').exec(function(err, data2) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data2 && data2.length > 0) {
              newreturns.data = data2;
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        }
      ],
      function(err, data4) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else if (data4) {
          callback(null, newreturns);
        } else {
          callback(null, newreturns);
        }
      });
  },
  getLastOrder: function(data, callback) {
    Knockout.find({
      year: data.year,
      sport: data.sport,
      event: data.event,
      participantType: data.participantType,
      roundno: data.roundno
    }, {
      _id: 0,
      order: 1
    }).sort({
      order: -1
    }).limit(1).lean().exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback("No such knockout", null);
      } else {
        callback(null, data2[0].order);
      }
    });
  },
  getLastKnockout: function(data, callback) {
    Knockout.find({}, {
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
        // console.log(data2);
        callback(null, data2[0].matchid);
      }
    });
  },
  deleteData: function(data, callback) {
    Knockout.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteKnockoutCompletely: function(data, callback) {
    Knockout.find({
      $or: [{
        _id: data._id
      }, {
        parent1: data._id
      }, {
        parent2: data._id
      }]
    }).exec(function (err,results) {
      if(err){
        callback(err,null);
      }else{
        var knockouts = [];
        _.each(results,function (key) {
          knockouts.push(key._id);
        });
        StudentStats.remove({
              drawFormat: "Knockout",
              knockout: {
                $in : knockouts
              }
            }, function(err, response) {
              if (err) {
                callback(err,null);
              }else{
                Knockout.remove({
                  $or: [{
                    _id: data._id
                  }, {
                    parent1: data._id
                  }, {
                    parent2: data._id
                  }]
                }, function(err, deleted) {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null,deleted);

                  }
                });
              }
            });
        // callback(null,results);
      }
    });

  },
  getOneKnockoutTree: function(data, callback) {
    Knockout.findOne({
      _id: data._id
    }, function(err, response) {
      if (err) {
        callback(err, null);
      } else {
        var populatequery = [{
          path: 'parent1',
          populate: [{
            path: 'parent2',
            populate: [{
              path: 'parent2'
            }, {
              path: 'parent1'
            }]
          }, {
            path: 'parent1',
            populate: [{
              path: 'parent2'
            }, {
              path: 'parent1'
            }]
          }]
        }, {
          path: 'parent2',
          populate: [{
            path: 'parent2',
            populate: [{
              path: 'parent2'
            }, {
              path: 'parent1'
            }]
          }, {
            path: 'parent1',
            populate: [{
              path: 'parent2'
            }, {
              path: 'parent1'
            }]
          }]
        }];
        Knockout.populate(response, populatequery, function(err, data2) {
          if (err) {
            callback(err, null);
          } else {

            callback(null, data2);

          }
        });
        // callback(null, response);
      }
    }).populate('player1', "name").populate('player2', "name").populate('resultplayer', "name");
  },
  getOne: function(data, callback) {
    Knockout.findOne({
      _id: data._id
    }, function(err, response) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    }).populate('player1').populate('player2').populate('sport').populate('team1').populate('team2');
  },
  getSportRoundKnockout: function (data,callback) {
    var asyncReturns = {};
    async.parallel([
      function (callback) {
        Sport.getOne({
          _id:data.sport
        },function (err,data) {
          if(err){
            callback(err,null);
          }else{
            asyncReturns.sport = data;
            callback(null,data);
          }
        });
      },
      function (callback) {
        Medal.find({
          sport:data.sport
        }).sort({
          medal:1
        }).lean().exec(function (err,data) {
          if(err){
            callback(err,null);
          }else{
            Medal.populate(data,[{
              path:"player",
              select:"name profilePic"
            },{
              path:"team",
              select:"name"
            },{
              path:"school",
              select:"name logo"
            }],function (err,response) {
              if(err){
                callback(err,null);
              }else{
                asyncReturns.medals = response;
                callback(null,response);
              }
            });

          }
        });
      },function (callback) {
        Knockout.find({
          sport:data.sport
        }).sort({
          roundno:1,
          order:1
        }).populate('player1', "name profilePic school").populate('player1.school',"name").populate('player2', "name profilePic school").populate('sport').populate("agegroup", "name").populate('team1', 'name').populate('team2', 'name school.name school.logo').lean().exec(function (err,data) {
          if(err){
            callback(err,null);
          }else{
            asyncReturns.knockouts = data;
            callback(null,data);
          }
        });
      }
    ],function (err,data) {
      if (err) {
        callback(err,null);
      } else {
        callback(null,asyncReturns);
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
