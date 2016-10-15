/**
 * TeamController
 *
 * @description :: Server-side logic for managing Teams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function(req, res) {
    if (req.body) {
      Team.saveData(req.body, function(err, respo) {
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
  getLimited: function(req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        Team.findLimited(req.body, res.callback);
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
  getAll: function(req, res) {
    if (req.body) {
      Team.getAll(req.body, function(err, respo) {
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
  getLastId: function(req, res) {
    if (req.body) {
      Team.getLastId(req.body, function(err, respo) {
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
  countTeam: function(req, res) {
      if (req.body) {
          Team.countTeam(req.body, function(err, respo) {
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
  searchTeam: function(req, res) {
      if (req.body) {
          if (req.body.pagesize && req.body.pagenumber) {
              Team.searchTeam(req.body, function(err, respo) {
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
                  data: "Invalid params"
              });
          }
      } else {
          res.json({
              value: false,
              data: "Invalid call"
          });
      }
  },
  getTeamsbySport: function(req, res) {
    if (req.body) {
      Team.getTeamsbySport(req.body, function(err, respo) {
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
        Team.deleteData(req.body, function(err, respo) {
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
        Team.getOne(req.body, function(err, respo) {
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
  getOneTeamByName: function(req, res) {
    if (req.body) {
      if (req.body.name && req.body.name !== "") {
        Team.getOneTeamByName(req.body, function(err, respo) {
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
  excelDownload: function(req, res) {
    Team.find({}, {}, {}, function(err, response) {
      if (err) {
        res.json({
          value: false,
          error: err
        });
      } else {
        var excelData = [];
        var row = {};
        _.each(response, function(key) {
          row = {};
          row.CATEGORY= "";
          console.log(key);
          row = {
            "SFAID": key.sfaid,
            "YEAR": key.year
            // "COACH": key.coach
          };

          if(key.school){
            row.SCHOOL= key.school.name;
          }
          row["TEAM NAME"]= key.name;

          if(key.sport){
            row.SPORT= key.sport.name;
          }
          if(key.category){
            row.CATEGORY= key.category.name;
          }
          row.GENDER= key.gender;

          if(key.agegroup){
            row["AGE GROUP"]= key.agegroup.name;
          }
          row.COACH = key.coach;
          if(key.captain){
            row.CAPTAIN= key.captain.firstname;
          }
          if(key.players){
            row["TOTAL PLAYERS"]= key.players.length;
            row["ALL PLAYERS ( ALONG WITH THE CAPTAIN )"]="";
            _.each(key.players,function (key) {
              row["ALL PLAYERS ( ALONG WITH THE CAPTAIN )"] += key.firstname +", ";
            });
          }
          excelData.push(row);
        });
        excelData = _.sortBy(excelData, function(key) {
          return key.SFAID;
        });
        Config.generateExcel("Team", excelData, res);
      }
    }).populate('players').populate('school', "name").populate('sport', "name").populate('category', "name").populate('agegroup', "name").populate('captain', "firstname name").populate('players', "firstname name");
  }
};
