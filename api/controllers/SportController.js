/**
 * SportController
 *
 * @description :: Server-side logic for managing Sports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var objectid = require("mongodb").ObjectId;
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      Sport.saveData(req.body, function (err, respo) {
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
      Sport.getAll(req.body, function (err, respo) {
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
  updateAllSportRef: function (req, res) {
    if (req.body) {
      Sport.updateAllSportRef(req.body, function (err, respo) {
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
        Sport.deleteData(req.body, function (err, respo) {
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
      if (req.body._id && req.body._id != "") {
        Sport.getOne(req.body, function (err, respo) {
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
  getOneSportForResult: function (req, res) {
    if (req.body) {
      if (req.body.sport && req.body.sport != "") {
        Sport.getOneSportForResult(req.body, function (err, respo) {
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
  getSportforTeam: function (req, res) {
    if (req.body) {
      Sport.getSportforTeam(req.body, function (err, respo) {
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
  getSports: function (req, res) {
    if (req.body) {
      Sport.getSports(req.body, function (err, respo) {
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
  knockoutSports: function (req, res) {
    if (req.body) {
      Sport.knockoutSports(req.body, function (err, respo) {
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
  drawSports: function (req, res) {
    if (req.body) {
      Sport.drawSports(req.body, function (err, respo) {
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
  getSportBySportlist: function (req, res) {
    if (req.body) {
      Sport.getSportBySportlist(req.body, function (err, respo) {
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
  heatSports: function (req, res) {
    if (req.body) {
      Sport.heatSports(req.body, function (err, respo) {
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
  leagueSports: function (req, res) {
    if (req.body) {
      Sport.leagueSports(req.body, function (err, respo) {
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
  getSportsByYear: function (req, res) {
    if (req.body) {
      Sport.getSportsByYear(req.body, function (err, respo) {
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
  getSportsByYearHeat: function (req, res) {
    if (req.body) {
      Sport.getSportsByYearHeat(req.body, function (err, respo) {
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
        Sport.findLimited(req.body, res.callback);
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
  getMinMaxForTeam: function (req, res) {
    if (req.body) {
      Sport.getMinMaxForTeam(req.body, function (err, respo) {
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
  filterCategory: function (req, res) {
    if (req.body) {
      // if (req.body._id && req.body.year) {
      Sport.filterCategory(req.body, function (err, respo) {
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
      // } else {
      //     res.json({
      //         value: false,
      //         data: "Invalid params"
      //     });
      // }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  filterCategoryForFrontend: function (req, res) {
    if (req.body) {
      Sport.filterCategoryForFrontend(req.body, function (err, respo) {
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
  filterCategoryForFrontendGender: function (req, res) {
    if (req.body) {
      if (req.body.sportList && objectid.isValid(req.body.sportList)) {
        Sport.filterCategoryForFrontendGender(req.body, function (err, respo) {
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
          data: 'Invalid call'
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  filterAgegroupForFrontend: function (req, res) {
    if (req.body) {
      if (req.body.sportList && objectid.isValid(req.body.sportList)) {
        Sport.filterAgegroupForFrontend(req.body, function (err, respo) {
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
          data: 'Not Object Id'
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  excelDownload: function (req, res) {
    Sport.find({}, {}, {}, function (err, response) {
      if (err) {
        res.json({
          value: false,
          error: err
        });
      } else {
        var excelData = [];
        var row = {};
        _.each(response, function (key) {
          row = {};
          row = {
            "YEAR": key.year,
            "SPORT NAME": "",
            "GENDER": key.gender,
            "MIN PLAYER": key.minPlayers,
            "MAX PLAYER": key.maxPlayers,
            "CATEGORY": "",
            "AGE GROUP": "",
            "SUB-CATEGORY": "",
            "FORMAT": key.drawFormat,
          };
          if (key.sportslist) {
            row["SPORT NAME"] = key.sportslist.name;

          }
          if (key.firstcategory) {
            row.CATEGORY = key.firstcategory.name;

          }
          if (key.secondcategory) {
            row["SUB-CATEGORY"] = key.secondcategory.name;

          }
          if (key.agegroup) {
            row["AGE GROUP"] = key.agegroup.name;

          }
          excelData.push(row);
        });
        Config.generateExcel("Sports", excelData, res);
      }
    });
  },
  findSportDetail: function (req, res) {
    if (req.body) {
      Sport.findSportDetail(req.body, function (err, respo) {
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
  }
};
