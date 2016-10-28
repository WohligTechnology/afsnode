/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var objectid = require("mongodb").ObjectId;

var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  sfaid: Number,
  name: String,
  firstname: String,
  middlename: String,
  lastname: String,
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    index: true
  },
  deleteStatus: Boolean,
  gender: String,
  totalPoints2015: Number,
  totalPoints2016: Number,
  totalPoints2017: Number,
  dob: Date,
  email: String,
  contact: String,
  location: String,
  address: String,
  parentName: String,
  profilePic: {
    type: String,
    default: ""
  },
  blog: Schema.Types.Mixed,
  medals: Schema.Types.Mixed,
  sfaAwards: Schema.Types.Mixed,
  sfaRecords: Schema.Types.Mixed,
  video: {
    type: [{
      video: String
    }],
    index: true
  },
  image: {
    type: [{
      image: String
    }],
    index: true
  },
  dateOfForm: Date,
  hours: String,
  minutes: String,
  timer: String,
  via: String,
  payment: String
});
module.exports = sails.mongoose.model('Student', schema);
var models = {
  saveData: function(data, callback) {
    if (data.middlename) {
      data.name = data.lastname + " " + data.firstname + " " + data.middlename;
    } else {
      data.name = data.lastname + " " + data.firstname + " ";
    }
    var student = this(data);
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
      student.timestamp = new Date();
      student.deleteStatus = false;
      Student.getLastId({}, function(err, data3) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          student.sfaid = data3;
          student.save(function(err, data2) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback(null, data2);
            }
          });
        }
      });
    }
  },
  getLastId: function(data, callback) {
    Student.findOne({}, {
      _id: 0,
      sfaid: 1
    }).sort({
      sfaid: -1
    }).limit(1).lean().exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback(null, 1);
      } else {
        callback(null, data2.sfaid + 1);
      }
    });
  },
  updateProfilePicture: function(data, callback) {
    Student.findOneAndUpdate({
      sfaid: parseInt(data.sfaid)
    }, {
      $set: {
        "profilePic": data.profilePic
      }
    }, {
      new: true
    }, function(err, response) {
      if (err) {
        callback(err, null);
      } else if (response) {
        callback(null, response.firstname + "'s profile updated");
      } else {
        callback("Student with SFAID " + data.sfaid + " not found.", null);

      }
    });
  },
  getAll: function(data, callback) {
    Student.find({}, {}, {}).sort({
      sfaid: -1
    }).exec(function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getStud: function(data, callback) {
    Student.find({}, {
      _id: 1,
      name: 1,
      sfaid: 1
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function(data, callback) {
    Student.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  hide: function(data, callback) {
    Student.findOneAndUpdate({
      _id: data._id
    }, {
      $set: {
        deleteStatus: data.status
      }
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  // deleteAll: function(data, callback) {
  //   Student.remove({}, function(err, deleted) {
  //     if (err) {
  //       callback(err, null);
  //     } else {
  //       callback(null, deleted);
  //     }
  //   });
  // },
  getOne: function(data, callback) {
    Student.findOne({
      _id: data._id
    }).populate("school", "_id name").lean().exec(function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getOneStudentByName: function(data, callback) {
    console.log(data);
    Student.findOne({
      name: data.name
    }).populate("school", "_id name").lean().exec(function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  editStudent: function(data, callback) {
    data.status = true;
    this.findOneAndUpdate({
      _id: data._id
    }, data, function(err, data2) {
      if (err) {
        callback(err, false);
      } else {
        callback(null, data2);
      }
    });
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    var checkObj = {};
    if (data.sfaid) {
      data.sfaid = parseInt(data.sfaid);
      checkObj = {
        sfaid: data.sfaid
      };
    } else if (data.name) {
      var check = new RegExp(data.name, "i");
      checkObj = {
        name: {
          '$regex': check
        }
      };
    } else {
      checkObj = {};
    }
    async.parallel([
        function(callback) {
          Student.count(checkObj).exec(function(err, number) {
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
          Student.find(checkObj).sort({
            sfaid: -1
          }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
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
  countContingentStrength: function(data, callback) {
    var checkObj = {};
    console.log(data);
    if (data.school) {
      checkObj.school = objectid(data.school);
    }
    if (data.year && data.year !== '2015') {
      checkObj.year = data.year;
    }
    // console.log(checkObj);
    Student.aggregate([{
      $match: checkObj
    }, {
      $group: {
        _id: "$gender",
        count: {
          $sum: 1
        }
      }
    }, {
      $project: {
        "_id": "$_id",
        "Boys": {
          $cond: {
            if: {
              $eq: ["$_id", "Boys"]
            },
            then: "$count",
            else: 0
          }
        },
        "Girls": {
          $cond: {
            if: {
              $eq: ["$_id", "Girls"]
            },
            then: "$count",
            else: 0
          }
        }
      }
    }, {
      $group: {
        "_id": null,
        "Boys": {
          $max: "$Boys"
        },
        "Girls": {
          $max: "$Girls"
        }
      }
    }]).exec(function(err, resp1) {
      if (err) {
        callback(err, null);
      } else {
          callback(null, resp1);
      }
    });
  },
  findStud: function(data, callback) {
    var matchObj = {
      school: data.school,
      lastname: data.lastname,
      firstname: data.firstname,
      middlename: data.middlename
    };
    if (!data.middlename || data.middlename === "") {
      delete matchObj.middlename;
    }
    console.log(matchObj);
    Student.findOne(matchObj).populate("school", "_id name").lean().exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback({
          message: "Not found"
        }, null);
      } else {
        callback(null, data2);
      }
    });
  },
  searchStudent: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];

    var check = new RegExp(data.search, "i");
    var constraints = {};
    if (data.search) {
      constraints = {
        name: {
          '$regex': check
        },
        deleteStatus: false
      };
    } else {
      constraints = {
        sfaid: data.sfaid,
        deleteStatus: false
      };
    }
    data.pagenumber = parseInt(data.pagenumber);
    data.pagesize = parseInt(data.pagesize);
    async.parallel([
      function(callback) {
        Student.count(constraints).exec(function(err, number) {
          if (err) {
            console.log(err);
            callback(err, null);
          } else if (number && number !== "") {
            newreturns.total = number;
            newreturns.totalpages = Math.ceil(number / data.pagesize);
            callback(null, newreturns);
          } else {
            callback(null, newreturns);
          }
        });
      },
      function(callback) {
        Student.find(constraints).sort({
          name: 1
        }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function(err, data2) {
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
    ], function(err, data4) {
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
  countStudent: function(data, callback) {
    Student.count({
      deleteStatus: false
    }).exec(function(err, deleted) {
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
    Student.find({
      name: {
        '$regex': check
      }
    }, {
      name: 1,
      _id: 1,
      sfaid: 1
    }).limit(10).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.student.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.student, function(n1) {
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
  findForDropBySchool: function(data, callback) {
    var returns = [];
    var exit = 0;
    var exitup = 1;
    var check = new RegExp(data.search, "i");
    var constraints = {};
    if (data.search) {
      constraints = {
        name: {
          '$regex': check
        },
        school: data.school
      };
    } else {
      constraints = {
        sfaid: data.sfaid,
        school: data.school
      };
    }

    function callback2(exit, exitup, data) {
      if (exit == exitup) {
        callback(null, data);
      }
    }
    Student.find(
      constraints, {
        name: 1,
        _id: 1,
        sfaid: 1
      }).limit(10).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.student.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.student, function(n1) {
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
  findForDropSingle: function(data, callback) {
    var returns = [];
    var exit = 0;
    var exitup = 1;
    var check = new RegExp(data.search, "i");
    var constraints = {};
    if (data.search) {
      constraints = {
        name: {
          '$regex': check
        },
        school: data.school
      };
    } else {
      constraints = {
        sfaid: data.sfaid,
        school: data.school
      };
    }

    function callback2(exit, exitup, data) {
      if (exit == exitup) {
        callback(null, data);
      }
    }
    Student.find(constraints, {
      name: 1,
      _id: 1,
      sfaid: 1
    }).limit(10).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;

        returns = returns.concat(found);
        callback2(exit, exitup, returns);
      } else {
        callback([], null);
      }
    });
  },
  makeEmptyPayment: function(data, callback) {
    Student.update({
      payment: "Unpaid"
    }, {
      $set: {
        payment: ""
      }
    }, {
      multi: true
    }, function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
