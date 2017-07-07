/**
 * LeagueKnockoutController
 *
 * @description :: Server-side logic for managing LeagueKnockouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      LeagueKnockout.saveData(req.body, function (err, respo) {
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
      LeagueKnockout.getAll(req.body, function (err, respo) {
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
  getLastLeagueKnockout: function (req, res) {
    if (req.body) {
      LeagueKnockout.getLastLeagueKnockout(req.body, function (err, respo) {
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
  getLimited: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        LeagueKnockout.findLimited(req.body, res.callback);
      } else {
        res.json({
          value: false,
          data: "Invalid Params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
  deleteData: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        LeagueKnockout.deleteData(req.body, function (err, respo) {
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
        LeagueKnockout.getOne(req.body, function (err, respo) {
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
        LeagueKnockout.findForDrop(req.body, function (err, respo) {
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
  getSportRoundLeagueKnockout: function (req, res) {
    if (req.body) {
      if (req.body.sport) {
        LeagueKnockout.getSportRoundLeagueKnockout(req.body, function (err, respo) {
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
          data: "Input inadequate"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  exportSwissLeague: function (req, res) {
    var checkObj = {};
    checkObj = {
      'sport': req.query.sport
    };
    LeagueKnockout.find(checkObj).sort({
      roundno: -1,
      order: 1
    }).deepPopulate('player1.school player2.school team1.school team2.school', "name sfaid school").populate('player1', "name sfaid ").populate('player2', "name sfaid").populate('sport').populate("agegroup", "name").populate('team1', 'name sfaid').populate('team2', 'name sfaid').exec(function (err, data2) {

      var excelData = [];
      var row = {};
      _.each(data2, function (key) {
        row = {};
        row = {
          "MATCH ID": key.matchid,
          "PARTICIPANT TYPE": key.participantType,
          "ROUND NAME": key.leagueknockoutround,
          "ORDER": key.order
        };
        if (key.leagueknockoutround.toLowerCase() == "final") {
          row['ROUND NAME'] = key.round;
        }
        if (key.sport) {
          row.SPORT = key.sport.sportslist.name + ' ' + ((key.sport.firstcategory.name) ? (key.sport.firstcategory.name) : '') + ' ' + key.sport.agegroup.name + ' ' + key.sport.gender + ' ';
        }
        if (key[key.participantType + '1'] && key[key.participantType + '1'].school) {
          row['SFAID 1'] = key[key.participantType + '1'].sfaid;
          row['PARTICIPANT 1'] = key[key.participantType + '1'].name;
          row['SCHOOL 1'] = key[key.participantType + '1'].school.name;

          row['RESULT 1'] = key['result' + key.participantType + '1'];
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

          row['RESULT 2'] = key['result' + key.participantType + '2'];
        } else {
          row['SFAID 2'] = '';
          row['PARTICIPANT 2'] = '';
          row['SCHOOL 2'] = '';
          row['RESULT 2'] = '';

        }
        row.SCORE = key.score;
        row.VIDEO = key.video;
        excelData.push(row);
      });
      if (data2.length > 0) {
        Config.generateExcel("Knockout " + data2[0].sport.sportslist.name + ' ' + ((data2[0].sport.firstcategory.name) ? (data2[0].sport.firstcategory.name) : '') + ' ' + data2[0].sport.agegroup.name + ' ' + data2[0].sport.gender + ' ', excelData, res);
      } else {
        Config.generateExcel("Knockout ", excelData, res);
      }
    });
  },
  updateVideoURL: function (req, res) {
    req.file("file").upload(function (err, uploadedFiles) {
      var results = [];

      function saveMe(num) {
        var knockout = {};
        knockout.matchid = parseInt(results[num]["MATCH ID"]);
        knockout.video = results[num].VIDEO;
        // console.log(knockout);
        LeagueKnockout.findOneAndUpdate({
          matchid: knockout.matchid
        }, {
          $set: {
            video: knockout.video
          }
        }, {
          new: true
        }, function (err, data) {
          console.log(err);
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            // console.log("new"data);
            saveAll(++num);
          }

        });
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
