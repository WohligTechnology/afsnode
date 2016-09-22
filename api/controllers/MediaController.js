/**
 * MediaController
 *
 * @description :: Server-side logic for managing Medias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoXlsx = require('mongo-xlsx');
xlsxj = require("xlsx-to-json");

module.exports = {
  saveData: function(req, res) {
    if (req.body) {
      Media.saveData(req.body, function(err, respo) {
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
  uploadMedia: function(req, res) {
    req.file("file").upload(function(err, uploadedFiles) {
      if (err) {
        console.log(err);
      } else {
        var model = null;
        console.log(uploadedFiles[0].fd);
        // mongoXlsx.xlsx2MongoData(uploadedFiles[0].fd, model, function(err, mongoData) {
        //   // console.log('Mongo data: ', mongoData);
        // });
        xlsxj({
          input: uploadedFiles[0].fd,
          output: "output.json"
        }, function(err, result) {
          if (err) {
            res.json({
              value:false,
              error:err
            });
          } else {
            res.json({
              value:true,
              data:result
            });
          }
        });
      }
    });
  },
  getAll: function(req, res) {
    if (req.body) {
      Media.getAll(req.body, function(err, respo) {
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
        Media.deleteData(req.body, function(err, respo) {
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
        Media.getOne(req.body, function(err, respo) {
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
        Media.findForDrop(req.body, function(err, respo) {
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
