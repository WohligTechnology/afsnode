/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var mongoose = require('mongoose');
var objectid = require("mongodb").ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
// deepPopulate.initialize(mongoose);
var websiteURL = "http://www.sfanow.in/#/";
var Schema = sails.mongoose.Schema;
// var adminUrl = "http://127.0.0.1:1337/";
var adminUrl = "http://sfa3.wohlig.co.in/";
// var adminUrl = "https://api.sfanow.in/";

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
  status: Boolean,
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
schema.plugin(deepPopulate, {
  populate: {
    'school': {
      select: 'name _id sfaid'
    }
  }
});
module.exports = sails.mongoose.model('Student', schema);
var models = {
  saveData: function (data, callback) {
    if (data.middlename) {
      data.name = data.lastname + " " + data.firstname + " " + data.middlename;
    } else {
      data.name = data.lastname + " " + data.firstname + " ";
    }
    var student = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, function (err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    } else {
      student.timestamp = new Date();
      student.deleteStatus = false;
      Student.getLastId({}, function (err, data3) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          student.sfaid = data3;
          student.save(function (err, data2) {
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
  getLastId: function (data, callback) {
    Student.findOne({}, {
      _id: 0,
      sfaid: 1
    }).sort({
      sfaid: -1
    }).limit(1).lean().exec(function (err, data2) {
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
  forFormSearch: function (data, callback) {
    var studentconstraints = {};
    if (data.sfaid) {
      studentconstraints = {
        'sfaid': data.sfaid
      };
    } else if (data.search) {
      data.search = new RegExp(data.search, "i");
      studentconstraints = {
        'name': {
          '$regex': data.search
        }
      };
    }
    if (data.school) {
      studentconstraints.school = data.school;
    }
    Student.find(studentconstraints).sort({
        id: 1,
        name: 1
      }).limit(20).select({
        name: 1,
        sfaid: 1,
        profilePic: 1
      })
      .lean()
      .exec(function (err, data) {
        if (err) {
          callback(err, null);
        } else if (data.length > 0) {
          callback(null, data);
        } else {
          callback([], null);
        }
      });
  },
  updateProfilePicture: function (data, callback) {
    Student.findOneAndUpdate({
      sfaid: parseInt(data.sfaid)
    }, {
      $set: {
        "profilePic": data.profilePic
      }
    }, {
      new: true
    }, function (err, response) {
      if (err) {
        callback(err, null);
      } else if (response) {
        callback(null, response.firstname + "'s profile updated");
      } else {
        callback("Student with SFAID " + data.sfaid + " not found.", null);

      }
    });
  },
  getAll: function (data, callback) {
    Student.find({}, {}, {}).sort({
      sfaid: -1
    }).exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getStud: function (data, callback) {
    Student.find({}, {
      _id: 1,
      name: 1,
      sfaid: 1
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function (data, callback) {
    Student.findOneAndRemove({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  hide: function (data, callback) {
    Student.findOneAndUpdate({
      _id: data._id
    }, {
      $set: {
        deleteStatus: data.status
      }
    }, function (err, deleted) {
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
  getOne: function (data, callback) {
    Student.findOne({
      _id: data._id
    }).populate("school", "_id name").lean().exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  sendMessageToAll: function (data, callback) {
    var students = [];
    var contacts = [];
    var contactsnew = [];
    var messageConfig = {};

    function sendAlert(index) {
      if (students.length <= index) {
        callback(null, "done");
      } else {
        contacts = [];
        if (students[index].contact === undefined || students[index].contact === '') {
          contacts = [];
        } else {
          contacts = students[index].contact.split(',');
        }
        // removing landlines
        _.remove(contacts, function (key) {
          return key.substring(0, 3) === "222";
        });
        // removing landlines end
        if (contacts.length > 0) {
          Config.shortURL({
            url: websiteURL + "student-profile/" + students[index]._id
          }, function (err, shortURL) {
            if (err) {
              callback(err, null);
            } else {
              messageConfig = {};
              messageConfig.template = "Dear " + students[index].firstname + ", Welcome to Sports For All (SFA), your SFA ID is " + students[index].sfaid + ". Kindly check your participation details on our website. Click the link to your PROFILE PAGE " + shortURL + " In case of any queries call us on 7045684365/66/67 SFA will keep you updated on the match schedules via SMS.";
              messageConfig.contact = contacts[0];
              Config.sendMessage(messageConfig, function (err, data) {
                if (err) {

                } else {

                }
                console.log(students[index].sfaid, messageConfig.contact, messageConfig.template);

                sendAlert(++index);
              });
            }
          });
        } else {
          sendAlert(++index);
        }
      }
    }
    Student.find({
      year: "2016",
      sfaid: {
        $gte: data.sfaid
      }
    }).sort({
      sfaid: 1
    }).select({
      name: 1,
      _id: 1,
      contact: 1,
      sfaid: 1,
      firstname: 1
    }).lean().exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        students = data;
        sendAlert(0);
      }
    });
  },
  getOneStudentByName: function (data, callback) {
    Student.findOne({
      name: data.name
    }).populate("school", "_id name").lean().exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  editStudent: function (data, callback) {
    data.status = true;
    this.findOneAndUpdate({
      _id: data._id
    }, data, {
      new: true
    }, function (err, data2) {
      if (err) {
        callback(err, false);
      } else {
        callback(null, data2);
      }
    });
  },
  findLimited: function (data, callback) {
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
        function (callback) {
          Student.count(checkObj).exec(function (err, number) {
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
        function (callback) {
          Student.find(checkObj).sort({
            sfaid: -1
          }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function (err, data2) {
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
      function (err, data4) {
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
  countContingentStrength: function (data, callback) {
    // var checkObj = {};
    // console.log(data);
    // if (data.school) {
    //   checkObj.school = objectid(data.school);
    // }
    // if (data.year && data.year !== '2015') {
    //   checkObj.year = data.year;
    // }
    // console.log(checkObj);
    // console.log(data);
    StudentSport.aggregate([{
      $match: {
        'school._id': objectid(data.school),
        year: data.year
      }
    }, {
      $group: {
        _id: null,
        student: {
          $addToSet: '$student'
        }
      }
    }, {
      $unwind: '$student'
    }, {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    }, {
      $unwind: "$student"
    }, {
      $group: {
        _id: "$student.gender",
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
    }]).exec(function (err, resp1) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, resp1);
      }
    });
  },
  findStud: function (data, callback) {
    var matchObj = {
      school: data.school,
      lastname: data.lastname,
      firstname: data.firstname,
      middlename: data.middlename
    };
    if (!data.middlename || data.middlename === "") {
      delete matchObj.middlename;
    }
    // console.log(matchObj);
    Student.findOne(matchObj).populate("school", "_id name").lean().exec(function (err, data2) {
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
  searchStudent: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];


    var constraints = {};
    if (data.search) {
      constraints = {
        name: {
          '$regex': new RegExp(data.search, "i")
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
      function (callback) {
        Student.count(constraints).exec(function (err, number) {
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
      function (callback) {
        Student.find(constraints).sort({
          name: 1
        }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).exec(function (err, data2) {
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
    ], function (err, data4) {
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
  countStudent: function (data, callback) {
    Student.count({
      deleteStatus: false
    }).exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
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
    Student.find({
      name: {
        '$regex': check
      }
    }, {
      name: 1,
      _id: 1,
      sfaid: 1
    }).limit(10).exec(function (err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.student.length !== 0) {
          var nedata;
          nedata = _.remove(found, function (n) {
            var flag = false;
            _.each(data.student, function (n1) {
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
  findForDropBySchool: function (data, callback) {
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
      }).limit(10).exec(function (err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.student.length !== 0) {
          var nedata;
          nedata = _.remove(found, function (n) {
            var flag = false;
            _.each(data.student, function (n1) {
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
  findForDropSingle: function (data, callback) {
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
    }).limit(10).exec(function (err, found) {
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
  makeEmptyPayment: function (data, callback) {
    Student.update({

    }, {
      $set: {
        payment: ""
      }
    }, {
      multi: true
    }, function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },
  findStudentBySfaId: function (data, callback) {
    console.log(data);
    Student.findOne({
      sfaid: data.sfaid
    }).exec(function (err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback(null, 1);
      } else {
        callback(null, data2);
      }
    });
  },
  getCertificate: function (body, callback, res) {

    console.log("DATA IN BODY ", body);

    var Model = this;
    var $scope = {};




    var data2 = _.cloneDeep(body);
    //  data2.color ="f-20 cl-text";
    //  data2.image ="cfboxing.jpg";
    //  data2.sportname="Football";
    $scope.data = data2;

    // if(data2.sports==null || data2.sports==undefined || data2.sports=="")
    // {
    //   console.log("IN NO SPORTS");
    //   res.json({
    //     message:"Did not Participated in Any Games"
    //   });

    // }

    var sportArray = [];
    var datainscope = data2.medal;
    var yesarr = [];
    _.each(data2.medal, function (n) {
      // console.log("n",n);

      _.forEach(data2.sports, function (m) {
        console.log(m);
        console.log("SPORTS", n.sport);

        var medal = _.includes(n.sport, m);
        if (medal == true) {
          yesarr.push(n.sport);
        }

        console.log("is TRue", medal);
      });

    });


    var current = data2.sports,
      prev = yesarr,
      isMatch = false,
      missing = null;
    var abc = [];
    var i = 0,
      y = 0,
      lenC = current.length,
      lenP = prev.length;

    for (; i < lenC; i++) {
      isMatch = false;
      for (y = 0; y < lenP; y++) {
        if (current[i] == prev[y]) isMatch = true;
      }
      if (!isMatch) {
        missing = current[i];
        datainscope.push({
          medal: "no",
          sport: current[i],
          isMedal: false
        });
      } // Current[i] isn't in prev
    }

    console.log("YES", yesarr);
    console.log("YES", abc);
    //    var ABC = _.sortBy(data2.sports);
    console.log("ABC", datainscope);


    var pdfArray = [];
    async.eachSeries(datainscope, function (j, callbackAs) {


      //   console.log("AYSN eachSeries",j);

      if (j.isMedal == true) {

        console.log("in IF", j.medal);
        data2.medal = j.medal;
        console.log(j.sport);

        _.each(data2.sports, function (k) {

          // console.log("kk",k);
          if (j.sport == k) {
            console.log("Parti", k);
            //ORANGE

            if (k == "Football") {
              data2.color = "f-20 cl-text";
              data2.image = "cffootball.jpg";
              data2.sportname = "Football";
            } else if (k == "Basketball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfbasketball.jpg";
              data2.sportname = "Basketball";
            } else if (k == "Handball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfhandball.jpg";
              data2.sportname = "Handball";
            } else if (k == "Hockey") {
              data2.color = "f-20 cl-text";
              data2.image = "cfhockey.jpg";
              data2.sportname = "Hockey";
            } else if (k == "Kho Kho") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkhokho.jpg";
              data2.sportname = "Kho Kho";
            } else if (k == "Throwball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfthrowball.jpg";
              data2.sportname = "Throwball";
            } else if (k == "Volleyball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfvolleyball.jpg";
              data2.sportname = "Volleyball";
            } else if (k == "Kabaddi") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkabbadi.jpg";
              data2.sportname = "Kabaddi";
            }

            //BLUE
            else if (k == "Swimming") {
              data2.color = "f-20 cl-text";
              data2.image = "cfswimming.jpg";
              data2.sportname = "Swimming";
            } else if (k == " Water Polo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfwaterpolo.jpg";
              data2.sportname = " Water Polo";
            }

            //GREEN
            else if (k == "Athletics") {
              data2.color = "f-20 cl-text";
              data2.image = "cfathletics.jpg";
              data2.sportname = "Athletics";
            } else if (k == "Carrom") {
              data2.color = "f-20 cl-text";
              data2.image = "cfcarrom.jpg";
              data2.sportname = "Carrom";
            } else if (k == "Chess") {
              data2.color = "f-20 cl-text";
              data2.image = "cfchess.jpg";
              data2.sportname = "Chess";
            }

            //PINK
            else if (k == "Archery") {
              data2.color = "f-20 cl-text";
              data2.image = "cfarchery.jpg";
              data2.sportname = "Archery";
            } else if (k == "Shooting") {
              data2.color = "f-20 cl-text";
              data2.image = "cfshooting.jpg";
              data2.sportname = "Shooting";
            }
            // PURPLE
            else if (k == "Boxing") {
              data2.color = "f-20 cl-text";
              data2.image = "cfboxing.jpg";
              data2.sportname = "Boxing";
            } else if (k == "Fencing") {
              data2.color = "f-20 cl-text";
              data2.image = "cffencing.jpg";
              data2.sportname = "Fencing";
            } else if (k == "Judo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfjudo.jpg";
              data2.sportname = "Judo";
            } else if (k == "Karate") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkarate.jpg";
              data2.sportname = "Karate";
            } else if (k == "Sport MMA") {
              data2.color = "f-20 cl-text";
              data2.image = "cfmma.jpg";
              data2.sportname = "Sport MMA";
            } else if (k == "Taekwondo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfteakwando.jpg";
              data2.sportname = "Taekwondo";
            } else if (k == "Taekwondo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfteakwando.jpg";
              data2.sportname = "Taekwondo";
            }

            //YELLOW
            else if (k == "Badminton") {
              data2.color = "f-20 cl-text";
              data2.image = "cfbadminton.jpg";
              data2.sportname = "Badminton";
            } else if (k == "Squash") {
              data2.color = "f-20 cl-text";
              data2.image = "cfsquash.jpg";
              data2.sportname = "Squash";
            } else if (k == "Table Tennis") {
              data2.color = "f-20 cl-text";
              data2.image = "cftabletennis.jpg";
              data2.sportname = "Table Tennis";
            } else if (k == "Tennis") {
              data2.color = "f-20 cl-text";
              data2.image = "cftennis.jpg";
              data2.sportname = "Tennis";
            }



            if (data2.dob == undefined) {
              console.log("IN UNDEIFNED");
              Config.generatePdf("pdf/medalwithoutage", $scope, function (callback) {
                console.log("IN CERTI API");
                // console.log(callback.name);
                var urlPdf = adminUrl + "api/upload/Certificate?file=" + callback.name;
                console.log("URL", urlPdf);

                pdfArray.push(urlPdf);

                // res.json({
                //   url:urlPdf
                // });

                // console.log("After callback.name");
                // res.send(callback);
              });
            } else {
              console.log("IN DEIFNED");

              if (data2.gender == "Male") {
                data2.group = "Boys";
              } else {
                data2.group = "Girls";
              }
              var ageGroup = data2.ageGroup;
              var gender = data2.group;
              console.log("GENDER", gender);

              console.log("AGEGROUP", ageGroup);
              var detail = ageGroup + " " + gender;
              console.log("DETAILS", detail);

              data2.AGE = detail;
              console.log("AFTER", data2.AGE);

              Config.generatePdf("pdf/c", $scope, function (callback) {
                console.log("IN CERTI API");
                // console.log(callback.name);
                var urlPdf = adminUrl + "api/upload/Certificate?file=" + callback.name;
                console.log("URL", urlPdf);

                pdfArray.push(urlPdf);

                // res.json({
                //   url:urlPdf
                // });

                // console.log("After callback.name");
                // res.send(callback);
              });
            }


          }
        });
      } else {
        console.log("in ELse", j);
        /*  _.each(data2.sports, function (k) {
          // console.log("kk",k);
          if (j.sport == k) {
            console.log("Parti ELSE", k);
            //ORANGE
            // console.log("MEDAL",j.medal);
            if (k == "Football") {
              data2.color = "f-20 cl-text";
              data2.image = "cffootball.jpg";
              data2.sportname = "Football";
            } else if (k == "Basketball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfbasketball.jpg";
              data2.sportname = "Basketball";
            } else if (k == "Handball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfhandball.jpg";
              data2.sportname = "Handball";
            } else if (k == "Hockey") {
              data2.color = "f-20 cl-text";
              data2.image = "cfhockey.jpg";
              data2.sportname = "Hockey";
            } else if (k == "Kho Kho") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkhokho.jpg";
              data2.sportname = "Kho Kho";
            } else if (k == "Throwball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfthrowball.jpg";
              data2.sportname = "Throwball";
            } else if (k == "Volleyball") {
              data2.color = "f-20 cl-text";
              data2.image = "cfvolleyball.jpg";
              data2.sportname = "Volleyball";
            } else if (k == "Kabaddi") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkabbadi.jpg";
              data2.sportname = "Kabaddi";
            }

            //BLUE
            else if (k == "Swimming") {
              data2.color = "f-20 cl-text";
              data2.image = "cfswimming.jpg";
              data2.sportname = "Swimming";
            } else if (k == " Water Polo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfwaterpolo.jpg";
              data2.sportname = " Water Polo";
            }

            //GREEN
            else if (k == "Athletics") {
              data2.color = "f-20 cl-text";
              data2.image = "cfathletics.jpg";
              data2.sportname = "Athletics";
            } else if (k == "Carrom") {
              data2.color = "f-20 cl-text";
              data2.image = "cfcarrom.jpg";
              data2.sportname = "Carrom";
            } else if (k == "Chess") {
              data2.color = "f-20 cl-text";
              data2.image = "cfchess.jpg";
              data2.sportname = "Chess";
            }

            //PINK
            else if (k == "Archery") {
              data2.color = "f-20 cl-text";
              data2.image = "cfarchery.jpg";
              data2.sportname = "Archery";
            } else if (k == "Shooting") {
              data2.color = "f-20 cl-text";
              data2.image = "cfshooting.jpg";
              data2.sportname = "Shooting";
            }
            // PURPLE
            else if (k == "Boxing") {
              data2.color = "f-20 cl-text";
              data2.image = "cfboxing.jpg";
              data2.sportname = "Boxing";
            } else if (k == "Fencing") {
              data2.color = "f-20 cl-text";
              data2.image = "cffencing.jpg";
              data2.sportname = "Fencing";
            } else if (k == "Judo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfjudo.jpg";
              data2.sportname = "Judo";
            } else if (k == "Karate") {
              data2.color = "f-20 cl-text";
              data2.image = "cfkarate.jpg";
              data2.sportname = "Karate";
            } else if (k == "Sport MMA") {
              data2.color = "f-20 cl-text";
              data2.image = "cfmma.jpg";
              data2.sportname = "Sport MMA";
            } else if (k == "Taekwondo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfteakwando.jpg";
              data2.sportname = "Taekwondo";
            } else if (k == "Taekwondo") {
              data2.color = "f-20 cl-text";
              data2.image = "cfteakwando.jpg";
              data2.sportname = "Taekwondo";
            }

            //YELLOW
            else if (k == "Badminton") {
              data2.color = "f-20 cl-text";
              data2.image = "cfbadminton.jpg";
              data2.sportname = "Badminton";
            } else if (k == "Squash") {
              data2.color = "f-20 cl-text";
              data2.image = "cfsquash.jpg";
              data2.sportname = "Squash";
            } else if (k == "Table Tennis") {
              data2.color = "f-20 cl-text";
              data2.image = "cftabletennis.jpg";
              data2.sportname = "Table Tennis";
            } else if (k == "Tennis") {
              data2.color = "f-20 cl-text";
              data2.image = "cftennis.jpg";
              data2.sportname = "Tennis";
            }

            if (data2.dob == undefined) {

              Config.generatePdf("pdf/partiwithoutage", $scope, function (callback) {
                console.log("IN CERTI API");
                // console.log(callback.name);
                var urlPdf = adminUrl + "api/upload/Certificate?file=" + callback.name;
                console.log("URL", urlPdf);
                pdfArray.push(urlPdf);
                // res.json({
                //   url:urlPdf
                // });
                console.log("After callback.name");
                // res.send(callback);
              });
            } else {
              if (data2.gender == "Male") {
                data2.group = "Boys";
              } else {
                data2.group = "Girls";
              }
              var ageGroup = data2.ageGroup;
              var gender = data2.group;
              console.log("GENDER", gender);

              console.log("AGEGROUP", ageGroup);
              var detail = ageGroup + " " + gender;
              console.log("DETAILS", detail);

              data2.AGE = detail;
              console.log("AFTER", data2.AGE);
              Config.generatePdf("pdf/parti", $scope, function (callback) {
                console.log("IN CERTI API");
                // console.log(callback.name);
                var urlPdf = adminUrl + "api/upload/Certificate?file=" + callback.name;
                console.log("URL", urlPdf);
                pdfArray.push(urlPdf);
                // res.json({
                //   url:urlPdf
                // });
                console.log("After callback.name");
                // res.send(callback);
              });

            }


          }
        });
*/
      }

      setTimeout(function () {
        callbackAs();
      }, 5000);



      i++;
    }, function (err) {

      if (err) {
        console.log("Error", err);
      } else {

        console.log("Array of Pdf link", pdfArray);
        callback(null, pdfArray);
      }
    });



  },


};
module.exports = _.assign(module.exports, models);
