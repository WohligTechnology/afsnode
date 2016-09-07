/**
 * StudentSportController
 *
 * @description :: Server-side logic for managing StudentSports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function(req, res) {
    if (req.body) {
      StudentSport.saveData(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getAll: function(req, res) {
    if (req.body) {
      StudentSport.getAll(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getSports: function(req, res) {
    if (req.body) {
      StudentSport.getSports(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getFirstCategoryFromSport: function(req, res) {
    if (req.body) {
      StudentSport.getFirstCategoryFromSport(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getStudentsbySport: function(req, res) {
    if (req.body) {
      StudentSport.getStudentsbySport(req.body, function(err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  deleteData: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        StudentSport.deleteData(req.body, function(err, respo) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: respo
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Id"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getOne: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        StudentSport.getOne(req.body, function(err, respo) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: respo
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Id"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  updateId: function(req, res) {
    StudentSport.find({}, function(err, data2) {
      if (err) {
        console.log(err);
        res.json({
          value: false,
          data: err
        });
      } else {
        function callMe(num) {
          var abc = data2[num];
          if (abc.sportslist) {
            abc.sportslist._id = sails.ObjectID(abc.sportslist._id);
          }
          if (abc.agegroup) {
            abc.agegroup._id = sails.ObjectID(abc.agegroup._id);
          }
          if (abc.firstcategory) {
            abc.firstcategory._id = sails.ObjectID(abc.firstcategory._id);
          }
          if (abc.secondcategory) {
            abc.secondcategory._id = sails.ObjectID(abc.secondcategory._id);
          }
          if (abc.school) {
            abc.school._id = sails.ObjectID(abc.school._id);
          }
          StudentSport.saveData(abc, function(err, data3) {
            if (err) {
              console.log(err);
            } else {
              num++;
              console.log(num);
              if (num == data2.length) {
                res.json({
                  value: true,
                  data: "Done"
                });
              } else {
                callMe(num);
              }
            }
          });
        };
        callMe(0);
      }
    });
  },
  excelDownload: function(req, res) {
    var arr = [];
    StudentSport.aggregate([{
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "student"
      }
    }, {
      $lookup: {
        from: "schools",
        localField: "school._id",
        foreignField: "_id",
        as: "school"
      }
    }, {
      $unwind: "$student"
    }, {
      $unwind: "$school"
    }, {
      $group: {
        _id: "$student._id",
        student: {
          $addToSet: "$student"
        },
        sportslist: {
          $addToSet: "$sportslist"
        },
        school: {
          $addToSet: "$school"
        },
        agegroup: {
          $addToSet: "$agegroup"
        }
      }
    }, {
      $project: {
        _id: 1,
        student: 1,
        school: 1,
        sportslist: {
          $cond: [{
            $eq: ["$sportslist", []]
          }, {}, "$sportslist"]
        },
        agegroup: {
          $cond: [{
            $eq: ["$agegroup", []]
          }, {}, "$agegroup"]
        }
      }
    }]).exec(function(err, found) {
      // res.json({ data: found });

      function callMe(num) {
        var abc = found[num];
        var sport = "";
        var excel = {};
        if (abc.sportslist && abc.sportslist.length > 0) {
          _.each(abc.sportslist, function(x) {
            x = x.name + ", ";
            sport += x;
          });
        } else {
          sport = null;
        }
        excel = {
          "Student Id": abc.student[0].sfaid,
          "Student Name": abc.student[0].name,
          "School Id": abc.school[0].sfaid,
          "School Name": abc.school[0].name,
          "Gender": abc.student[0].gender,
          "Sports": sport
        };
        if (abc.agegroup && abc.agegroup.length > 0) {
          excel["Age Group"] = abc.agegroup[0].name;
        } else {
          excel["Age Group"] = null;
        }
        arr.push(excel);
        num++;
        if (num == found.length) {
          var xls = sails.json2xls(arr);
          var path = "./Student Data.xlsx";
          sails.fs.writeFileSync(path, xls, 'binary');
          var excel = sails.fs.readFileSync(path);
          var mimetype = sails.mime.lookup(path);
          res.set('Content-Type', "application/octet-stream");
          res.set('Content-Disposition', "attachment;filename=" + path);
          res.send(excel);
          console.log(excel);
          setTimeout(function() {
            sails.fs.unlink(path, function(err) {
              console.log(err);
            });
          }, 10000);
        } else {
          callMe(num);
        }
      }
      callMe(0);
    });
  },
  excelDownload2: function(req, res) {
    Student.aggregate([{
      $lookup: {
        from: "studentsports",
        localField: "_id",
        foreignField: "student",
        as: "sports"
      }
    }, {
      $unwind: "$sports"
    }, {
      $group: {
        _id: "$_id",
        studentName: {
          $addToSet: "$name"
        },
        studentId: {
          $addToSet: "$sfaid"
        },
        gender: {
          $addToSet: "$gender"
        },
        sports: {
          $addToSet: "$sports.sportslist.name"
        },
        agegroup: {
          $addToSet: "$sports.agegroup.name"
        },
        schoolName: {
          $addToSet: "$sports.school.name"
        },
        schoolId: {
          $addToSet: "$sports.school.sfaid"
        }
      }
    }, {
      $unwind: "$studentId"
    }, {
      $sort: {
        studentId: 1
      }
    }]).exec(function(err, found) {
      var arr = [];

      function callMe(num) {
        var abc = found[num];
        var sport = "";
        var excel = {};
        if (abc.sports && abc.sports.length > 0) {
          _.each(abc.sports, function(x) {
            x = x + ", ";
            sport += x;
          });
        } else {
          sport = null;
        }
        excel = {
          "Student Id": abc.studentId,
          "Student Name": abc.studentName[0],
          "School Id": abc.schoolId[0],
          "School Name": abc.schoolName[0],
          "Gender": abc.gender[0],
          "Sports": sport
        };
        if (abc.agegroup && abc.agegroup.length > 0) {
          excel["Age Group"] = abc.agegroup[0];
        } else {
          excel["Age Group"] = null;
        }
        arr.push(excel);
        num++;
        if (num == found.length) {
          var xls = sails.json2xls(arr);
          var path = "./Student Data.xlsx";
          sails.fs.writeFileSync(path, xls, 'binary');
          var excel = sails.fs.readFileSync(path);
          var mimetype = sails.mime.lookup(path);
          res.set('Content-Type', "application/octet-stream");
          res.set('Content-Disposition', "attachment;filename=" + path);
          res.send(excel);
          setTimeout(function() {
            sails.fs.unlink(path, function(err) {
              console.log(err);
            });
          }, 10000);
        } else {
          callMe(num);
        }
      }
      callMe(0);
    });
  },
  excelDownloadStudent: function(req, res) {
    StudentSport.aggregate([{
      $match: {
        year: "2016"
      }
    }, {
      $group: {
        _id: "$student",
        sports: {
          $addToSet: {
            "name": "$sportslist.name",
            "agegroup": "$agegroup.name",
            "firstcategory": "$firstcategory.name",
            "secondcategory": "$secondcategory.name"
          }
        }
      }
    }]).exec(function(err, response) {
      Student.populate(response, [{
        path: "_id",
        populate: {
          path: "school",
          select: "sfaid name"
        }
      }], function(err, resp) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          var excelData = [];
          _.each(resp, function(key) {
            var row = {};
            if (key._id) {
              row = {
                "Year": "2016",
                // "_id":key._id._id,
                "SFAID": key._id.sfaid,
                "NAME": key._id.name,
                "VIA": key._id.via,
                "GENDER": key._id.gender,
                "PAYMENT STATUS": key._id.payment,
                "ADDRESS": key._id.address,
                "LOCATION ": key._id.location,
                "EMAIL": key._id.email,
                "CONTACT": key._id.contact,
                "TIME OF FORM": key._id.hours + ":" + key._id.minutes + " " + key._id.timer
              };
              if (key._id.dob) {
                row.DOB = new Date(key._id.dob).getDate() + '/' + (new Date(key._id.dob).getMonth() + 1) + '/' + (key._id.dob).getFullYear();

              }
              if (key._id.dateOfForm) {
                row["DATE OF FORM"] = key._id.dateOfForm.getDate() + '/' + (key._id.dateOfForm.getMonth() + 1) + '/' + key._id.dateOfForm.getFullYear();

              }
              if (key._id.school) {
                row["SCHOOL NAME "] = key._id.school.name;
                row["SCHOOL ID "] = key._id.school.sfaid;
              }
            }

            row["SPORTS '16"] = "";
            row.CATEGORY = "";
            row['SUB CATEGORY'] = "";
            row['AGE GROUP'] = "";
            _.each(key.sports, function(sport) {
              if (sport.name) {
                row["SPORTS '16"] += sport.name + ", ";
              } else {
                row["SPORTS '16"] += "N.A." + ", ";
              }
              if (sport.firstcategory) {
                row.CATEGORY += sport.firstcategory + ", ";
              } else {
                row.CATEGORY += "N.A." + ", ";
              }
              if (sport.secondcategory) {
                row['SUB CATEGORY'] += sport.secondcategory + ", ";
              } else {
                row['SUB CATEGORY'] += "N.A." + ", ";
              }
              if (sport.agegroup) {
                row['AGE GROUP'] += sport.agegroup + ", ";
              } else {
                row['AGE GROUP'] += "N.A." + ", ";
              }

            });
            excelData.push(row);
          });
          excelData = _.sortBy(excelData, function(key) {
            return key.SFAID;
          });
          var xls = sails.json2xls(excelData);
          var folder = "./.tmp/";
          var path = "Students 2016 - " + new Date() + ".xlsx";
          var finalPath = folder + path;
          sails.fs.writeFile(finalPath, xls, 'binary', function(err) {
            if (err) {
              res.callback(err, null);
            } else {
              sails.fs.readFile(finalPath, function(err, excel) {
                if (err) {
                  res.callback(err, null);
                } else {
                  res.set('Content-Type', "application/octet-stream");
                  res.set('Content-Disposition', "attachment;filename=" + path);
                  res.send(excel);
                  sails.fs.unlink(finalPath);
                }
              });
            }
          });
        }
      });
    });
  },
  excelDownloadAllStudent: function(req, res) {
    StudentSport.aggregate([{
      $group: {
        _id: "$student",
        sports: {
          $addToSet: {
            "year": "$year",
            "name": "$sportslist.name",
            "agegroup": "$agegroup.name",
            "firstcategory": "$firstcategory.name",
            "secondcategory": "$secondcategory.name"
          }
        }
      }
    }]).exec(function(err, response) {
      Student.populate(response, [{
        path: "_id",
        populate: {
          path: "school",
          select: "sfaid name"
        }
      }], function(err, resp) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          var excelData = [];
          _.each(resp, function(key) {
            var row = {};
            if (key._id) {
              row = {
                "Year": key._id.year,
                // "_id":key._id._id,
                "SFAID": key._id.sfaid,
                "NAME": key._id.name,
                "VIA": key._id.via,
                "GENDER": key._id.gender,
                "PAYMENT STATUS": key._id.payment,
                "ADDRESS": key._id.address,
                "LOCATION ": key._id.location,
                "EMAIL": key._id.email,
                "CONTACT": key._id.contact,
                "TIME OF FORM": key._id.hours + ":" + key._id.minutes + " " + key._id.timer
              };
              if (key._id.dob) {
                row.DOB = new Date(key._id.dob).getDate() + '/' + (new Date(key._id.dob).getMonth() + 1) + '/' + (key._id.dob).getFullYear();

              }
              if (key._id.dateOfForm) {
                row["DATE OF FORM"] = key._id.dateOfForm.getDate() + '/' + (key._id.dateOfForm.getMonth() + 1) + '/' + key._id.dateOfForm.getFullYear();

              }
              if (key._id.school) {
                row["SCHOOL NAME "] = key._id.school.name;
                row["SCHOOL ID "] = key._id.school.sfaid;
              }
            }
            row["SPORTS '16"] = "";
            row["CATEGORY '16"] = "";
            row["SUB CATEGORY '16"] = "";
            row["AGE GROUP ' 16"] = "";
            row["SPORTS '15"] = "";
            row["CATEGORY '15"] = "";
            row["SUB CATEGORY '15"] = "";
            row["AGE GROUP '15"] = "";
            var year = "";
            _.each(key.sports, function(sport) {
              if (sport.year == "2016") {
                year = "16";
              } else {
                year = "15";
              }
              if (sport.name) {
                row["SPORTS " + "'" + year] += sport.name + ", ";
              } else {
                row["SPORTS " + "'" + year] += "N.A." + ", ";
              }
              if (sport.firstcategory) {
                row["CATEGORY " + "'" + year] += sport.firstcategory + ", ";
              } else {
                row["CATEGORY " + "'" + year] += "N.A." + ", ";
              }
              if (sport.secondcategory) {
                row['SUB CATEGORY ' + "'" + year] += sport.secondcategory + ", ";
              } else {
                row['SUB CATEGORY ' + "'" + year] += "N.A." + ", ";
              }
              if (sport.agegroup) {
                row['AGE GROUP ' + "'" + year] += sport.agegroup + ", ";
              } else {
                row['AGE GROUP ' + "'" + year] += "N.A." + ", ";
              }
            });
            excelData.push(row);
          });
          excelData = _.sortBy(excelData, function(key) {
            return key.SFAID;
          });
          var xls = sails.json2xls(excelData);
          var folder = "./.tmp/";
          var path = "Students ALL - " + new Date() + ".xlsx";
          var finalPath = folder + path;
          sails.fs.writeFile(finalPath, xls, 'binary', function(err) {
            if (err) {
              res.callback(err, null);
            } else {
              sails.fs.readFile(finalPath, function(err, excel) {
                if (err) {
                  res.callback(err, null);
                } else {
                  res.set('Content-Type', "application/octet-stream");
                  res.set('Content-Disposition', "attachment;filename=" + path);
                  res.send(excel);
                  sails.fs.unlink(finalPath);
                }
              });
            }
          });
        }
      });
    });
  }

};
