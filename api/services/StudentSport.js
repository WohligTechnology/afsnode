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
  sportslist: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'SportsList'
    },
    name: String,
    sporttype: String

  },
  agegroup: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Agegroup'
    },
    name: String

  },
  firstcategory: {

    _id: {
      type: Schema.Types.ObjectId,
      ref: 'FirstCategory'
    },
    name: String

  },
  secondcategory: {

    _id: {
      type: Schema.Types.ObjectId,
      ref: 'SecondCategory'
    },
    name: String

  },
  thirdcategory: {

    _id: {
      type: Schema.Types.ObjectId,
      ref: 'ThirdCategory'
    },
    name: String

  },
  medals: Schema.Types.Mixed,
  school: {

    _id: {
      type: Schema.Types.ObjectId,
      ref: 'School'
    },
    name: String

  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }
});
module.exports = sails.mongoose.model('StudentSport', schema);
var models = {
  saveData: function(data, callback) {
    var studentsport = this(data);
    if (data._id) {
      // console.log(data);
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
      studentsport.save(function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    }
  },
  saveDataObjectId: function(data, callback) {
    var sport = this(data);
    if (data._id) {
      if (data.sportslist) {
        data.sportslist._id = objectid(data.sportslist._id);
      }
      if (data.agegroup) {
        data.agegroup._id = objectid(data.agegroup._id);
      }
      if (data.firstcategory) {
        data.firstcategory._id = objectid(data.firstcategory._id);
      }
      if (data.secondcategory) {
        data.secondcategory._id = objectid(data.secondcategory._id);
      }
      if (data.thirdcategory) {
        data.thirdcategory._id = objectid(data.thirdcategory._id);
      }
      if (data.school) {
        data.school._id = objectid(data.school._id);
      }
      if (data.student) {
        data.student = objectid(data.student);
      }
      this.update({
        _id: data._id
      }, sport, {}, function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          // console.log(data2);
          callback(null, data2);
        }
      });
    } else {
      sport.save(function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    }
  },
  getSchoolSportByGender: function(data, callback) {
    var newreturns = {};
    async.parallel([
        function(callback) {
          StudentSport.aggregate([{
              $match: {
                "school._id": objectid(data._id),
                "year": data.year
              }
            }, {
              $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student'
              }
            }, {
              $unwind: "$student"
            },{
              $group:{
                _id:{
                  student:"$student._id",
                  gender:"$student.gender",
                },
                "sportslist":{
                  $addToSet:"$sportslist._id"
                }
              }
            },{
              $unwind:"$sportslist"
            },{
              $group: {
                _id: {
                  sport: "$sportslist",
                  gender: "$_id.gender"
                },
                "count": {
                  $sum: 1
                }
              }
            }, {
              $group: {
                "_id": "$_id.sport",
                "gender": {
                  $addToSet: {
                    name: "$_id.gender",
                    "count": "$count"
                  }
                }
              }
            }
          ]).exec(function(err, response) {
            if (err) {
              callback(err, null);
            } else {
              SportsList.populate(response, {
                path: "_id"
              }, function(err, data) {
                if (err) {
                  callback(err, null);
                } else if(data.length > 0){
                  newreturns.sports = data;
                  callback(null, data);
                }else{
                  newreturns.sports = data;
                  callback(data,null);
                }
              });
            }
          });
        },
        function (callback) {
          var checkObj = {};
          if (data.year) {
            checkObj = {
              year: data.year
            };
          }
          if(data._id){
            checkObj.school = data._id;
          }
          Student.countContingentStrength(checkObj,function (err,data) {
            if(err){
              callback(err,null);
            }else{
              newreturns.gender=data[0];
              callback(null,data);
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
  getAll: function(data, callback) {
    StudentSport.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function(data, callback) {
    StudentSport.findOneAndRemove({
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
    StudentSport.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getFirstCategoryFromSport: function(data, callback) {
    Sport.aggregate([{
      $match: {
        'sportslist._id': objectid(data.sport)
      }
    }, {
      $group: {
        _id: null,
        category: {
          $addToSet: "$firstcategory"
        }
      }
    }, {
      $project: {
        category: 1
      }
    }]).exec(function(err, response) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    });
  },
  // getSportCategoryFromStudent: function () {
  //   StudentSport.aggregate([{
  //     $match:{
  //       student:data.
  //     }
  //   }]).exec(function (err,data) {
  //
  //   });
  // },
  getStudentsbySport: function(data, callback) {

    var studentconstraints = {};
    if (data.sfaid) {
      studentconstraints = {
        $match: {
          'student.sfaid': data.sfaid
        }
      };
    } else {
      data.search = new RegExp(data.search, "i");
      studentconstraints = {
        $match: {
          'student.name': {
            '$regex': data.search
          }
        }
      };
    }
    if (data.gender) {
      studentconstraints.$match['student.gender'] = data.gender;
    }
    // console.log(studentconstraints);
    // console.log({
    //   $match: {
    //     'sportslist._id': objectid(data.sport),
    //     'year': data.year
    //   }
    // });
    StudentSport.aggregate([{
      $match: {
        'sportslist._id': objectid(data.sport),
        'year': data.year
      }
    }, {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    }, {
      $unwind: '$student'
    }, studentconstraints, {
      $project: {
        _id: 0,
        student: 1
      }
    }, {
      $limit: 10
    }]).exec(function(err, data2) {
      // console.log(data2);
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (data2 && data2.length > 0) {
        // StudentSport.populate(data2,{
        //   path:"student"
        // },function (err,data) {
        //   if(err){
        //     callback(err, null);
        //   }else{
        //     data = _.map(data,function (key) {
        //       return key.student;
        //     });
        //     callback(null, data);
        //
        //   }
        // });
        data2 = _.map(data2, function(key) {
          return key.student;
        });
        callback(null, data2);
      } else {
        callback({}, null);
      }
    });
  },
  getStudentsbySportwithExclude: function(data, callback) {
    var studentconstraints = {};
    if (data.sfaid) {
      studentconstraints = {
        $match: {
          'student.sfaid': data.sfaid
        }
      };
    } else {
      data.search = new RegExp(data.search, "i");
      studentconstraints = {
        $match: {
          'student.name': {
            '$regex': data.search
          }
        }
      };
    }
    if (data.gender) {
      studentconstraints.$match['student.gender'] = data.gender;
    }
    // console.log(studentconstraints);
    console.log({
      'sportslist._id': objectid(data.sport),
      'year': data.year
    });
    StudentSport.aggregate([{
      $match: {
        'sportslist._id': objectid(data.sport),
        'year': data.year
      }
    }, {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    }, {
      $unwind: '$student'
    }, studentconstraints, {
      $project: {
        _id: 0,
        student: 1
      }
    }, {
      $limit: 10
    }]).exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (data2 && data2.length > 0) {
        data2 = _.map(data2, function(key) {
          return key.student;
        });
        callback(null, data2);
      } else {
        callback({}, null);
      }
    });
  },
  getSports: function(data, callback) {
    StudentSport.find({
      student: data.student
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getSportsPopulated: function(data, callback) {
    console.log(data);
    StudentSport.aggregate([{
      $match: {
        student: objectid(data.student),
        year: data.year
      }
    }, {
      $group: {
        _id: "$sportslist._id",
        sports:{
          $addToSet:{
            year:"$year",
            sportslist:"$sportslist",
            agegroup:"$agegroup",
          firstcategory:"$firstcategory",
          secondcategory:"$secondcategory",
          thirdcategory:"$thirdcategory",
          medals:"$medals",
          school:"$school",
          student:"$student",
          }
        }
      }
    }, {
      $project: {
        "_id": 0,
        "sport": "$_id",
        sports:1

      }
    }
  ]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        SportsList.populate(data, {
          path: "sport"
        }, function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            if (response.length > 0) {
              var sp = [];
              var newob = {};
               _.each(response,function (key) {
                 newob = {};
                 newob = _.clone(key.sport.toObject());
                 newob.sports=_.clone(key.sports);
                 sp.push(newob);
             });
              callback(null, sp);

            } else {
              callback([], null);

            }
          }
        });
      }
    });
  },
  getStudentBio: function(data, callback) {
    StudentSport.aggregate([{
      $match: {
        student: objectid(data.student),
        year: data.year
      }
    }, {
      $group: {
        _id: "$sportslist._id",
        sports:{
          $addToSet:{
            year:"$year",
            sportslist:"$sportslist",
            agegroup:"$agegroup",
          firstcategory:"$firstcategory",
          secondcategory:"$secondcategory",
          thirdcategory:"$thirdcategory",
          medals:"$medals",
          school:"$school",
          student:"$student",
          }
        }
      }
    }, {
      $project: {
        "_id": 0,
        "sport": "$_id",
        sports:1

      }
    }
  ]).exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        SportsList.populate(data, {
          path: "sport"
        }, function(err, response) {
          if (err) {
            callback(err, null);
          } else {
            if (response.length > 0) {
              var sp = [];
              var newob = {};
               _.each(response,function (key) {
                 newob = {};
                 newob = _.clone(key.sport.toObject());
                 newob.sports=_.clone(key.sports);
                 sp.push(newob);
             });
              callback(null, sp);

            } else {
              callback([], null);

            }
          }
        });
      }
    });
  },
  updateAllStudentSportRef: function(data, callback) {
    StudentSport.find({}, {}, {}, function(err, data) {
      if (err) {

      } else {
        // console.log(data.length);
        async.each(data, function(j, callback1) {

          StudentSport.saveDataObjectId(j, function(err, updated) {
            if (err) {
              console.log(err);
              callback1(err, null);
            } else {
              callback1(null, updated);
            }
          });

        }, function(err) {
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            callback(null, "Done");
          }
        });
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
