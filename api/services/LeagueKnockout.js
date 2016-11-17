/**
 * LeagueKnockout.js
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
    default: "League cum Knockout"
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
  video:{
    type:String
  }
});
module.exports = sails.mongoose.model('LeagueKnockout', schema);
var models = {
  saveData: function(data, callback) {
    var leagueknockouts = {};
    var leagueknockout = this(data);
    function updateStudentsAndCallback(details) {
      var constraints = {};
      constraints.student = details[details.participantType + "1"];
      constraints.year = details.year;
      constraints.sport = details.sport;
      constraints.drawFormat = "League cum Knockout";
      constraints.leagueknockout = details._id;
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
    function savePlayya(team,iterator) {
      var constraints = {};
      constraints.year = leagueknockouts.year;
      constraints.sport = leagueknockouts.sport;
      constraints.drawFormat = "League cum Knockout";
      constraints.leagueknockout = leagueknockouts._id;
      if (leagueknockouts['team'+team].players) {
        constraints.student = leagueknockouts['team'+team].players[iterator];
        constraints.team =leagueknockouts['team'+team]._id;
      }
      StudentStats.saveData(constraints, function(err, response) {
        if (err) {
          callback(err, null);
        } else {
          // console.log(response);
          runThroughTeam(team, ++iterator);
        }
      });
    }
     function runThroughTeam(team,iterator) {
       var otherteam = (team === 1)?2:1;
       if(leagueknockouts['team'+team].players.length <= iterator){
         if(leagueknockouts['team'+otherteam].players.length > 0){
           leagueknockouts['team'+team].players = [];
           runThroughTeam(otherteam,0);
         }else{
           callback(null,"done");
         }
       }else{
         savePlayya(team,iterator);
       }
     }
    function selectTeamAndRun() {
      if(leagueknockouts.participantType == 'team'){
        if(leagueknockouts.team1 && leagueknockouts.team1.players.length > 0){
          runThroughTeam(1,0);
        }else{
          runThroughTeam(2,0);
        }
      }
    }
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          if (data2.participantType) {
            if (data2.participantType == 'player') {
              updateStudentsAndCallback(data2);

            } else {
              LeagueKnockout.populate(data2, [{
                path: 'team1'
              },{
                  path:'team2'
              }], function(err, response) {
                if (err) {
                  callback(err, null);
                } else {
                  leagueknockouts = response;
                  selectTeamAndRun();
                }
              });
            }
          } else {
            callback(null, data2);
          }
        }
      });
    } else {
      LeagueKnockout.getLastLeagueKnockout({}, function(err, response) {
        if (err) {
          callback(null, err);
        } else {
          leagueknockout.matchid = parseInt(response) + 1;
          leagueknockout.save(function(err, data2) {
            if (err) {
              callback(err, null);
            } else {
              if (data2.participantType) {
                if (data2.participantType == 'player') {
                  updateStudentsAndCallback(data2);

                } else {
                  LeagueKnockout.populate(data2, [{
                    path: 'team1'
                  },{
                      path:'team2'
                  }], function(err, response) {
                    if (err) {
                      callback(err, null);
                    } else {
                      leagueknockouts = response;
                      selectTeamAndRun();
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
  getLastLeagueKnockout: function(data, callback) {
    LeagueKnockout.find({}, {
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
  getAll: function(data, callback) {
    LeagueKnockout.find({
      sport: data.sport
    }, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    var checkObj = {};

    var check = new RegExp(data.sport, "i");
    checkObj = {
      'sport': data.sport
    };

    async.parallel([
        function(callback) {
          LeagueKnockout.count(checkObj).exec(function(err, number) {
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
          LeagueKnockout.find(checkObj).sort({
            roundno: 1,
            order: 1
          }).skip(20 * (data.pagenumber - 1)).limit(20).populate('player1', "name ").populate('player2', "name").populate('sport').populate('team1', 'name').populate('team2', 'name').exec(function(err, data2) {
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
  deleteData: function(data, callback) {
    LeagueKnockout.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.remove({
          drawFormat:"LeagueKnockout",
          leagueknockout:data._id
        }, function(err, deleted) {
          if (err) {
            callback(err, null);
          } else {
            callback(null,deleted);

          }
        });
      }
    });
  },
  getOne: function(data, callback) {
    LeagueKnockout.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('player1').populate('player2').populate('sport').populate('team1').populate('team2');
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
    LeagueKnockout.find({
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
        if (data.leagueknockout.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.leagueknockout, function(n1) {
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
  },
  getSportRoundLeagueKnockout: function (data,callback) {
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
        LeagueKnockout.find({
          sport:data.sport
        }).sort({
          order:1
        }).lean().exec(function (err,data) {
          if(err){
            callback(err,null);
          }else{
            LeagueKnockout.populate(data,[{
              path:'player1',
              select:"name profilePic school",
              populate:{
                path:'school',
                select:'name'
              }
            },{
              path:'player2',
              select:"name profilePic school",
              populate:{
                path:'school',
                select:'name'
              }
            },{
              path:'team1',
              select:"name school",
              populate:{
                path:'school',
                select:'name logo'
              }
            },{
              path:'team2',
              select:"name school",
              populate:{
                path:'school',
                select:'name logo'
              }
            }],function (err,response) {
              if (err) {
                callback(err,null);
              } else {
                asyncReturns.leagueknockouts = response;
                callback(null,response);
              }
            });

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
