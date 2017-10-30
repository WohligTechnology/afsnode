/**
 * HeatController
 *
 * @description :: Server-side logic for managing Heats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      Heat.saveData(req.body, function (err, respo) {
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
      Heat.getAll(req.body, function (err, respo) {
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
      if (req.body._id && req.body._id != "") {
        Heat.deleteData(req.body, function (err, respo) {
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
        Heat.getOne(req.body, function (err, respo) {
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
  getSportRoundHeat: function (req, res) {
    if (req.body) {
      if (req.body.sport) {
        Heat.getSportRoundHeat(req.body, function (err, respo) {
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
  updateVideoURL: function (req, res) {
    req.file("file").upload(function (err, uploadedFiles) {
      // res.callback(null,uploadedFiles);
      var results = [];

      function saveMe(num) {
        var heat = {};
        var vdo = results[num].RESULTS;
        heat.matchid = parseInt(results[num]["MATCH ID"]);

        Heat.findOne({
          matchid: heat.matchid
        }, function (err, data) {
          console.log(err);
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            // console.log("new"data);
            if (results[num].VIDEO) {
              console.log("Inside if");
              var videoArr = _.split(results[num].VIDEO, ',');
              console.log("videoArr", videoArr);
              if (videoArr.length == 1) {
                console.log("Inside 2nd if");
                data.video = videoArr[0];
                async.concatSeries(data.heats, function (heat, callback) {
                  heat.video = results[num].VIDEO;
                  callback(null, heat);
                }, function (err, finalArr) {
                  data.heats = finalArr;
                  Heat.saveData(data, function (data) {
                    saveAll(++num);
                  });

                });
              } else {
                console.log("Inside 2nd else");
                data.video = "";
                var participantsArr = _.split(results[num].PARTICIPANTS, ',');
                console.log("participantsArr", participantsArr);
                async.concatSeries(participantsArr, function (singleParticipant, callback) {
                  var singleParticipantKey = _.indexOf(participantsArr, singleParticipant);
                  console.log("singleParticipantKey", singleParticipantKey);
                  // console.log("results[num].PARTICIPANTS", results[num].PARTICIPANTS);
                  var sfaId = _.trim(_.split(singleParticipant, '.')[0]);
                  var matchObj = {
                    'sfaid': sfaId
                  }
                  Student.findOne(matchObj).lean().exec(function (err, student) {
                    // console.log("student", student);
                    if (err || !student) {
                      callback();
                    } else {
                      var studentId = student._id;
                      console.log("matchObj", matchObj);
                      var index = _.findIndex(data.heats, ['player', studentId]);
                      console.log("index", index);
                      console.log("videoArr[singleParticipantKey]", videoArr[singleParticipantKey]);
                      data.heats[index].video = videoArr[singleParticipantKey];
                      console.log("data.heats[index].video", data.heats[index].video);
                      callback(null, data.heats[index]);
                    }

                  })
                }, function (err, finalArr) {
                  data.heats = finalArr;
                  Heat.saveData(data, function (data) {
                    saveAll(++num);
                  });

                });
              }

            } else {
              console.log("Inside else");
              data.video = "";
              saveAll(++num);
            }
          }

        });
      }

      function saveAll(num) {
        console.log(results.length, " <= ", num);
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
        xlsxj({
          input: uploadedFiles[0].fd,
          output: ".tmp/public/output.json"
        }, function (err, result) {

          // res.callback(null,result);
          if (err) {
            res.json({
              value: false,
              error: err
            });
          } else {
            results = _.cloneDeep(result);
            // console.log("results", results);
            saveAll(0);
          }
        });
      }
    });
  },

  exportHeat: function (req, res) {
    var checkObj = {};
    checkObj = {
      'sport': req.query.sport
    };
    Heat.find(checkObj).sort({
      roundno: -1,
      order: 1
    }).deepPopulate('heats.player.school', "name sfaid school").populate('sport').populate('heats.player', 'name firstname sfaid').populate('heats.team', 'name sfaid').exec(function (err, data2) {


      ////DONE
      //   console.log("data School", data2[0].heats[0].player.school.name);
      //   console.log("data Lane", data2[0].heats[0].laneno);
      //   console.log("data Lane", data2[0].heats[0].timing);
      //DONE
      var excelData = [];
      var row = {};
      _.each(data2, function (key) {
        // console.log("KEy Timing", key.heats[key].timing);
        // console.log("KEy LANE", key.heats[key].laneno);
        // console.log("KEy School", key.heats[key].player.school.name);
        row = {};
        row = {
          "MATCH ID": key.matchid,
          "PARTICIPANT TYPE": key.participantType,
          "ROUND": key.round,
          "HEAT NAME": key.name
        };
        if (key.sport) {
          row.SPORT = key.sport.sportslist.name + ' ' + ((key.sport.firstcategory.name) ? (key.sport.firstcategory.name) : '') + ' ' + key.sport.agegroup.name + ' ' + key.sport.gender + ' ';
        }
        row['PARTICIPANTS'] = "";

        row['SCHOOL'] = "";
        row['LANE NUMBER'] = "";
        1
        row['TIMING'] = "";
        row['RESULTS'] = "";

        if (key.heats.length > 0) {
          _.each(key.heats, function (it) {
            if (it[key.participantType]) {
              row['PARTICIPANTS'] += it[key.participantType].sfaid + ". " + it[key.participantType].name + ', ';

              if (it[key.participantType].school) {

                row['SCHOOL'] += it[key.participantType].school.name + ". " + ', ';
              } else {
                row['SCHOOL'] += 'Undeclared' + ', ';

              }

              row['LANE NUMBER'] += it.laneno + ' , ';
              row['TIMING'] += it.timing + ' , ';


              row['RESULTS'] += it.result + ', ';

              // console.log("IT SCHOOL", it.timing);
            } else {
              row['PARTICIPANTS'] += 'Undeclared' + ', ';
              row['RESULTS'] += 'Undeclared' + ', ';
              row['TIMING'] += 'Undeclared' + ', ';
              row['LANE NUMBER'] += 'Undeclared' + ', ';
            }

          });
        }

        row['VIDEO'] = _.map(key.heats, function (n) {
          return n.video;
        });
        // row['VIDEO']=row['VIDEO'].join();
        var hist = {};
        _.map(row['VIDEO'], function (a) {
          if (a in hist) hist[a]++;
          else hist[a] = 1;
        });
        console.log("hist", hist);
        if (Object.keys(hist).length == 1) {
          row['VIDEO'] = row['VIDEO'][0];
        } else {
          row['VIDEO'] = row['VIDEO'].join();
        }

        // _.each()
        excelData.push(row);
      });
      if (data2.length > 0) {
        Config.generateExcel("Heat " + data2[0].sport.sportslist.name + ' ' + ((data2[0].sport.firstcategory.name) ? (data2[0].sport.firstcategory.name) : '') + ' ' + data2[0].sport.agegroup.name + ' ' + data2[0].sport.gender + ' ', excelData, res);
      } else {
        Config.generateExcel("Heat ", excelData, res);
      }
    });
  },






  getLastHeat: function (req, res) {
    if (req.body) {
      Heat.getLastHeat(req.body, function (err, respo) {
        if (err) {
          console.log("in err");
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
  findForDrop: function (req, res) {
    if (req.body) {
      if (req.body.thirdcategory && Array.isArray(req.body.thirdcategory)) {
        Heat.findForDrop(req.body, function (err, respo) {
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
  }
};
