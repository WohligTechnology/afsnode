/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var objectid = require("mongodb").ObjectId;
var schema = new Schema({
  year: String,
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School'
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  participantType: {
    type: String
  },
  sport: {
    type: Schema.Types.ObjectId,
    ref: 'Sport'
  },
  isAddedFromTeam: {
    type: Boolean,
    default: false
  },
  medal: Number
});
module.exports = sails.mongoose.model('Medal', schema);
var models = {
  saveData: function(data, callback) {
    var teamstudents = {};

    function updateSingleStudent(tuple) {
      // console.log("tuple", tuple);
      var incConst = {};
      incConst.$inc = {};
      incConst.$inc['totalPoints' + tuple.year] = tuple.points;
      // console.log(incConst);
      Student.update({
        _id: tuple.player
      }, incConst, {

      }, function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          // console.log("data", data);
          School.update({
            _id: tuple.school
          }, incConst, {

          }, function(err, data) {
            if (err) {
              callback(err, null);
            } else {
              // console.log(data);
              callback(null, data);
            }
          });
        }
      });
    }

    function addStudent(singl) {
      var constraints = {};
      constraints.year = teamstudents.year;
      constraints.participantType = 'player';
      // constraints.school = teamstudents.school;
      constraints.sport = teamstudents.sport;
      constraints.medal = teamstudents.medal;
      constraints.points = teamstudents.points;
      constraints.player = teamstudents.team.players[singl];
      // constraints.team = teamstudents.team._id;
      constraints.isAddedFromTeam = true;
      // console.log("constraints", constraints);
      var incConst = {};
      incConst.$inc = {};
      incConst.$inc['totalPoints' + constraints.year] = constraints.points;
      medal = new Medal(constraints);
      medal.save(function(err, added) {
        if (err) {
          callback(err, null);
        } else {
          /// update code
          Student.update({
            _id: constraints.player
          }, incConst, {

          }, function(err, resp) {
            if (err) {
              callback(err, null);
            } else {
              runThroughStudents(++singl);
            }
          });
        }
      });
    }

    function runThroughStudents(iterator) {
      // console.log(teamstudents);
      if (teamstudents.team.players.length <= iterator) {
        // runThroughHeats(++iterator);
        callback(null, "done");
      } else {
        addStudent(iterator);
      }
    }

    function updateTeamsAndAddStudents(tuple) {
      var incConst = {};
      incConst.$inc = {};
      incConst.$inc['totalPoints' + tuple.year] = tuple.points;
      Medal.populate(tuple, {
        path: 'team'
      }, function(err, expanded) {
        School.update({
          _id: tuple.school
        }, incConst, {

        }, function(err, data) {
          if (err) {
            callback(err, null);
          } else {
            teamstudents = expanded;
            // console.log("teamstudents", teamstudents);

            runThroughStudents(0);
            // callback(null,data);
          }
        });
      });
    }
    var medal = this(data);
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
      // console.log(data);
      Medal.populate(data, [{
        path: 'player'
      }, {
        path: 'team'
      }], function(err, expanded) {
        if (err) {
          callback(err, null);
        } else {
          // console.log(expanded);
          // console.log(data);
          if (data.participantType) {
            if (data.participantType == "player") {
              data.school = expanded.player.school;
            } else {
              data.school = expanded.team.school;
            }
          }
          data[data.participantType] = data[data.participantType]._id;
          // console.log(data);
          medal = new Medal(data);
          medal.save(function(err, data3) {
            if (err) {
              callback(err, null);
            } else {
              if (data.medal) {
                if (data.medal == 1) {
                  expanded.points = 5;
                } else if (data.medal == 2) {
                  expanded.points = 3;
                } else if (data.medal == 3) {
                  expanded.points = 2;
                }
              }
              if (data.participantType) {
                if (data.participantType == "player") {
                  updateSingleStudent(expanded);
                  console.log("player");
                } else {
                  updateTeamsAndAddStudents(expanded);
                }
              }
            }
          });
        }
      });
    }
  },
  countOneSchoolMedal: function(data, callback) {
    // console.log(data);
    Medal.aggregate([{
      $match: {
        school: objectid(data.school),
        isAddedFromTeam: false,
        year: data.year
      }
    }, {
      $group: {
        _id: "$medal",
        "count": {
          $sum: 1
        }
      }
    }, {
      $sort: {
        "_id": 1
      }
    }]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        if (data.length > 0) {
          var medalRepresentation = {};
          if (_.find(data, function(key) {
              return key._id == 1;
            })) {
            medalRepresentation.gold = _.find(data, function(key) {
              return key._id == 1;
            }).count;
          }

          if (_.find(data, function(key) {
              return key._id == 2;
            })) {
            medalRepresentation.silver = _.find(data, function(key) {
              return key._id == 2;
            }).count;
          }

          if (_.find(data, function(key) {
              return key._id == 3;
            })) {
            medalRepresentation.bronze = _.find(data, function(key) {
              return key._id == 3;
            }).count;
          }

          callback(null, medalRepresentation);
        } else {
          callback({}, null);
        }
      }
    });
  },
  countOneStudentMedal: function(data, callback) {
    Medal.aggregate([{
      $match: {
        player: objectid(data.student),
        year: data.year
      }
    }, {
      $group: {
        _id: "$medal",
        "count": {
          $sum: 1
        }
      }
    }, {
      $sort: {
        "_id": 1
      }
    }]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        if (data.length > 0) {
          var medalRepresentation = {};
          if (_.find(data, function(key) {
              return key._id == 1;
            })) {
            medalRepresentation.gold = _.find(data, function(key) {
              return key._id == 1;
            }).count;
          }

          if (_.find(data, function(key) {
              return key._id == 2;
            })) {
            medalRepresentation.silver = _.find(data, function(key) {
              return key._id == 2;
            }).count;
          }

          if (_.find(data, function(key) {
              return key._id == 3;
            })) {
            medalRepresentation.bronze = _.find(data, function(key) {
              return key._id == 3;
            }).count;
          }

          callback(null, medalRepresentation);
        } else {
          callback({}, null);
        }
      }
    });
  },
  getMedalsBySport: function(data, callback) {
    Medal.aggregate([{
      $match:{
        year:data.year,
        isAddedFromTeam:false
      }
    },{
      $lookup: {
        from: 'sports',
        localField: 'sport',
        foreignField: '_id',
        as: 'sport'
      }
    },{
      $unwind:'$sport'
    }, {
      $match: {
        'sport.sportslist._id': objectid(data.sport)
      }
    },{
      $project:{
        sport:'$sport._id',
        Gold:{
          $cond:{
            if: {
              $eq: ["$medal", 1]
            },
            then: {
              student:"$player",
              team:"$team",
              school:'$school',
              participantType:"$participantType"
            },
            else: {}
          }
        },
        Silver:{
          $cond:{
            if: {
              $eq: ["$medal", 2]
            },
            then: {
              student:"$player",
              team:"$team",
              school:'$school',
              participantType:"$participantType"
            },
            else: {}
          }
        },
        Bronze:{
          $cond:{
            if: {
              $eq: ["$medal", 3]
            },
            then: {
              student:"$player",
              team:"$team",
              school:'$school',
              participantType:"$participantType"
            },
            else: {}
          }
        }
      }
    },{
      $group:{
        _id:"$sport",
        Gold:{
          $addToSet:"$Gold"
        },
        Silver:{
          $addToSet:"$Silver"
        },
        Bronze:{
          $addToSet:"$Bronze"
        }
      }
    },{
      $project: {
        _id:"$_id",
        "Gold": {
          "$setDifference": ["$Gold", [{}]]
        },
        "Silver": {
          "$setDifference": ["$Silver", [{}]]
        },
        "Bronze": {
          "$setDifference": ["$Bronze", [{}]]
        }
      }
    },{
      $unwind:"$Gold"
    },{
      $unwind:"$Silver"
    },{
      $sort:{
        _id:1
      }
    }
  ]).exec(function(err, data) {
      if(err){
        callback(err,null);
      }else if(data.length === 0){
        callback("Not Found",null);
      }else{
        Sport.populate(data,[{
          path:'_id'
        }],function (err,response) {
          if(err){
            callback(err,null);
          }else{
            School.populate(response,[{
              path:'Gold.school',
              select:'name logo'
            },{
              path:'Silver.school',
              select:'name logo'
            },{
              path:'Bronze.school',
              select:'name logo'
            }],function (err,response) {
              if(err){
                callback(err,null);
              }else{
                // callback(null,response2);
                Student.populate(response,[{
                  path:'Gold.student',
                  select:'name profilePic'
                },{
                  path:'Silver.student',
                  select:'name profilePic'
                },{
                  path:'Bronze.student',
                  select:'name profilePic'
                }],function (err,response) {
                  if(err){
                    callback(err,null);
                  }else{
                    Team.populate(response,[{
                      path:'Gold.team',
                      select:'name'
                    },{
                      path:'Silver.team',
                      select:'name'
                    },{
                      path:'Bronze.team',
                      select:'name'
                    }],function (err,response) {
                      if(err){
                        callback(err,null);
                      }else{
                        callback(null,response);
                      }
                    });
                  }
                });
              }
            });
          }
        });

      }
    });
  },
  getAll: function(data, callback) {
    Medal.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getAllBySport: function(data, callback) {
    Medal.find({
      sport: data.sport
    }, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('player').populate('team').populate('sport').populate('school');
  },
  deleteData: function(data, callback) {
    var teamstudents = {};

    function updateStudent(tuple) {
      var incConst = {};
      incConst.$inc = {};
      incConst.$inc['totalPoints' + tuple.year] = (-1) * tuple.points;
      Student.update({
        _id: tuple.player
      }, incConst, {

      }, function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          // console.log("data", data);
          School.update({
            _id: tuple.school
          }, incConst, {

          }, function(err, data) {
            if (err) {
              callback(err, null);
            } else {
              // console.log(data);
              // callback(null,data);
              // console.log(data);
              Medal.findOneAndRemove({
                _id: tuple._id
              }, function(err, deleted) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, deleted);
                }
              });
            }
          });
        }
      });
    }

    function deleteStudent(singl) {
      var constraints = {};
      constraints.year = teamstudents.year;
      constraints.participantType = 'player';
      constraints.school = teamstudents.school;
      constraints.sport = teamstudents.sport;
      constraints.medal = teamstudents.medal;
      constraints.player = teamstudents.team.players[singl];
      constraints.team = teamstudents.team._id;
      // console.log("constraints", constraints);
      // medal = new Medal(constraints);
      Medal.findOneAndRemove(constraints, function(err, deleted) {
        if (err) {
          callback(err, null);
        } else {
          /// update code
          constraints.points = teamstudents.points;
          var incConst = {};
          incConst.$inc = {};
          incConst.$inc['totalPoints' + constraints.year] = (-1) * constraints.points;
          Student.update({
            _id: constraints.player
          }, incConst, {

          }, function(err, resp) {
            if (err) {
              callback(err, null);
            } else {
              runThroughStudents(++singl);
            }
          });
        }
      });
    }

    function runThroughStudents(iterator) {
      // console.log(teamstudents);
      if (teamstudents.team.players.length <= iterator) {
        // runThroughHeats(++iterator);
        Medal.findOneAndRemove({
          _id: teamstudents._id
        }, function(err, deleted) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, deleted);
          }
        });
      } else {
        deleteStudent(iterator);
      }
    }

    function updateTeamsAndAddStudents(tuple) {
      var incConst = {};
      incConst.$inc = {};
      incConst.$inc['totalPoints' + tuple.year] = (-1) * tuple.points;
      Medal.populate(tuple, {
        path: 'team'
      }, function(err, expanded) {
        School.update({
          _id: tuple.school
        }, incConst, {

        }, function(err, data) {
          if (err) {
            callback(err, null);
          } else {
            teamstudents = expanded;
            // console.log("teamstudents", teamstudents);

            runThroughStudents(0);
            // callback(null,data);
          }
        });
      });
    }
    Medal.findOne({
      _id: data._id
    }, function(err, found) {
      if (err) {
        callback(err, null);
      } else {
        if (found.medal) {
          if (found.medal == 1) {
            found.points = 5;
          } else if (found.medal == 2) {
            found.points = 3;
          } else if (found.medal == 3) {
            found.points = 2;
          }
        }
        if (found.participantType == 'player') {
          updateStudent(found);
        } else {
          updateTeamsAndAddStudents(found);
        }
      }
    });
    // Medal.findOneAndRemove({
    //     _id: data._id
    // }, function(err, deleted) {
    //     if (err) {
    //         callback(err, null);
    //     } else {
    //         callback(null, deleted);
    //     }
    // });
  },
  deleteAllMedal: function(data, callback) {
    Medal.remove({}, function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },
  getOne: function(data, callback) {
    Medal.findOne({
      _id: data._id
    }, function(err, deleted) {
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

    var check = new RegExp(data.name, "i");
    checkObj = {
      folder: {
        '$regex': check
      }
    };

    async.parallel([
        function(callback) {
          Medal.count(checkObj).exec(function(err, number) {
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
          Medal.find(checkObj).sort({}).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
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
    Medal.find({
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
        if (data.medal.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.medal, function(n1) {
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
  deleteAllPointData: function(data, callback) {
    Student.update({}, {
      $set: {
        totalPoints2015: 0,
        totalPoints2016: 0,
        totalPoints2017: 0
      }
    }, {
      multi: true
    }, function(err, updated) {
      if (err) {
        callback(err, null);
      } else {
        // console.log(updated);
        // callback(null,data)
        School.update({}, {
          $set: {
            totalPoints2015: 0,
            totalPoints2016: 0,
            totalPoints2017: 0
          }
        }, {
          multi: true
        }, function(err, updated) {
          if (err) {
            callback(err, null);
          } else {
            // console.log(updated);
            callback(null, updated);
          }
        });
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
