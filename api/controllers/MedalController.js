/**
 * MedalController
 *
 * @description :: Server-side logic for managing Medals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoXlsx = require('mongo-xlsx');
xlsxj = require("xlsx-to-json");

module.exports = {
  saveData: function(req, res) {
    if (req.body) {
      if (req.body.medal && req.body.medal !== null) {
        Medal.saveData(req.body, function(err, respo) {
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
          data: "Input Medal"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  uploadMedal: function(req, res) {

    req.file("file").upload(function(err, uploadedFiles) {
      var results = [];

      function saveMe(num) {
        // console.log(results[num]);
        var media = {};
        // console.log(num);

        media = results[num];
        if (results[num].date) {
          media.date = new Date(results[num].date);
        }
        if (results[num].order) {
          media.order = parseInt(results[num].order);
        }
        if (results[num].imageorder) {
          media.imageorder = parseInt(results[num].imageorder);
        }
        Medal.saveData(media, function(err, data) {
          if (err) {
            res.json({
              value: false,
              error: err
            });
          } else {
            saveAll(++num);
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
        // console.log(uploadedFiles[0].fd);
        xlsxj({
          input: uploadedFiles[0].fd,
          output: ".tmp/public/output.json"
        }, function(err, result) {
          if (err) {
            res.json({
              value: false,
              error: err
            });
          } else {
            results = _.cloneDeep(result);
            console.log(results);
            saveAll(0);
          }
        });
      }
    });
  },
  getAll: function(req, res) {
    if (req.body) {
      Medal.getAll(req.body, function(err, respo) {
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
  countOneSchoolMedal: function(req, res) {
    if (req.body) {
      if(req.body.school && req.body.year){
        Medal.countOneSchoolMedal(req.body, function(err, respo) {
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
      }else{
        res.json({
          value:false,
          data:"Input inadequate"
        });
      }

    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  countOneStudentMedal: function(req, res) {
    if (req.body) {
      if(req.body.student && req.body.year){
        Medal.countOneStudentMedal(req.body, function(err, respo) {
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
      }else{
        res.json({
          value:false,
          data:"Input inadequate"
        });
      }

    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  deleteAllPointData: function(req, res) {
    if (req.body) {
      Medal.deleteAllPointData(req.body, function(err, respo) {
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
  deleteAllMedal: function(req, res) {
    if (req.body) {
      Medal.deleteAllMedal(req.body, function(err, respo) {
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
  getAllBySport: function(req, res) {
    if (req.body) {
      if (req.body.sport) {
        Medal.getAllBySport(req.body, function(err, respo) {
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
          data: "Input Sport"
        });
      }
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
        Medal.findLimited(req.body, res.callback);
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
  deleteData: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        Medal.deleteData(req.body, function(err, respo) {
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
        Medal.getOne(req.body, function(err, respo) {
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
  findForDrop: function(req, res) {
    if (req.body) {
      if (req.body.firstcategory && Array.isArray(req.body.firstcategory)) {
        Medal.findForDrop(req.body, function(err, respo) {
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
