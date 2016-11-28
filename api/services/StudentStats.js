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
  sport: {
    type: Schema.Types.ObjectId,
    ref: 'Sport'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  drawFormat: String,
  knockout: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  },
  heat: {
    type: Schema.Types.ObjectId,
    ref: 'Heat'
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League'
  },
  swissleague: {
    type: Schema.Types.ObjectId,
    ref: 'SwissLeague'
  },
  leagueknockout: {
    type: Schema.Types.ObjectId,
    ref: 'LeagueKnockout'
  }
});
module.exports = sails.mongoose.model('StudentStats', schema);
var models = {
  saveData: function(data, callback) {
    var studentstats = this(data);
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
      if (data.student !== "" && data.student !== undefined && data.student !== null) {
        var isexistent = {};
        isexistent = {
          student: data.student,
          year: data.year,
          drawFormat: data.drawFormat,
          sport: data.sport
        };
        StudentStats.populate(data, {
          path: 'student'
        }, function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            // console.log(response);
            data.school = response.student.school;
            if (data.drawFormat == "Knockout") {
              isexistent.knockout = data.knockout;
            } else if (data.drawFormat == "Heats") {
              isexistent.heat = data.heat;
            }else if(data.drawFormat  == "League"){
              isexistent.league = data.league;
            }else if(data.drawFormat == 'Swiss League'){
              isexistent.swissleague = data.swissleague;
            }else if(data.drawFormat == 'League cum Knockout'){
              isexistent.leagueknockout = data.leagueknockout;
            }
            StudentStats.findOneAndUpdate(isexistent, {
              $setOnInsert: data
            }, {
              upsert: true,
              new: true
            }, function(err, inserted) {
              if (err) {
                callback(err, null);
              } else {
                // console.log(inserted);
                StudentStats.populate(inserted, [{
                  path: 'sport'
                }, {
                  path: 'student',
                  populate: {
                    path: 'school'
                  }
                }], function(err, response) {
                  if (err) {
                    callback(err, null);
                  } else {
                    var constraints = {
                      year: response.year,
                      "sportslist._id": response.sport.sportslist._id,
                      "student": response.student._id,
                      "agegroup._id": response.sport.agegroup._id
                    };
                    if (response.sport.firstcategory && response.sport.firstcategory._id) {
                      constraints["firstcategory._id"] = response.sport.firstcategory._id;
                    }
                    if (response.school) {
                      StudentSport.findOneAndUpdate(constraints, {
                        $setOnInsert: {
                          student: response.student._id,
                          year: response.year,
                          sportslist: response.sport.sportslist,
                          agegroup: response.sport.agegroup,
                          firstcategory: response.sport.firstcategory,
                          secondcategory: response.sport.secondcategory,
                          "school._id": response.student.school._id,
                          "school.name": response.student.school.name
                        }
                      }, {
                        upsert: true,
                        new: true
                      }, function(err, data2) {
                        if (err) {
                          callback(err, null);
                        } else {
                          callback(null, data2);
                        }
                      });
                    } else {
                      callback(null, response);
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        callback(null, {});
      }
    }
  },
  getAll: function(data, callback) {
    StudentStats.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('student', 'name').populate('sport').populate('knockout').populate('team');
  },
  getStudentStatByFilters: function(data, callback) {
    var constraints = {};
    var sportsconstraints = {};
    if (data.student) {
      constraints.student = data.student;
    }
    // console.log(data);
    if (data.category) {
      // console.log("here");
      sportsconstraints['sport.firstcategory.name'] = {
        '$regex': new RegExp(data.category, "i")
      };
    }
    if (data.sport) {
      sportsconstraints["sport.sportslist._id"]=objectid(data.sport);
    }
    if(data.year){
      sportsconstraints['sport.year'] = data.year;
    }
    // console.log("herea",sportsconstraints);
    StudentStats.aggregate([{
      $match: {
        student: objectid(constraints.student)
      }
    }, {
      $lookup: {
        from: 'sports',
        localField: 'sport',
        foreignField: '_id',
        as: 'sport'
      }
    }, {
      $unwind: "$sport"
    }, {
      $match:sportsconstraints
    },{
      $sort:{
        '_id':-1,
        "sport":1
      }
    }]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.populate(data, [{
          path: 'student',
          select: "name"
        }, {
          path: 'school',
          select: "name"
        }, {
          path: "team",
          select: "name"
        }, {
          path: 'knockout',
          populate: [{
            path: 'player1',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'player2',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'team1',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }, {
            path: 'team2',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }]
        },{
          path:'heat',
          populate:[{
            path:'heats.player',
            select:"name profilePic school",
            populate:{
              path:'school',
              select:'name'
            }
          },{
            path:'heats.team',
            select:"name school",
            populate:{
              path:'school',
              select:'name logo'
            }
          }]
        },{
          path:'league',
          populate: [{
            path: 'player1',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'player2',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'team1',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }, {
            path: 'team2',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }]
        }], function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            if(response.length > 0){
              callback(null, response);


            }else{
              callback(response,null);

            }
          }

        });
      }
    });
  },
  getTeamStatByFilters: function(data, callback) {
    var constraints = {};
    var sportsconstraints = {};
    if (data.team) {
      constraints.team = data.team;
    }
    // console.log(data);
    if (data.category) {
      // console.log("here");
      sportsconstraints['sport.firstcategory.name'] = {
        '$regex': new RegExp(data.category, "i")
      };
    }
    if (data.sport) {
      sportsconstraints["sport.sportslist._id"]=objectid(data.sport);

    }
    if(data.year){
      sportsconstraints['sport.year'] = data.year;
    }
    // console.log("herea",sportsconstraints);
    StudentStats.aggregate([{
      $match: {
        team: objectid(constraints.team)
      }
    }, {
      $lookup: {
        from: 'sports',
        localField: 'sport',
        foreignField: '_id',
        as: 'sport'
      }
    }, {
      $unwind: "$sport"
    },{
      $group:{
        _id:{
          knockout : "$knockout",
          heat : "$heat",
          league : "$league"
        },
        "stat":{$first:"$_id"},
        year : {$first:"$year"},
      sport : {$first:"$sport"},
      student : {$first:"$student"},
      school : {$first:"$school"},
      team : {$first:"$team"},
      drawFormat : {$first:"$drawFormat"},
      }
    },{
      $project:{
        "_id":"$stat",
        year:1,
      sport:1,
      student:1,
      school:1,
      team:1,
      drawFormat:1,
      knockout:"$_id.knockout",
      heat:"$_id.heat",
      league:"$_id.league"
      }
    }, {
      $match:sportsconstraints
    },{
      $sort:{
        '_id':-1,
        "sport":1
      }
    }]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.populate(data, [{
          path: 'student',
          select: "name"
        }, {
          path: 'school',
          select: "name"
        }, {
          path: "team",
          select: "name"
        }, {
          path: 'knockout',
          populate: [{
            path: 'player1',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'player2',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'team1',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }, {
            path: 'team2',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }]
        }], function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            if(response.length > 0){
              callback(null, response);


            }else{
              callback(response,null);

            }
          }

        });
      }
    });
  },
  getSchoolStatByFilters: function(data, callback) {
    var studentconstraints = {};
    var sportsconstraints = {};
    if (data.gender) {
      studentconstraints['student.gender'] = data.gender;
    }
    // console.log(data);
    if (data.category) {
      sportsconstraints['sport.firstcategory.name'] = {
        '$regex': new RegExp(data.category, "i")
      };
    }
    if (data.agegroup) {
      sportsconstraints['sport.agegroup.name'] = {
        '$regex': new RegExp(data.agegroup, "i")
      };
    }
    if (data.sport) {
      sportsconstraints["sport.sportslist._id"]=objectid(data.sport);

    }
    if(data.year){
      sportsconstraints['sport.year'] = data.year;
    }
    // console.log("herea",sportsconstraints);
    StudentStats.aggregate([{
      $match: {
        school: objectid(data.school)
      }
    }, {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $unwind: "$student"
    },
    {
      $match : studentconstraints
    },{
      $lookup: {
        from: 'sports',
        localField: 'sport',
        foreignField: '_id',
        as: 'sport'
      }
    },
    {
      $unwind: "$sport"
    },
    {
      $match:sportsconstraints
    },{
      $group:{
        _id:{
          knockout : "$knockout",
          heat : "$heat",
          league : "$league"
        },
        "stat":{$first:"$_id"},
        year : {$first:"$year"},
      sport : {$first:"$sport"},
      student : {$first:"$student"},
      school : {$first:"$school"},
      team : {$first:"$team"},
      drawFormat : {$first:"$drawFormat"},
      }
    },{
      $project:{
        "_id":"$stat",
        year:1,
      sport:1,
      student:1,
      school:1,
      team:1,
      drawFormat:1,
      knockout:"$_id.knockout",
      heat:"$_id.heat",
      league:"$_id.league"
      }
    },{
      $sort:{
        '_id':-1,
        "sport":1
      }
    }]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.populate(data, [{
          path: 'school',
          select: "name"
        }, {
          path: "team",
          select: "name school",
          populate:{
            path:'school',
            select:'name'
          }
        }, {
          path: 'knockout',
          populate: [{
            path: 'player1',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'player2',
            select: "name school",
            populate: {
              path: 'school',
              select: 'name'
            }
          }, {
            path: 'team1',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }, {
            path: 'team2',
            select: "name school players",
            populate:[{
              path: 'school',
              select: 'name'
            },{
              path:'players',
              select:'name'
            }]
          }]
        }], function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            if(response.length > 0){
              callback(null, response);


            }else{
              callback(response,null);

            }
          }

        });
      }
    });
  },
  getDrawUpdatedSports :  function (data,callback) {
    StudentStats.aggregate([{
      $match:{
        year:"2016"
      }
    },{
      $lookup:{
        from:'sports',
       localField: 'sport',
       foreignField: '_id',
       as: 'sport'
      }
    },{
      $unwind:'$sport'
    },
    {
      $match:{
        'sport.sportslist._id': objectid(data.sport)
      }
    },{
      $group:{
        _id:'$sport._id',
        sport:{
          $first:'$sport'
        }
      }
    },{
      $sort:{
        'sport.agegroup.name':1
      }
    }]).exec(function (err,response) {
      if(err){
        callback(err,null);
      }else if(response.length > 0){
            callback(null,response);
      }else{
        console.log(data);
        SportRule.findOne({
          sportid:data.sport
        }).select({
          yearBeforeContent:1
        }).exec(function (err,data) {
          console.log(err,data);
          if(err){
            callback(err,null);
          }else{
            callback(data,null);
          }
        });
      }
    });
  },
  deleteData: function(data, callback) {
    StudentStats.findOneAndRemove({
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
    StudentStats.findOne({
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
    StudentStats.find({
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
        if (data.studentstats.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.studentstats, function(n1) {
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
