/**
 * SwissLeagueController
 *
 * @description :: Server-side logic for managing SwissLeagues
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      SwissLeague.saveData(req.body, function (err, respo) {
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
  getAll: function (req, res) {
    if (req.body) {
      SwissLeague.getAll(req.body, function (err, respo) {
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
  getLastSwissLeague: function (req, res) {
    if (req.body) {
      SwissLeague.getLastSwissLeague(req.body, function (err, respo) {
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

  deleteData: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        SwissLeague.deleteData(req.body, function (err, respo) {
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
  getOne: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        SwissLeague.getOne(req.body, function (err, respo) {
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
  findForDrop: function (req, res) {
    if (req.body) {
      if (req.body.firstcategory && Array.isArray(req.body.firstcategory)) {
        SwissLeague.findForDrop(req.body, function (err, respo) {
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
          data: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Please provide parameters"
      });
    }
  },
  exportSwissLeague: function (req, res) {
    var checkObj = {};
    checkObj = {
      'sport': req.query.sport
    };
    SwissLeague.find(checkObj).sort({
      roundno: -1,
      order: 1
    }).deepPopulate('player1.school player2.school team1.school team2.school', "name sfaid school").populate('player1', "name sfaid ").populate('player2', "name sfaid").populate('sport').populate("agegroup", "name").populate('team1', 'name sfaid').populate('team2', 'name sfaid').exec(function (err, data2) {
      console.log(data2);
      var excelData = [];
      var row = {};
      _.each(data2, function (key) {
        row = {};
        row = {
          "MATCH ID": key.matchid,
          "PARTICIPANT TYPE": key.participantType,
          "ROUND NAME": key.round,
          "ORDER": key.order,
          "YEAR": key.year
        };
        if (key.sport) {
          row.SPORT = key.sport.sportslist.name + ' ' + ((key.sport.firstcategory.name) ? (key.sport.firstcategory.name) : '') + ' ' + key.sport.agegroup.name + ' ' + key.sport.gender + ' ';
        }
        if (key[key.participantType + '1'] && key[key.participantType + '1'].school) {
          row['SFAID 1'] = key[key.participantType + '1'].sfaid;
          row['PARTICIPANT 1'] = key[key.participantType + '1'].name;
          row['SCHOOL 1'] = key[key.participantType + '1'].school.name;

          row['RESULT 1'] = key['result1'];
        } else {
          row['SFAID 1'] = '';
          row['PARTICIPANT 1'] = '';
          row['SCHOOL 1'] = '';

          row['RESULT 1'] = '';
        }
        if (key[key.participantType + '2'] && key[key.participantType + '2'].school) {
          row['SFAID 2'] = key[key.participantType + '2'].sfaid;
          row['PARTICIPANT 2'] = key[key.participantType + '2'].name;
          row['SCHOOL 2'] = key[key.participantType + '2'].school.name;
          console.log("DAATTAAA-->2 ", key[key.participantType + '2'].school.name);

          row['RESULT 2'] = key['result2'];
        } else {
          row['SFAID 2'] = '';
          row['PARTICIPANT 2'] = '';
          row['SCHOOL 2'] = '';
          row['RESULT 2'] = '';

        }
        excelData.push(row);
      });
      if (data2.length > 0) {
        Config.generateExcel("Swiss_League " + data2[0].sport.sportslist.name + ' ' + ((data2[0].sport.firstcategory.name) ? (data2[0].sport.firstcategory.name) : '') + ' ' + data2[0].sport.agegroup.name + ' ' + data2[0].sport.gender + ' ', excelData, res);
      } else {
        Config.generateExcel("Swiss_League ", excelData, res);
      }
    });
  },
  updateVideoURL: function (req, res) {
    req.file("file").upload(function (err, uploadedFiles) {
      var results = [];
      var numin = 0;
      var swissleaguedata = {};
      var matchid = NaN;
      var sprt1 = [];

      function saveMe(num) {
        numin = num;
        sprt1 = [];
        swissleaguedata = {};
        matchid = parseInt(results[num]["MATCH ID"]);
        swissleaguedata.roundno = parseInt(results[num]["ORDER"]);
        swissleaguedata.round = results[num]["ROUND NAME"];
        swissleaguedata.result1 = results[num]["RESULT 1"];
        swissleaguedata.result2 = results[num]["RESULT 2"];
        swissleaguedata.year = results[num]["YEAR"];

        var sprt = [];
        var cnt = results[num]["SPORT"].split(' ');
        var stng = "";

        _.each(cnt, function (n, key) {
          if (n != '') {
            sprt.push(n);
          }
        });
        _.each(sprt, function (n, key) {
          if (key < sprt.length - 2) {
            if (key === 0) {
              stng = stng + n;
            } else {
              stng = stng + " " + n;
            }

            sprt1[0] = stng;
          } else {
            sprt1.push(n);
          }
        });

        var arrFunction = [
          getSport, getFirstStudent, getSecondStudent
        ];
        if (matchid) {
          arrFunction.push(findAndUpdate);
        } else {
          arrFunction.push(createNewEntry);
        }
        async.waterfall(arrFunction, function (err, data) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            saveAll(++num);
          }
        });

      }

      function getSport(callback) {
        var jsonToSend = {
          "sport": sprt1[0],
          "age": sprt1[1],
          "gender": sprt1[2]
        };
        Sport.findSportDetail(jsonToSend, callback);
      }

      function getFirstStudent(sport, callback) {
        console.log("sport sport sport", sport);
        swissleaguedata.sport = sport._id;
        Student.findStudentBySfaId({
          "sfaid": results[numin]["SFAID 1"]
        }, callback);
      }

      function getSecondStudent(std1, callback) {
        swissleaguedata.player1 = std1._id;
        Student.findStudentBySfaId({
          "sfaid": results[numin]["SFAID 2"]
        }, callback);
      }

      function createNewEntry(std2, callback) {
        swissleaguedata.player2 = std2._id;
        SwissLeague.saveData(swissleaguedata, callback);
      }

      function findAndUpdate(std2, callback) {
        swissleaguedata.player2 = std2._id;
        SwissLeague.findOneAndUpdate({
          matchid: matchid
        }, {
          $set: swissleaguedata
        }, {
          new: true
        }, callback);
      }

      function saveAll(num) {
        // console.log(results.length," <= ",num);
        if (results.length <= num) {
          res.json({
            value: true,
            data: "Everything Done"
          });
        } else {
          saveMe(num);
        }
      }
      if (err) {
        console.log(err);
      } else {
        var model = null;
        // console.log(uploadedFiles[0].fd);
        xlsxj({
          input: uploadedFiles[0].fd,
          output: ".tmp/public/output.json"
        }, function (err, result) {
          if (err) {
            res.json({
              value: false,
              error: err
            });
          } else {
            results = _.cloneDeep(result);

            saveAll(0);
          }
        });
      }
    });
  },
};
