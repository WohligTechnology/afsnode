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
      var results = [];
      function saveMe(num) {
        // console.log(results[num]);
        var media = {};
        // console.log(num);

        media = results[num];
        if(results[num].date){
          media.date = new Date(results[num].date);
        }
        if(results[num].order){
          media.order = parseInt(results[num].order);
        }
        if(results[num].imageorder){
          media.imageorder = parseInt(results[num].imageorder);
        }
        Media.saveData(media,function (err,data) {
          if(err){
            res.json({
              value:false,
              error:err
            });
          }else{
            saveAll(++num);
          }
        });
      }
      function saveAll(num) {
        console.log(results.length," <= ",num);
        if(results.length <= num){
          res.json({
            value:true,
            data:"Everything Done"
          });
        }else{
          saveMe(num);
        }
      }
      if (err) {
        console.log(err);
      } else {
        var model = null;
        console.log(uploadedFiles[0].fd);
        xlsxj({
          input: uploadedFiles[0].fd,
          output: ".tmp/public/output.json"
        }, function(err, result) {
          if (err) {
            res.json({
              value:false,
              error:err
            });
          } else {
            results = _.cloneDeep(result);
            saveAll(0);
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
  getLimited: function(req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        Media.findLimited(req.body, res.callback);
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
