/**
 * QualifyingRoundController
 *
 * @description :: Server-side logic for managing QualifyingRounds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      QualifyingKnockout.saveData(req.body, function (err, respo) {
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
      QualifyingKnockout.getAll(req.body, function (err, respo) {
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
        QualifyingKnockout.deleteData(req.body, function (err, respo) {
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
  getLastQualifyingKnockout: function (req, res) {
    if (req.body) {
      QualifyingKnockout.getLastQualifyingKnockout(req.body, function (err, respo) {
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
  getOne: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        QualifyingKnockout.getOne(req.body, function (err, respo) {
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
        QualifyingKnockout.findForDrop(req.body, function (err, respo) {
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

  exportQualify: function (req, res) {
    var checkObj = {};
    checkObj = {
      'sport': req.query.sport
    };
    QualifyingKnockout.find(checkObj).sort({
      roundno: -1,
      order: 1
    }).deepPopulate('player.school', "name sfaid school").populate('player', "name sfaid ").populate('sport').populate("agegroup", "name").exec(function (err, data2) {

      console.log("DATA2", data2);

      var excelData = [];
      var row = {};
      _.each(data2, function (key) {
        row = {};
        row = {
          "MATCH ID": key.matchid,
          "PARTICIPANT TYPE": key.participantType,
          "ROUND NAME": key.round,
          "ORDER": key.order
        };
        if (key.sport) {
          row.SPORT = key.sport.sportslist.name + ' ' + ((key.sport.firstcategory.name) ? (key.sport.firstcategory.name) : '') + ' ' + key.sport.agegroup.name + ' ' + key.sport.gender + ' ';
        }
        if (key[key.participantType] && key[key.participantType].school) {
          row['SFAID'] = key[key.participantType].sfaid;
          row['PARTICIPANT'] = key[key.participantType].name;
          row['SCHOOL'] = key[key.participantType].school.name;

          row['RESULT'] = key['result' + key.participantType];
        } else {
          row['SFAID'] = '';
          row['PARTICIPANT'] = '';
          row['SCHOOL'] = '';

          row['RESULT'] = '';
        }

        row.SCORE = key.score;
        row.VIDEO = key.video;
        excelData.push(row);
      });
      if (data2.length > 0) {
        Config.generateExcel("Qualifying Knockout " + data2[0].sport.sportslist.name + ' ' + ((data2[0].sport.firstcategory.name) ? (data2[0].sport.firstcategory.name) : '') + ' ' + data2[0].sport.agegroup.name + ' ' + data2[0].sport.gender + ' ', excelData, res);
      } else {
        Config.generateExcel("Qualifying Knockout ", excelData, res);
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
        QualifyingKnockout.findOneAndUpdate({
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
